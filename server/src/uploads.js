/*
  Shared upload directory resolution. UPLOAD_DIR should point at the
  Railway volume mount path in production (see server/README.md) so files
  survive redeploys; defaults to a local gitignored folder for dev.
*/
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'data', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

module.exports = { UPLOAD_DIR };
