const JobRepository = require('../repositories/JobRepository');

class StatusService {
  getQueueStatus() {
    return JobRepository.getJobCounts();
  }
}

module.exports = new StatusService();