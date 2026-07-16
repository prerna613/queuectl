const { Command } = require('commander');
const JobRepository = require('../repositories/JobRepository');

const command = new Command('list');

command
  .description('List jobs')
  .option('-s, --state <state>', 'Filter by job state')
  .action((options) => {
    let jobs;

    if (options.state) {
      jobs = JobRepository.findByState(options.state);
    } else {
      jobs = JobRepository.findAll();
    }

    if (jobs.length === 0) {
      console.log('\nNo jobs found.\n');
      return;
    }

    console.table(jobs);
  });

module.exports = command;