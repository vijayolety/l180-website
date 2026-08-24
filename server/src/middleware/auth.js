const crypto = require('crypto');

function requireAdminApi(req, res, next) {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

function getCsrfToken(req) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  return req.session.csrfToken;
}

function checkCsrf(req, token) {
  const sessionToken = req.session && req.session.csrfToken;
  if (!sessionToken || typeof token !== 'string') return false;
  const a = Buffer.from(sessionToken);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

module.exports = { requireAdminApi, getCsrfToken, checkCsrf };
