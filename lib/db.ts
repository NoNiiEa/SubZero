import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: parseInt(process.env.DB_PORT || '3306'),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'subzero_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export const db = pool;

export async function initDb() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS subs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cost DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'THB',
        period ENUM('monthly', 'yearly') NOT NULL,
        next_due DATE NOT NULL,
        is_trial TINYINT(1) DEFAULT 0,
        discord_sent TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ MySQL Database Initialized');
  } catch (error) {
    console.error('❌ Database init failed:', error);
  }
}