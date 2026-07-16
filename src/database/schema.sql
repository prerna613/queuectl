-- ==========================================
-- QueueCTL Database Schema
-- ==========================================

PRAGMA foreign_keys = ON;

-- ==========================================
-- Jobs
-- ==========================================

CREATE TABLE IF NOT EXISTS jobs (

    id TEXT PRIMARY KEY,

    command TEXT NOT NULL,

    state TEXT NOT NULL CHECK (
        state IN (
            'pending',
            'processing',
            'completed',
            'failed',
            'dead'
        )
    ),

    attempts INTEGER NOT NULL DEFAULT 0,

    max_retries INTEGER NOT NULL DEFAULT 3,

    next_retry_at TEXT,

    worker_id TEXT,

    locked_at TEXT,

    stdout TEXT,

    stderr TEXT,

    last_error TEXT,

    started_at TEXT,

    finished_at TEXT,

    created_at TEXT NOT NULL,

    updated_at TEXT NOT NULL

);

CREATE INDEX IF NOT EXISTS idx_jobs_state
ON jobs(state);

CREATE INDEX IF NOT EXISTS idx_jobs_retry
ON jobs(next_retry_at);

CREATE INDEX IF NOT EXISTS idx_jobs_worker
ON jobs(worker_id);

CREATE INDEX IF NOT EXISTS idx_jobs_locked
ON jobs(locked_at);



-- ==========================================
-- Configuration
-- ==========================================

CREATE TABLE IF NOT EXISTS config (

    key TEXT PRIMARY KEY,

    value TEXT NOT NULL

);



-- ==========================================
-- Job Logs
-- ==========================================

CREATE TABLE IF NOT EXISTS job_logs (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    job_id TEXT NOT NULL,

    level TEXT NOT NULL,

    message TEXT NOT NULL,

    created_at TEXT NOT NULL,

    FOREIGN KEY(job_id)
        REFERENCES jobs(id)
        ON DELETE CASCADE

);