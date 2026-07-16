const Database = require('better-sqlite3');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const dbPath = path.resolve(process.env.DB_PATH || './queue.db');

const db = new Database(dbPath, {
  fileMustExist: false,
});

// SQLite Configuration
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 10000');
db.pragma('synchronous = NORMAL');

console.log(`✅ SQLite connected: ${dbPath}`);

module.exports = db;