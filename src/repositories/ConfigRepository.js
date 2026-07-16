const db = require('../database/database');

class ConfigRepository {
  get(key) {
    return db
      .prepare('SELECT value FROM config WHERE key = ?')
      .get(key);
  }

  getAll() {
    return db
      .prepare('SELECT key, value FROM config')
      .all();
  }

  set(key, value) {
    return db
      .prepare(`
        INSERT INTO config (key, value)
        VALUES (?, ?)
        ON CONFLICT(key)
        DO UPDATE SET value = excluded.value
      `)
      .run(key, value);
  }

  exists(key) {
    const row = db
      .prepare('SELECT 1 FROM config WHERE key = ?')
      .get(key);

    return !!row;
  }
}

module.exports = new ConfigRepository();