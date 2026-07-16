const { Command } = require('commander');
const StatusService = require('../services/StatusService');

const command = new Command('status');

command
  .description('Show queue statistics')
  .action(() => {
    const stats = StatusService.getQueueStatus();

    console.log('\nQueue Status\n');

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