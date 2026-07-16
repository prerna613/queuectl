const db = require('../database/database');

class ConfigRepository {
  get(key) {
    return db
      .prepare(
        `
        SELECT key, value
        FROM config
        WHERE key = ?
      `
      )
      .get(key);
  }

  getAll() {
    return db
      .prepare(
        `
        SELECT key, value
        FROM config
        ORDER BY key
      `
      )
      .all();
  }

  set(key, value) {
    return db
      .prepare(
        `
        UPDATE config
        SET value = ?
        WHERE key = ?
      `
      )
      .run(String(value), key);
  }

  exists(key) {
    const row = db
      .prepare(
        `
        SELECT COUNT(*) AS count
        FROM config
        WHERE key = ?
      `
      )
      .get(key);

    return row.count > 0;
  }
}

module.exports = new ConfigRepository();