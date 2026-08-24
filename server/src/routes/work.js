/*
  Public read-only API: visible work items, ordered for display.
  GET /api/work
  Used by work/index.html (static, on Hostinger) and available for any
  future page that wants to pull from the same source.
*/
const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT slug, title, eyebrow, summary, description, bullets, metrics, art_key, pdf_path, link_url
       FROM work_items
       WHERE is_visible = 1
       ORDER BY sort_order ASC, id ASC`
    );

    // Absolute URL: the frontend is a different origin (Hostinger/another
    // Railway service) from this API, so a bare "/uploads/x.pdf" would
    // resolve against the wrong host if returned as-is.
    const origin = `${req.protocol}://${req.get('host')}`;

    const items = rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      eyebrow: row.eyebrow,
      summary: row.summary,
      description: row.description,
      bullets: row.bullets || [],
      metrics: row.metrics || [],
      art_key: row.art_key,
      pdf_url: row.pdf_path ? origin + row.pdf_path : null,
      link_url: row.link_url,
    }));

    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: 'Server error - please try again shortly.' });
  }
});

module.exports = router;
