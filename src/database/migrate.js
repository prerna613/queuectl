const fs = require('fs');
const path = require('path');
const db = require('./database');

function runMigration() {
  const schemaPath = path.join(__dirname, 'schema.sql');

  const schema = fs.readFileSync(schemaPath, 'utf8');

  db.exec(schema);

  console.log('✅ Database schema initialized.');

  // Default configuration
  const defaultConfig = [
    ['max_retries', '3'],
    ['backoff_base', '2'],
    ['poll_interval', '1000'],
    ['worker_timeout', '30000'],
  ];

  const stmt = db.prepare(`
        INSERT OR IGNORE INTO config(key, value)
        VALUES (?, ?)
    `);

  for (const config of defaultConfig) {
    stmt.run(config[0], config[1]);
  }

  console.log('✅ Default configuration loaded.');
}

module.exports = runMigration;