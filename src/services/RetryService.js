const JobRepository = require('../repositories/JobRepository');
const ConfigService = require('../config/ConfigService');
const logger = require('../logger/logger');

class RetryService {
  handleFailure(job, error) {
    const attempts = job.attempts + 1;

    if (attempts >= job.max_retries) {
      logger.error(`Job ${job.id} moved to Dead Letter Queue`);

      JobRepository.moveToDead(
       job.id,
       attempts,
      error
    );
      return {
        retry: false,
        state: 'dead',
      };
    }

    const base = ConfigService.getBackoffBase();
    const delay = Math.pow(base, attempts);

    const retryTime = new Date(
      Date.now() + delay * 1000
    ).toISOString();

    JobRepository.scheduleRetry(
      job.id,
      attempts,
      retryTime,
      error
    );

    logger.info(
      `Retry scheduled for Job ${job.id} after ${delay} seconds`
    );

    return {
      retry: true,
      retryAfter: delay,
      state: 'pending',
    };
  }
}

module.exports = new RetryService();