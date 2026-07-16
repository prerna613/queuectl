const { Command } = require('commander');
const ConfigService = require('../config/ConfigService');

const command = new Command('config');

command.description('Configuration management');

command
  .command('list')
  .description('List all configuration')
  .action(() => {
    console.table(ConfigService.getAll());
  });

command
  .command('get <key>')
  .description('Get a configuration value')
  .action((key) => {
    try {
      console.log(`${key}: ${ConfigService.get(key)}`);
    } catch (err) {
      console.error(err.message);
    }
  });

command
  .command('set <key> <value>')
  .description('Update a configuration value')
  .action((key, value) => {
    try {
      ConfigService.set(key, value);

      console.log(`Updated ${key} = ${value}`);
    } catch (err) {
      console.error(err.message);
    }
  });

module.exports = command;