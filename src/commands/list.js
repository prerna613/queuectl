const { Command } = require('commander');
const QueueService = require('../services/QueueService');

const command = new Command('list');

command
  .description('List queued jobs')
  .option('-s, --state <state>', 'Filter jobs by state')
  .action((options) => {
    const jobs = options.state
      ? QueueService.getJobsByState(options.state)
      : QueueService.getAllJobs();

    if (jobs.length === 0) {
      console.log('\nNo jobs found.\n');
      return;
    }

    console.table(jobs);
  });

module.exports = command;