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
        locked_at,
        stdout,
        stderr,
        last_error,
        started_at,
        finished_at,
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
        @locked_at,
        @stdout,
        @stderr,
        @last_error,
        @started_at,
        @finished_at,
        @created_at,
        @updated_at
      )
    `);

    return stmt.run(job);
  }

  findById(id) {
    return db.prepare(
      `SELECT * FROM jobs WHERE id = ?`
    ).get(id);
  }

  findAll() {
    return db.prepare(`
      SELECT *
      FROM jobs
      ORDER BY created_at DESC
    `).all();
  }

  findByState(state) {
    return db.prepare(`
      SELECT *
      FROM jobs
      WHERE state = ?
      ORDER BY created_at DESC
    `).all(state);
  }

 claimNextJob(workerId) {
  const transaction = db.transaction(() => {
    const now = new Date().toISOString();

    const job = db.prepare(`
      SELECT *
      FROM jobs
      WHERE state = 'pending'
        AND (
          next_retry_at IS NULL
          OR next_retry_at <= ?
        )
        AND locked_at IS NULL
      ORDER BY created_at ASC
      LIMIT 1
    `).get(now);

    if (!job) {
      return null;
    }

    db.prepare(`
      UPDATE jobs
      SET
        state = 'processing',
        worker_id = ?,
        locked_at = ?,
        started_at = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      workerId,
      now,
      now,
      now,
      job.id
    );

    return db.prepare(`
      SELECT *
      FROM jobs
      WHERE id = ?
    `).get(job.id);
  });

  return transaction();
}
  complete(id, stdout = '') {
    const now = new Date().toISOString();

    return db.prepare(`
      UPDATE jobs
      SET
        state='completed',
        stdout=?,
        finished_at=?,
        locked_at=NULL,
        updated_at=?
      WHERE id=?
    `).run(
      stdout,
      now,
      now,
      id
    );
  }

  fail(id, stderr = '', error = '') {
    const now = new Date().toISOString();

    return db.prepare(`
      UPDATE jobs
      SET
        state='failed',
        attempts=attempts+1,
        stderr=?,
        last_error=?,
        finished_at=?,
        locked_at=NULL,
        updated_at=?
      WHERE id=?
    `).run(
      stderr,
      error,
      now,
      now,
      id
    );
  }
  scheduleRetry(id, attempts, retryTime, error = '') {
    return db.prepare(`
        UPDATE jobs
        SET
            state='pending',
            attempts=?,
            next_retry_at=?,
            last_error=?,
            locked_at=NULL,
            updated_at=?
        WHERE id=?
    `).run(
        attempts,
        retryTime,
        error,
        new Date().toISOString(),
        id
    );
}
resetLock(id) {
    return db.prepare(`
        UPDATE jobs
        SET
            locked_at=NULL,
            worker_id=NULL,
            updated_at=?
        WHERE id=?
    `).run(
        new Date().toISOString(),
        id
    );
}

  moveToDead(id, attempts, error = '') {
  const now = new Date().toISOString();

  return db.prepare(`
    UPDATE jobs
    SET
      state='dead',
      attempts=?,
      locked_at=NULL,
      worker_id=NULL,
      last_error=?,
      finished_at=?,
      updated_at=?
    WHERE id=?
  `).run(
    attempts,
    error,
    now,
    now,
    id
  );
}
findDeadJobs() {
  return db.prepare(`
    SELECT *
    FROM jobs
    WHERE state='dead'
    ORDER BY updated_at DESC
  `).all();
}
retryDeadJob(id) {
  const now = new Date().toISOString();

  return db.prepare(`
    UPDATE jobs
    SET
      state='pending',
      attempts=0,
      next_retry_at=NULL,
      worker_id=NULL,
      locked_at=NULL,
      started_at=NULL,
      finished_at=NULL,
      updated_at=?
    WHERE id=?
      AND state='dead'
  `).run(
    now,
    id
  );
}

  delete(id) {
    return db.prepare(`
      DELETE FROM jobs
      WHERE id=?
    `).run(id);
  }

  getJobCounts() {
    const rows = db.prepare(`
      SELECT state, COUNT(*) count
      FROM jobs
      GROUP BY state
    `).all();

    const result = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      dead: 0,
      total: 0
    };

    for (const row of rows) {
      result[row.state] = row.count;
      result.total += row.count;
    }

    return result;
  }
}

module.exports = new JobRepository();