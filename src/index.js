#!/usr/bin/env node
const startMenu = require("./cli/menu");
const migrate = require('./database/migrate');
const program = require('./cli/program');


migrate();

(async () => {
    migrate();

    if (process.argv.length === 2) {
        await startMenu();
    } else {
        program.parse(process.argv);
    }
})();