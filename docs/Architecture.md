# QueueCTL - Architecture Design

## Project Overview

QueueCTL is a CLI-based background job queue system that manages asynchronous job execution using multiple worker processes.

The system allows users to enqueue shell commands, execute them in the background, automatically retry failed jobs using exponential backoff, and move permanently failed jobs to a Dead Letter Queue (DLQ).

The project is designed with modular architecture, persistent storage, and clean separation of concerns.

---

# Objectives

- Execute background jobs asynchronously
- Support multiple workers
- Prevent duplicate job execution
- Retry failed jobs automatically
- Persist jobs across application restarts
- Provide a clean command-line interface
- Maintain a Dead Letter Queue (DLQ)
- Keep the code modular and maintainable

---

# Technology Stack

| Component         | Technology     |
| ----------------- | -------------- |
| Runtime           | Node.js        |
| Language          | JavaScript     |
| CLI Framework     | Commander.js   |
| Database          | SQLite         |
| SQLite Library    | better-sqlite3 |
| Command Execution | child_process  |
| Logging           | Winston        |
| Validation        | Zod            |
| Testing           | Jest           |
| Formatting        | Prettier       |
| Linting           | ESLint         |

---

# High-Level Architecture

```
                 User
                   │
                   ▼
             QueueCTL CLI
                   │
      ┌────────────┼────────────┐
      │            │            │
      ▼            ▼            ▼
  Queue Service Worker Service Config Service
      │            │            │
      └────────────┼────────────┘
                   ▼
          Repository Layer
                   │
                   ▼
             SQLite Database
```

---

# Folder Structure

```
queuectl/
│
├── docs/
│   └── ARCHITECTURE.md
│
├── src/
│
│   ├── cli/
│
│   ├── commands/
│
│   ├── config/
│
│   ├── database/
│
│   ├── repositories/
│
│   ├── services/
│
│   ├── workers/
│
│   ├── utils/
│
│   ├── logger/
│
│   └── index.js
│
├── tests/
│
├── logs/
│
├── package.json
│
├── README.md
│
└── .env
```

---

# Layer Responsibilities

## CLI Layer

Responsible for:

- Parsing CLI commands
- Validating user input
- Calling appropriate services

No business logic should exist here.

---

## Service Layer

Responsible for:

- Queue operations
- Worker management
- Retry handling
- Job execution
- Configuration management

Contains all business logic.

---

## Repository Layer

Responsible for:

- Database communication
- SQL queries
- CRUD operations

No business logic should exist here.

---

## Database Layer

Responsible for:

- Persistent storage
- Transactions
- Locking
- Data integrity

---

# Database Design

## jobs

| Column        | Description           |
| ------------- | --------------------- |
| id            | Unique Job ID         |
| command       | Command to execute    |
| state         | Current job state     |
| attempts      | Retry count           |
| max_retries   | Maximum retries       |
| next_retry_at | Scheduled retry time  |
| worker_id     | Assigned worker       |
| locked        | Lock flag             |
| created_at    | Creation timestamp    |
| updated_at    | Last update timestamp |

---

## config

| Column | Description         |
| ------ | ------------------- |
| key    | Configuration name  |
| value  | Configuration value |

Example:

- max_retries
- backoff_base
- poll_interval
- worker_timeout

---

## job_logs (Optional)

Stores execution logs for each job.

---

# Job States

A job can be in one of the following states:

- pending
- processing
- completed
- failed
- dead

---

# Job Lifecycle

```
Enqueue

↓

Pending

↓

Worker Picks Job

↓

Processing

↓

Success ?
      │
  Yes │ No
      │
Completed

      │
      ▼

Attempt++

↓

Attempts <= Max Retries ?

      │

 Yes  │  No

      │

Retry     Dead Letter Queue

↓

Pending
```

---

# Worker Lifecycle

```
Worker Starts

↓

Check Queue

↓

Lock Job

↓

Execute Command

↓

Update Database

↓

Wait

↓

Repeat
```

Workers should always complete the current job before shutting down.

---

# CLI Commands

```
queuectl enqueue

queuectl worker start

queuectl worker stop

queuectl status

queuectl list

queuectl dlq list

queuectl dlq retry

queuectl config get

queuectl config set
```

---

# Concurrency Strategy

The system must ensure that:

- One job is processed by only one worker.
- Workers never execute the same job simultaneously.
- SQLite transactions will be used to lock jobs before execution.

---

# Retry Strategy

Failed jobs will automatically retry.

Delay will follow exponential backoff.

Formula:

```
delay = backoff_base ^ attempts
```

Example (backoff_base = 2):

| Attempt | Delay |
| ------- | ----- |
| 1       | 2 sec |
| 2       | 4 sec |
| 3       | 8 sec |

---

# Dead Letter Queue (DLQ)

If a job exceeds its maximum retry count:

- Mark state as `dead`
- Keep the job for inspection
- Allow retry through CLI

---

# Configuration Management

Configuration values will be stored in the database instead of being hardcoded.

Configurable values include:

- Maximum retries
- Backoff base
- Worker timeout
- Queue polling interval

---

# Logging Strategy

Application logs will include:

- Worker started
- Worker stopped
- Job picked
- Job completed
- Job failed
- Retry scheduled
- Job moved to DLQ

---

# Testing Strategy

The following scenarios will be tested:

- Job enqueue
- Successful execution
- Failed execution
- Retry mechanism
- Dead Letter Queue
- Multiple workers
- Persistence after restart
- Configuration updates

---

# Future Enhancements

The following features may be implemented as bonus functionality:

- Job priorities
- Scheduled jobs
- Job timeout
- Execution metrics
- Web dashboard
- Docker support

---

# Design Principles

The project follows these principles:

- Separation of Concerns
- Modular Design
- Single Responsibility Principle
- Repository Pattern
- Service Layer Pattern
- Clean Code Practices
- Maintainable Folder Structure

---

# Project Status

| Phase                             | Status      |
| --------------------------------- | ----------- |
| Phase 0 - Design                  | ✅ Complete |
| Phase 1 - Setup                   | ⏳ Pending  |
| Phase 2 - Database                | ⏳ Pending  |
| Phase 3 - CLI                     | ⏳ Pending  |
| Phase 4 - Queue                   | ⏳ Pending  |
| Phase 5 - Workers                 | ⏳ Pending  |
| Phase 6 - Retry & DLQ             | ⏳ Pending  |
| Phase 7 - Reliability             | ⏳ Pending  |
| Phase 8 - Bonus Features          | ⏳ Pending  |
| Phase 9 - Testing & Documentation | ⏳ Pending  |
