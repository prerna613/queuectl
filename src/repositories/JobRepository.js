const db = require('../database/database');

class JobRepository {
  create(job) {
    const stmt = db.prepare(`
      INSERT INTO jobs (
        id,
        command,
        state,
        attempts,
        max_retries,
        next_retry_at,
        worker_id,
        locked,
        created_at,
        updated_at
      )
      VALUES (
        @id,
        @command,
        @state,
        @attempts,
        @max_retries,
        @next_retry_at,
        @worker_id,
        @locked,
        @created_at,
        @updated_at
      )
    `);

    return stmt.run(job);
  }

  findById(id) {
    return db
      .prepare(`SELECT * FROM jobs WHERE id = ?`)
      .get(id);
  }

  findAll() {
    return db
      .prepare(`SELECT * FROM jobs ORDER BY created_at DESC`)
      .all();
  }

  findPending() {
    return db.prepare(`
      SELECT *
      FROM jobs
      WHERE state = 'pending'
        AND locked = 0
      ORDER BY created_at ASC
    `).all();
  }
  findByState(state) {
  return db
    .prepare(`
      SELECT *
      FROM jobs
      WHERE state = ?
      ORDER BY created_at DESC
    `)
    .all(state);
}

getJobCounts() {
  const rows = db.prepare(`
    SELECT state, COUNT(*) AS count
    FROM jobs
    GROUP BY state
  `).all();

  const counts = {
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    dead: 0,
    total: 0,
  };

  for (const row of rows) {
    counts[row.state] = row.count;
    counts.total += row.count;
  }

  return counts;
}

  update(job) {
    const stmt = db.prepare(`
      UPDATE jobs
      SET
        command=@command,
        state=@state,
        attempts=@attempts,
        max_retries=@max_retries,
        next_retry_at=@next_retry_at,
        worker_id=@worker_id,
        locked=@locked,
        updated_at=@updated_at
      WHERE id=@id
    `);

    return stmt.run(job);
  }

  delete(id) {
    return db
      .prepare(`DELETE FROM jobs WHERE id = ?`)
      .run(id);
  }
}

module.exports = new JobRepository();