const { Command } = require('commander');
const WorkerManager = require('../workers/WorkerManager');

const command = new Command('worker');

command
  .command('start')
  .option('-c, --count <count>', 'Number of workers', '1')
  .action(async (options) => {
    const count = Number(options.count);

    WorkerManager.start(count);

    process.on('SIGINT', async () => {
      await WorkerManager.stop();
      process.exit(0);
    });

    await new Promise(() => {});
  });

command
  .command('stop')
  .description('Gracefully stop workers')
  .action(async () => {
    await WorkerManager.stop();
  });

module.exports = command;