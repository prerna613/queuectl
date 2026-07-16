#!/usr/bin/env node

const migrate = require('./database/migrate');
const program = require('./cli/program');

migrate();

program.parse(process.argv);