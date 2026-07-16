const Database = require('better-sqlite3');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Database path from .env
const dbPath = process.env.DB_PATH || './queue.db';

// Create SQLite connection
const db = new Database(dbPath);

// Improve reliability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log(`✅ Connected to SQLite Database: ${path.resolve(dbPath)}`);

module.exports = db;