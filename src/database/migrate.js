const fs = require('fs');
const path = require('path');
const db = require('./database');

function migrate() {
  const schemaPath = path.join(__dirname, 'schema.sql');

  const schema = fs.readFileSync(schemaPath, 'utf8');

  db.exec(schema);

  const defaults = [
    ['max_retries', '3'],
    ['backoff_base', '2'],
    ['poll_interval', '1000'],
    ['worker_timeout', '30000'],
  ];

  const stmt = db.prepare(`
        INSERT OR IGNORE INTO config(key,value)
        VALUES (?,?)
    `);

  const transaction = db.transaction(() => {
    for (const config of defaults) {
      stmt.run(config[0], config[1]);
    }
  });

  transaction();

  console.log('✅ Database migrated successfully.');
}

module.exports = migrate;