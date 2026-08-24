/*
  One-off migration runner: applies a db/*.sql file against the configured
  MySQL database. Defaults to db/schema.sql (safe to re-run - every
  statement there uses CREATE TABLE IF NOT EXISTS / INSERT with no ON
  DUPLICATE guard for seed rows, so only run the seed insert once per fresh
  database). Pass a different filename to run a one-off migration, e.g.:
    node src/run-schema.js migrate-001-pdf.sql
*/
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  const fileName = process.argv[2] || 'schema.sql';
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;
  const baseConfig = url
    ? url
    : {
        host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
        port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
        user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
        password: process.env.MYSQLPASSWORD || process.env.DB_PASS || '',
        database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'l180_work',
      };

  const connection = await mysql.createConnection(
    typeof baseConfig === 'string'
      ? baseConfig + (baseConfig.includes('?') ? '&' : '?') + 'multipleStatements=true'
      : { ...baseConfig, multipleStatements: true }
  );

  const sql = fs.readFileSync(path.join(__dirname, '..', 'db', fileName), 'utf8');
  await connection.query(sql);
  console.log(`${fileName} applied successfully.`);
  await connection.end();
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
