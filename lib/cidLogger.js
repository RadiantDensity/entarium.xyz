import Database from "better-sqlite3";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

const dbDir = join(process.cwd(), "data");
const dbPath = join(dbDir, "uploads.db");

if (!existsSync(dbDir)) mkdirSync(dbDir);

const db = new Database(dbPath);

// Create the uploads table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cid TEXT NOT NULL,
    filename TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export function logUpload({ cid, filename }) {
  const stmt = db.prepare(`INSERT INTO uploads (cid, filename) VALUES (?, ?)`);
  stmt.run(cid, filename || null);
}

export function getRecentUploads(limit = 10) {
  return db.prepare(`SELECT * FROM uploads ORDER BY timestamp DESC LIMIT ?`).all(limit);
}
