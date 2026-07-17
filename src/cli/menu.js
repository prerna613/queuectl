const { select } = require("@inquirer/prompts");
const showBanner = require("./banner");
const { enqueueJob, listJobs,queueStatus,startWorkers,  deadLetterMenu, showConfig} = require("./handlers");



async function startMenu() {
    while (true) {
        showBanner();

        const option = await select({
            message: "Select an option",
            choices: [
                { name: "📥 Enqueue Job", value: "enqueue" },
                { name: "👷 Start Workers", value: "workers" },
                { name: "📋 List Jobs", value: "list" },
                { name: "📊 Queue Status", value: "status" },
                { name: "☠ Dead Letter Queue", value: "dlq" },
                { name: "⚙ Configuration", value: "config" },
                { name: "🚪 Exit", value: "exit" }
            ]
        });

        switch (option) {
            case "enqueue":
                console.log(">>> Before enqueue");
                await enqueueJob();
                console.log(">>> After enqueue");
                break;

           case "workers":
                  await startWorkers();
                  break;

            case "list":
                     await listJobs();
                     break;

             case "status":
                     await queueStatus();
                     break;

            case "dlq":
                  await deadLetterMenu();
                   break;

           case "config":
                 await showConfig();
                  break;

            case "exit":
                console.log("\n👋 Goodbye!");
                return;
        }


   }
}




module.exports = startMenu;