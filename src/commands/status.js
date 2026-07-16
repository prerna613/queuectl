const { Command } = require('commander');
const JobRepository = require('../repositories/JobRepository');

const command = new Command('status');

command
  .description('Show queue statistics')
  .action(() => {
    const stats = JobRepository.getJobCounts();

    console.log('\n========== Queue Status ==========\n');

    console.table([
      {
        Pending: stats.pending,
        Processing: stats.processing,
        Completed: stats.completed,
        Failed: stats.failed,
        Dead: stats.dead,
        Total: stats.total,
      },
    ]);
  });

module.exports = command;