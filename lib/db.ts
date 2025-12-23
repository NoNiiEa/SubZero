import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';


const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'subzero.db');

const globalForDb = global as unknown as { db: Database.Database };

export const db = globalForDb.db || new Database(dbPath, { 
    verbose: process.env.NODE_ENV === 'development' ? console.log : undefined 
});

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS subs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cost REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    period TEXT CHECK(period IN ('monthly', 'yearly')),
    next_due DATE NOT NULL,
    is_trial INTEGER DEFAULT 0,
    discord_sent INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

