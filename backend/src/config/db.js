require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'auction_db',
  user: process.env.DB_USER || 'root',
  password: String(process.env.DB_PASSWORD || ''),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Thin wrapper so the rest of the app can keep using the same
// pool.query(...).rows / client.query(...).rows style it used with pg.
const wrap = (queryable) => ({
  query: async (sql, params = []) => {
    const [result] = await queryable.query(sql, params);
    const rows = Array.isArray(result) ? result : [];
    return {
      rows,
      insertId: result.insertId,
      affectedRows: result.affectedRows,
    };
  },
});

const dbPool = {
  ...wrap(pool),
  connect: async () => {
    const conn = await pool.getConnection();
    return {
      ...wrap(conn),
      release: () => conn.release(),
    };
  },
};

pool.getConnection()
  .then((conn) => {
    console.log('✅ MySQL connected');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ MySQL error:', err.message);
  });

module.exports = dbPool;
