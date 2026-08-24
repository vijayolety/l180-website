/*
  MySQL connection. Works with Railway's MySQL plugin (which sets MYSQL_URL,
  or the discrete MYSQLHOST/MYSQLPORT/MYSQLUSER/MYSQLPASSWORD/MYSQLDATABASE
  vars) and with a local MySQL for dev (DB_HOST/DB_PORT/DB_USER/DB_PASS/
  DB_NAME in .env). See server/README.md.
*/
const mysql = require('mysql2/promise');

function getConnectionConfig() {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;
  if (url) return url;

  return {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASS || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'l180_work',
  };
}

const pool = mysql.createPool(getConnectionConfig());

module.exports = { pool, getConnectionConfig };
