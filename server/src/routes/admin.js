/*
  Admin auth + CRUD for work_items. Served same-origin with the admin panel
  static files (server/admin-public), so plain session cookies work with no
  cross-site cookie complications.

  POST /api/admin/login              -> starts a session
  POST /api/admin/logout             -> ends the session
  GET  /api/admin/me                 -> current admin's username (auth required)
  GET  /api/admin/work               -> list every item, visible + hidden (auth required)
  POST /api/admin/work { action }    -> save | delete | toggle | move (auth + CSRF required)
  POST /api/admin/work/upload-pdf    -> upload a PDF slideshow file (auth + CSRF required)
*/
const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { pool } = require('../db');
const { requireAdminApi, getCsrfToken, checkCsrf } = require('../middleware/auth');
const { UPLOAD_DIR } = require('../uploads');

const router = express.Router();

const ART_KEYS = ['honeycomb', 'orbit', 'grid', 'shield', 'network'];

// The 700ms sleep on a failed attempt (below) only throttles one request at
// a time - an attacker firing attempts in parallel isn't slowed by it at
// all. This caps total attempts per IP regardless of concurrency.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, crypto.randomUUID() + '.pdf'),
  }),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed.'));
    }
    cb(null, true);
  },
});

// Deletes a previously uploaded PDF from disk. pdfPath is the public
// "/uploads/<file>" path stored on the row - never trust it beyond that
// fixed prefix (guards against an unexpected value ever reaching unlink).
function deleteUploadedPdf(pdfPath) {
  if (!pdfPath || !pdfPath.startsWith('/uploads/')) return;
  const filePath = path.join(UPLOAD_DIR, path.basename(pdfPath));
  fs.unlink(filePath, () => {});
}

function slugify(text) {
  const slug = String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'work-item';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, password_hash FROM admin_users WHERE username = ? LIMIT 1',
      [username]
    );
    const row = rows[0];
    const ok = row && (await bcrypt.compare(password, row.password_hash));

    if (!ok) {
      // Small fixed delay on every failed attempt - single-admin internal
      // tool behind a login form, not a public auth surface, so this keeps
      // brute-force slowdown simple without a lockout table.
      await sleep(700);
      return res.status(401).json({ error: 'Incorrect username or password.' });
    }

    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ error: 'Server error - please try again shortly.' });
      req.session.adminId = row.id;
      req.session.adminUsername = username;
      res.json({ ok: true, csrf_token: getCsrfToken(req) });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error - please try again shortly.' });
  }
});

router.post('/logout', (req, res) => {
  if (!req.session) return res.json({ ok: true });
  req.session.destroy(() => {
    res.clearCookie('l180.sid');
    res.json({ ok: true });
  });
});

router.get('/me', requireAdminApi, (req, res) => {
  res.json({ username: req.session.adminUsername });
});

router.get('/work', requireAdminApi, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, slug, title, eyebrow, summary, description, bullets, metrics, art_key, pdf_path, pdf_original_name, link_url, is_visible, sort_order
       FROM work_items
       ORDER BY sort_order ASC, id ASC`
    );

    const origin = `${req.protocol}://${req.get('host')}`;

    const items = rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      eyebrow: row.eyebrow,
      summary: row.summary,
      description: row.description,
      bullets: row.bullets || [],
      metrics: row.metrics || [],
      art_key: row.art_key,
      pdf_path: row.pdf_path,
      pdf_url: row.pdf_path ? origin + row.pdf_path : null,
      pdf_original_name: row.pdf_original_name,
      link_url: row.link_url,
      is_visible: Boolean(row.is_visible),
      sort_order: row.sort_order,
    }));

    res.json({ items, csrf_token: getCsrfToken(req) });
  } catch (err) {
    res.status(500).json({ error: 'Server error - please try again shortly.' });
  }
});

// Multipart upload - handled outside express.json(), so CSRF is checked
// manually here (the token arrives as a form field, not a JSON body).
router.post('/work/upload-pdf', requireAdminApi, (req, res) => {
  upload.single('pdf')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed.' });
    }
    if (!checkCsrf(req, req.body && req.body.csrf_token)) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(403).json({ error: 'Invalid or expired session token - please reload the page.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    res.json({
      ok: true,
      pdf_path: '/uploads/' + req.file.filename,
      pdf_original_name: req.file.originalname,
    });
  });
});

router.post('/work', requireAdminApi, async (req, res) => {
  const body = req.body || {};
  if (!checkCsrf(req, body.csrf_token)) {
    return res.status(403).json({ error: 'Invalid or expired session token - please reload the page.' });
  }

  try {
    switch (body.action) {
      case 'save':
        return await handleSave(req, res, body);
      case 'delete':
        return await handleDelete(req, res, body);
      case 'toggle':
        return await handleToggle(req, res, body);
      case 'move':
        return await handleMove(req, res, body);
      default:
        return res.status(400).json({ error: 'Unknown action.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error - please try again shortly.' });
  }
});

async function handleSave(req, res, body) {
  const id = body.id ? Number(body.id) : null;
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const eyebrow = String(body.eyebrow || '').trim() || 'Case study';
  const summary = String(body.summary || '').trim();
  const artKey = ART_KEYS.includes(body.art_key) ? body.art_key : 'network';

  let linkUrl = String(body.link_url || '').trim() || null;
  if (linkUrl && !/^(\/|https?:\/\/)/i.test(linkUrl)) {
    return res.status(400).json({ error: 'Link URL must start with / or http(s)://' });
  }

  const isVisible = body.is_visible ? 1 : 0;

  // pdf_path/pdf_original_name come from a prior call to /work/upload-pdf
  // (or null if the admin removed the PDF, or unchanged if editing without
  // touching it - see loadPreviousPdf below).
  let pdfPath = body.pdf_path || null;
  let pdfOriginalName = pdfPath ? body.pdf_original_name || null : null;
  if (pdfPath && !pdfPath.startsWith('/uploads/')) {
    return res.status(400).json({ error: 'Invalid PDF reference.' });
  }

  const bullets = String(body.bullets_text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const metrics = [];
  for (const rawLine of String(body.metrics_text || '').split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const sep = line.indexOf('|');
    if (sep === -1) continue;
    const value = line.slice(0, sep).trim();
    const label = line.slice(sep + 1).trim();
    if (value && label) metrics.push([value, label]);
  }

  const bulletsJson = JSON.stringify(bullets);
  const metricsJson = JSON.stringify(metrics);

  if (id === null) {
    let slug = slugify(title);
    const baseSlug = slug;
    let n = 2;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const [rows] = await pool.query('SELECT COUNT(*) AS c FROM work_items WHERE slug = ?', [slug]);
      if (rows[0].c === 0) break;
      slug = `${baseSlug}-${n++}`;
    }

    const [orderRows] = await pool.query(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM work_items'
    );
    const nextOrder = orderRows[0].next_order;

    const [result] = await pool.query(
      `INSERT INTO work_items (slug, title, eyebrow, summary, description, bullets, metrics, art_key, pdf_path, pdf_original_name, link_url, is_visible, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [slug, title, eyebrow, summary, description, bulletsJson, metricsJson, artKey, pdfPath, pdfOriginalName, linkUrl, isVisible, nextOrder]
    );

    return res.json({ ok: true, id: result.insertId });
  }

  const [existingRows] = await pool.query('SELECT pdf_path FROM work_items WHERE id = ?', [id]);
  const previousPdfPath = existingRows[0] && existingRows[0].pdf_path;
  if (previousPdfPath && previousPdfPath !== pdfPath) {
    deleteUploadedPdf(previousPdfPath);
  }

  await pool.query(
    `UPDATE work_items
     SET title = ?, eyebrow = ?, summary = ?, description = ?, bullets = ?, metrics = ?, art_key = ?, pdf_path = ?, pdf_original_name = ?, link_url = ?, is_visible = ?
     WHERE id = ?`,
    [title, eyebrow, summary, description, bulletsJson, metricsJson, artKey, pdfPath, pdfOriginalName, linkUrl, isVisible, id]
  );

  res.json({ ok: true, id });
}

async function handleDelete(req, res, body) {
  const id = Number(body.id || 0);
  if (!id) return res.status(400).json({ error: 'Missing id.' });
  const [rows] = await pool.query('SELECT pdf_path FROM work_items WHERE id = ?', [id]);
  if (rows[0] && rows[0].pdf_path) deleteUploadedPdf(rows[0].pdf_path);
  await pool.query('DELETE FROM work_items WHERE id = ?', [id]);
  res.json({ ok: true });
}

async function handleToggle(req, res, body) {
  const id = Number(body.id || 0);
  if (!id) return res.status(400).json({ error: 'Missing id.' });
  await pool.query('UPDATE work_items SET is_visible = 1 - is_visible WHERE id = ?', [id]);
  res.json({ ok: true });
}

async function handleMove(req, res, body) {
  const id = Number(body.id || 0);
  const direction = body.direction;
  if (!id || !['up', 'down'].includes(direction)) {
    return res.status(400).json({ error: 'Missing id or direction.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT id, sort_order FROM work_items ORDER BY sort_order ASC, id ASC');
    const index = rows.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Item not found.');

    const swapWith = direction === 'up' ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= rows.length) {
      await conn.commit();
      return res.json({ ok: true });
    }

    const a = rows[index];
    const b = rows[swapWith];
    await conn.query('UPDATE work_items SET sort_order = ? WHERE id = ?', [b.sort_order, a.id]);
    await conn.query('UPDATE work_items SET sort_order = ? WHERE id = ?', [a.sort_order, b.id]);
    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Could not reorder: ' + err.message });
  } finally {
    conn.release();
  }
}

module.exports = router;
