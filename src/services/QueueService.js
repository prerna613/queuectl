const { v4: uuidv4 } = require('uuid');
const JobRepository = require('../repositories/JobRepository');
const ConfigService = require('../config/ConfigService');

class QueueService {
  enqueue(command, maxRetries = null) {
    if (!command || !command.trim()) {
      throw new Error('Command cannot be empty.');
    }

    const retries =
      maxRetries !== null
        ? Number(maxRetries)
        : ConfigService.getMaxRetries();

    const now = new Date().toISOString();

    const job = {
      id: uuidv4(),
      command: command.trim(),

      state: 'pending',

      attempts: 0,

      max_retries: retries,

      next_retry_at: null,

      worker_id: null,

      locked_at: null,

      stdout: null,

      stderr: null,

      last_error: null,

      started_at: null,

      finished_at: null,

      created_at: now,

      updated_at: now,
    };

    JobRepository.create(job);

    return job;
  }

  getJob(id) {
    return JobRepository.findById(id);
  }

  getAllJobs() {
    return JobRepository.findAll();
  }

  getJobsByState(state) {
    return JobRepository.findByState(state);
  }

  deleteJob(id) {
    return JobRepository.delete(id);
  }
}

module.exports = new QueueService();