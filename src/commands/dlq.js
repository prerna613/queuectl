const { Command } = require('commander');
const JobRepository = require('../repositories/JobRepository');

const command = new Command('dlq');

command
  .command('list')
  .description('List dead letter queue jobs')
  .action(() => {
    const jobs = JobRepository.findDeadJobs();

    if (jobs.length === 0) {
      console.log('\nNo dead jobs.\n');
      return;
    }

    console.table(jobs);
  });

command
  .command('retry <jobId>')
  .description('Retry a dead job')
  .action((jobId) => {
    const result = JobRepository.retryDeadJob(jobId);

    if (result.changes === 0) {
      console.log('Job not found or not in DLQ.');
      return;
    }

    console.log('Job moved back to pending.');
  });

module.exports = command;