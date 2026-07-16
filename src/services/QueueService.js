const { v4: uuidv4 } = require('uuid');
const JobRepository = require('../repositories/JobRepository');

class QueueService {
  enqueue(command, maxRetries) {
    const now = new Date().toISOString();

    const job = {
      id: uuidv4(),
      command,
      state: 'pending',
      attempts: 0,
      max_retries: Number(maxRetries),
      next_retry_at: null,
      worker_id: null,
      locked: 0,
      created_at: now,
      updated_at: now,
    };

    JobRepository.create(job);

    return job;
  }
}

module.exports = new QueueService();