#!/usr/bin/env node

const runMigration = require('./database/migrate');
const program = require('./cli/program');

runMigration();

program.parse(process.argv);