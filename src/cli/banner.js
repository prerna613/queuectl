const figlet = require("figlet");
const chalk = require("chalk");
const boxen = require("boxen");

function showBanner() {
    console.clear();

    console.log(
        chalk.cyan(
            figlet.textSync("QueueCTL", {
                horizontalLayout: "default"
            })
        )
    );

    console.log(
        boxen(
            chalk.green(
`🚀 Background Job Queue

✓ SQLite Persistence
✓ Multi Worker Support
✓ Retry & DLQ
✓ CLI Dashboard`
            ),
            {
                padding: 1,
                borderColor: "green",
                borderStyle: "round"
            }
        )
    );
}

module.exports = showBanner;