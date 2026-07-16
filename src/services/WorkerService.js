const os = require('os');
const logger = require('../logger/logger');
const JobRepository = require('../repositories/JobRepository');
const ExecutorService = require('./ExecutorService');
const RetryService = require('./RetryService');

class WorkerService {
  async processNextJob(workerId = os.hostname()) {
    let job;

    try {
      job = JobRepository.claimNextJob(workerId);
    } catch (error) {
      // Another worker currently holds the SQLite write lock.
      if (error.code === 'SQLITE_BUSY') {
        return;
      }

      throw error;
    }

    if (!job) {
      return;
    }

    logger.info(`\n[${workerId}] Processing ${job.id}`);
    logger.info(`Command: ${job.command}`);

    try {
      const result = await ExecutorService.execute(job.command);

      if (result.success) {
        JobRepository.complete(job.id, result.stdout);

        logger.info(`[${workerId}] ✓ Completed ${job.id}`);
      } else {
        const retry = RetryService.handleFailure(job, result.stderr);

        if (retry.state === 'dead') {
          logger.info(`[${workerId}] ✗ Moved to Dead Letter Queue`);
        } else {
          logger.info(
            `[${workerId}] Retry scheduled after ${retry.retryAfter}s`
          );
        }
      }
    } catch (error) {
      RetryService.handleFailure(job, error.message);

      logger.error(`[${workerId}] ${error.message}`);
    }
  }
}

module.exports = new WorkerService();