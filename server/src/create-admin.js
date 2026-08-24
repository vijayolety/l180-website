/*
  One-time CLI script to create (or reset the password of) the single admin
  login. Run locally against a local DB with `npm run create-admin -- user pass`,
  or against the Railway DB with `railway run npm run create-admin -- user pass`
  (uses Railway's env vars for that run without needing them locally).
*/
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./db');

async function main() {
  const [username, password] = process.argv.slice(2);

  if (!username || !password) {
    console.error('Usage: node src/create-admin.js <username> <password>');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO admin_users (username, password_hash) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [username, hash]
  );

  console.log(`Admin user "${username}" is ready. Log in at /admin/login.html`);
  await pool.end();
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
