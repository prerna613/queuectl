const { Command } = require('commander');

const command = new Command('dlq');

command.description('Dead Letter Queue operations');

command
  .command('list')
  .description('List all dead jobs')
  .action(() => {
    console.log('DLQ list will be implemented in Phase 7');
  });

command
  .command('retry')
  .description('Retry a dead job')
  .argument('<jobId>')
  .action(() => {
    console.log('DLQ retry will be implemented in Phase 7');
  });

module.exports = command;