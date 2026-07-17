# 🚀 QueueCTL

> A production-inspired CLI-based Background Job Queue System built with **Node.js**.

QueueCTL is a lightweight job queue system that allows users to enqueue background jobs, process them using multiple worker processes, automatically retry failed jobs using exponential backoff, and move permanently failed jobs to a Dead Letter Queue (DLQ). It uses **SQLite** for persistent storage and provides both a **CLI interface** and an **interactive dashboard** for queue management.

---

# 📌 Features

- ✅ CLI-based Job Queue
- ✅ Interactive Dashboard
- ✅ Persistent SQLite Storage
- ✅ Multiple Worker Processes
- ✅ Automatic Retry with Exponential Backoff
- ✅ Dead Letter Queue (DLQ)
- ✅ Manual Retry from DLQ
- ✅ Graceful Worker Shutdown
- ✅ Configurable Retry & Backoff
- ✅ Queue Status Monitoring
- ✅ Job Listing & Filtering
- ✅ Structured Logging

---

# 🛠 Tech Stack

- Node.js
- Commander.js
- SQLite
- better-sqlite3
- dotenv
- chalk
- boxen
- @inquirer/prompts
- child_process

---

# 📂 Project Structure

```
queuectl/
│
├── src/
│   ├── cli/
│   ├── config/
│   ├── database/
│   ├── logger/
│   ├── processes/
│   ├── repositories/
│   ├── services/
│   ├── workers/
│   ├── index.js
│
├── logs/
├── package.json
├── README.md
└── .env.example
```

---

# ⚙️ Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/<your-username>/queuectl.git
```

```bash
cd queuectl
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment

Create a `.env` file.

Example:

```env
DB_PATH=./queue.db
```

---

## 4. Run QueueCTL

```bash
npm start
```

This launches the interactive QueueCTL dashboard.

---


QueueCTL can be used in two ways:

- **Interactive Dashboard** (recommended for easy queue management)
- **Command Line Interface (CLI)** using Commander.js

---

# 🎛 Interactive Dashboard

Launch the dashboard:

```bash
npm start
```

Dashboard Menu:

```text
📥 Enqueue Job
👷 Start Workers
📋 List Jobs
📊 Queue Status
☠ Dead Letter Queue
⚙ Configuration
🚪 Exit
```

The dashboard allows users to enqueue jobs, manage workers, monitor queue status, retry failed jobs, and configure queue settings interactively.

---

# 💻 CLI Commands

## Enqueue Jobs

### Enqueue a valid command

```bash
npm start -- enqueue --command "echo Hello"
```

Example Output

```text
✅ Job Enqueued

ID: 7e2a5f9d...
Command: echo Hello
State: pending
Max Retries: 5
```

---

### Enqueue an invalid command

```bash
npm start -- enqueue --command "invalid_command_xyz"
```

This command will automatically retry using exponential backoff and eventually move to the Dead Letter Queue after reaching the configured retry limit.

## Configuration

### View all configuration

```bash
npm start -- config list
```

### Get a configuration value

```bash
npm start -- config get max_retries
```

### Update maximum retries

```bash
npm start -- config set max_retries 3
```

### Verify updated configuration

```bash
npm start -- config get max_retries
```

---



## Worker Management

### Start a single worker

```bash
npm start -- worker start
```

### Start multiple workers

```bash
npm start -- worker start --count 3
```

Example Output

```text
✅ Started 3 worker process(es).
```

Workers execute pending jobs in parallel while preventing duplicate processing.

---

## List Jobs

Display all jobs

```bash
npm start -- list
```

Example Output

```text
ID        Command             State
----------------------------------------
abc123    echo Hello          completed
def456    invalid_command     dead
ghi789    ping localhost      pending
```

---

## Dead Letter Queue

View all permanently failed jobs

```bash
npm start -- dlq list
```

Retry a failed job

```bash
npm start -- dlq retry <job-id>
```

Example

```bash
npm start -- dlq retry e29528cd-203a-4da7-8d24-f50ab70899e3
```

Example Output

```text
✅ Job moved back to Pending.
```

The worker will automatically pick up the retried job during the next polling cycle.

---

## Queue Status

View current queue statistics from the dashboard.
```bash  
npm start -- status
```
```text
Pending Jobs

Processing Jobs

Completed Jobs

Dead Jobs

Running Workers
```
# 🏗 Architecture Overview

## Job Lifecycle

```
Pending
   │
   ▼
Processing
   │
   ├───────────────► Completed
   │
   ▼
Failed
   │
   ▼
Retry (Exponential Backoff)
   │
   ▼
Pending
   │
   ▼
Max Retries Exceeded
   │
   ▼
Dead Letter Queue
```

---

## Data Persistence

QueueCTL uses **SQLite** for persistent storage.

Each job contains

- Job ID
- Command
- Current State
- Retry Attempts
- Maximum Retries
- Worker ID
- Retry Schedule
- Timestamps

This ensures that all jobs survive application restarts.

---

## Worker Logic

1. Worker polls queue periodically.
2. Locks the next available pending job.
3. Executes the command.
4. On success

```
Completed
```

5. On failure

```
Retry using exponential backoff
```

6. After maximum retries

```
Move to Dead Letter Queue
```

Workers support graceful shutdown and always finish the current job before exiting.

---

# ⚡ Retry Strategy

QueueCTL uses **Exponential Backoff**

```
Delay = BackoffBase ^ Attempt
```

Example

| Attempt | Delay |
|---------|--------|
| 1 | 2 sec |
| 2 | 4 sec |
| 3 | 8 sec |

After reaching the configured maximum retries, the job is moved to the Dead Letter Queue.

---

# ⚙ Configuration

QueueCTL allows runtime configuration of

- Maximum Retries
- Backoff Base
- Poll Interval

Configuration changes are stored persistently.

---

# 📄 Assumptions & Trade-offs

### Assumptions

- Commands are executed using the host operating system shell.
- SQLite is sufficient for a lightweight embedded queue.
- Workers execute independent jobs.
- Failed commands are retryable until the retry limit is reached.

### Trade-offs

- SQLite is used instead of Redis or RabbitMQ to keep the project lightweight and easy to set up.
- Queue polling is used instead of event-driven notifications for simplicity.
- Manual DLQ retry is implemented as an additional recovery feature.
- Interactive dashboard is provided in addition to the required CLI commands for improved usability.

---

# 🧪 Testing Instructions

## Test 1

Enqueue a valid command

Example

```
echo Hello QueueCTL
```

Expected

```
Completed
```

---

## Test 2

Enqueue an invalid command

Example

```
invalid_command_xyz
```

Expected

```
Retry

↓

Dead Letter Queue
```

---

## Test 3

Start Multiple Workers

```
Worker Count

3
```

Verify

- Multiple jobs execute simultaneously.
- No duplicate processing occurs.

---

## Test 4

Retry Dead Job

```
DLQ

↓

Retry Dead Job
```

Verify

```
Dead

↓

Pending
```

---

## Test 5

Persistence

1. Enqueue jobs.
2. Stop QueueCTL.
3. Restart.

Verify

Jobs remain available.

---

## Test 6

Graceful Shutdown

1. Start workers.
2. Press

```
Ctrl + C
```

Verify

Current jobs finish before workers exit.

---

# 📊 Future Enhancements

- Job Priorities
- Scheduled Jobs
- REST API
- Web Dashboard
- Queue Metrics
- Job Timeout Handling

---

# 👩‍💻 Author

**Prerna Sahu**


```

---

