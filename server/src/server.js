require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const cors = require('cors');
const mysqlSync = require('mysql2'); // callback-style, needed by express-mysql-session
const MySQLStoreFactory = require('express-mysql-session');

const { getConnectionConfig } = require('./db');
const { UPLOAD_DIR } = require('./uploads');
const workRoutes = require('./routes/work');
const adminRoutes = require('./routes/admin');

const app = express();

// Railway terminates TLS at a proxy in front of the app - without this,
// express-session can never see the request as "secure" and refuses to set
// the cookie in production.
app.set('trust proxy', 1);

// Baseline security headers (HSTS, X-Content-Type-Options, X-Frame-Options,
// Referrer-Policy, etc.). Two defaults are overridden because this app is
// deliberately fetched cross-origin:
//  - CSP off: the admin panel (server/admin-public) uses inline <script>/
//    style attributes; enabling CSP needs a nonce/hash pass first.
//  - Cross-Origin-Resource-Policy off: /api/work and /uploads are fetched
//    from the separately-hosted marketing site (see the `cors` calls
//    below) - Helmet's default same-origin CORP would silently block that
//    even though the explicit CORS policy allows it.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://life180labs.com')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Public API: allow the marketing site (Hostinger, a different origin) to
// fetch case studies. GET-only, no cookies involved, so this is low-risk.
app.use('/api/work', cors({ origin: allowedOrigins }), workRoutes);

// Uploaded PDF slideshows - public, read-only, same CORS policy as the API
// above (PDF.js on the frontend fetches these directly).
app.use('/uploads', cors({ origin: allowedOrigins }), express.static(UPLOAD_DIR));

// Fail fast in production rather than silently signing sessions with a
// fallback secret that's sitting in plain sight in this file on GitHub -
// anyone with the fallback could forge a valid session cookie.
if (!process.env.SESSION_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set in production.');
  }
  console.warn('SESSION_SECRET not set - using an insecure default for local development only.');
}

const MySQLStore = MySQLStoreFactory(session);
const sessionPool = mysqlSync.createPool(getConnectionConfig());
const sessionStore = new MySQLStore({ createDatabaseTable: true }, sessionPool);

app.use(
  session({
    name: 'l180.sid',
    secret: process.env.SESSION_SECRET || 'dev-only-change-me',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 12, // 12 hours
    },
  })
);

app.use('/api/admin', adminRoutes);

// Admin panel UI - static files, same origin as the API above, so the
// session cookie just works with no cross-site cookie configuration.
app.use('/admin', express.static(path.join(__dirname, '..', 'admin-public')));

app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`l180 work backend listening on port ${port}`);
});
