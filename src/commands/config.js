const { Command } = require('commander');
const ConfigService = require('../config/ConfigService');

const command = new Command('config');

command
  .command('list')
  .description('List all configuration values')
  .action(() => {
    const configs = ConfigService.getAll();

    console.table(configs);
  });

command
  .command('get <key>')
  .description('Get configuration value')
  .action((key) => {
    try {
      const value = ConfigService.get(key);

      console.log(`${key} = ${value}`);
    } catch (err) {
      console.error(err.message);
    }
  });

command
  .command('set <key> <value>')
  .description('Update configuration value')
  .action((key, value) => {
    ConfigService.set(key, value);

    console.log(`Updated ${key} = ${value}`);
  });

module.exports = command;