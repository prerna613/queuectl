const JobRepository = require('../repositories/JobRepository');
const ConfigService = require('../config/ConfigService');

class RetryService {
  handleFailure(job, error) {
    const attempts = job.attempts + 1;

    if (attempts >= job.max_retries) {
      JobRepository.moveToDead(job.id, error);

      return {
        retry: false,
        state: 'dead'
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

    return {
      retry: true,
      retryAfter: delay,
      state: 'pending'
    };
  }
}

module.exports = new RetryService();