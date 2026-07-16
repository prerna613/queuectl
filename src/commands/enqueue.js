const { Command } = require('commander');
const QueueService = require('../services/QueueService');

const command = new Command('enqueue');

command
  .description('Add a new job to the queue')
  .requiredOption('-c, --command <command>', 'Shell command to execute')
  .option('-r, --max-retries <number>', 'Maximum retry attempts')
  .action((options) => {
    try {
      const job = QueueService.enqueue(
        options.command,
        options.maxRetries
      );

      console.log('\n✅ Job queued successfully.\n');

      console.table([
        {
          ID: job.id,
          Command: job.command,
          State: job.state,
          Retries: job.max_retries,
        },
      ]);
    } catch (error) {
      console.error(`\n❌ ${error.message}`);
    }
  });

module.exports = command;