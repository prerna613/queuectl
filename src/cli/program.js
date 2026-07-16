const { Command } = require('commander');

const enqueueCommand = require('../commands/enqueue');
const workerCommand = require('../commands/worker');
const statusCommand = require('../commands/status');
const listCommand = require('../commands/list');
const dlqCommand = require('../commands/dlq');
const configCommand = require('../commands/config');

const program = new Command();

program
  .name('queuectl')
  .description('CLI-based Background Job Queue System')
  .version('1.0.0');

program.addCommand(enqueueCommand);
program.addCommand(workerCommand);
program.addCommand(statusCommand);
program.addCommand(listCommand);
program.addCommand(dlqCommand);
program.addCommand(configCommand);

module.exports = program;