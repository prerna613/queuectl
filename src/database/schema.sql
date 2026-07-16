CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,

    command TEXT NOT NULL,

    state TEXT NOT NULL DEFAULT 'pending',

    attempts INTEGER NOT NULL DEFAULT 0,

    max_retries INTEGER NOT NULL DEFAULT 3,

    next_retry_at TEXT,

    worker_id TEXT,

    locked INTEGER NOT NULL DEFAULT 0,

    created_at TEXT NOT NULL,

    updated_at TEXT NOT NULL
);



-- ----------------------------
-- Configuration Table
-- ----------------------------
CREATE TABLE IF NOT EXISTS config (

    key TEXT PRIMARY KEY,

    value TEXT NOT NULL

);



-- ----------------------------
-- Job Logs Table
-- (Bonus Feature)
-- ----------------------------
CREATE TABLE IF NOT EXISTS job_logs (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    job_id TEXT NOT NULL,

    level TEXT NOT NULL,

    message TEXT NOT NULL,

    created_at TEXT NOT NULL,

    FOREIGN KEY(job_id) REFERENCES jobs(id)

);