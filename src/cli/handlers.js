const { input, select } = require("@inquirer/prompts");
const QueueService = require("../services/QueueService");
const { spawn } = require("child_process");
const ConfigService = require("../config/ConfigService");
const RetryService = require("../services/RetryService");
async function enqueueJob() {
    try {
        const command = await input({
            message: "Enter shell command:",
        });

        const retries = await input({
            message: "Max retries (default: 3):",
            default: "3",
        });

        const job = QueueService.enqueue(command, Number(retries));

        console.log("\n✅ Job queued successfully!\n");

        console.table([
            {
                ID: job.id,
                Command: job.command,
                State: job.state,
                Retries: job.max_retries,
            },
        ]);

        await input({
            message: "Press Enter to return to the main menu..."
        });

    } catch (err) {
        console.log("\n❌ " + err.message);
    }
}

async function listJobs() {
    try {
        const state = await select({
            message: "Filter jobs",
            choices: [
                { name: "All Jobs", value: "all" },
                { name: "Pending", value: "pending" },
                { name: "Running", value: "running" },
                { name: "Completed", value: "completed" },
                { name: "Failed", value: "failed" },
                { name: "Dead", value: "dead" }
            ]
        });

        const jobs =
            state === "all"
                ? QueueService.getAllJobs()
                : QueueService.getJobsByState(state);

        if (jobs.length === 0) {
            console.log("\nNo jobs found.\n");
        } else {
            console.table(
    jobs.map(job => ({
        ID: job.id.substring(0, 8),
        Command: job.command,
        State: job.state,
        Attempts: `${job.attempts}/${job.max_retries}`,
        Worker: job.worker_id || "-",
        Created: new Date(job.created_at).toLocaleString()
    }))
);
        }

        await input({
            message: "Press Enter to return to the main menu..."
        });

    } catch (err) {
        console.log("\n❌ " + err.message);
    }
}
async function queueStatus() {
    try {
        const jobs = QueueService.getAllJobs();

        const stats = {
            Pending: 0,
            Running: 0,
            Completed: 0,
            Failed: 0,
            Dead: 0,
            Total: jobs.length
        };

        jobs.forEach(job => {
            switch (job.state) {
                case "pending":
                    stats.Pending++;
                    break;
                case "running":
                    stats.Running++;
                    break;
                case "completed":
                    stats.Completed++;
                    break;
                case "failed":
                    stats.Failed++;
                    break;
                case "dead":
                    stats.Dead++;
                    break;
            }
        });

        console.log("\n📊 Queue Status\n");
        console.table([stats]);

        await input({
            message: "Press Enter to return to the main menu..."
        });

    } catch (err) {
        console.log("\n❌ " + err.message);
    }
}

const WorkerService = require("../services/WorkerService");

async function startWorkers() {
    try {
        const count = await input({
            message: "Number of workers:",
            default: "1"
        });

        spawn(
            "cmd",
            [
                "/c",
                "start",
                "cmd",
                "/k",
                `npm start -- worker start --count ${count}`
            ],
            {
                shell: true,
                detached: true
            }
        );

        console.log(`\n✅ ${count} worker(s) started in a new terminal.\n`);

        await input({
            message: "Press Enter to return to the main menu..."
        });

    } catch (err) {
        console.log("\n❌ " + err.message);
    }
}
async function showDeadJobs() {
    try {
        const jobs = QueueService.getJobsByState("dead");

        if (jobs.length === 0) {
            console.log("\n🎉 No jobs in Dead Letter Queue.\n");
        } else {
            console.table(
                jobs.map(job => ({
                    ID: job.id.substring(0, 8),
                    Command: job.command,
                    Attempts: `${job.attempts}/${job.max_retries}`,
                    Error: job.last_error
                        ? job.last_error.substring(0, 50) + "..."
                        : "-"
                }))
            );
        }

        await input({
            message: "Press Enter to return to the main menu..."
        });

    } catch (err) {
        console.log("\n❌ " + err.message);
    }
}
async function deadLetterMenu() {
    while (true) {
        const option = await select({
            message: "☠ Dead Letter Queue",
            choices: [
                { name: "📋 View Dead Jobs", value: "view" },
                { name: "🔄 Retry Dead Job", value: "retry" },
                { name: "⬅ Back", value: "back" }
            ]
        });

        switch (option) {
            case "view":
                await showDeadJobs();
                break;

            case "retry":
                await retryDeadJob();
                break;

            case "back":
                return;
        }
    }
}
async function retryDeadJob() {
    try {
        const jobs = QueueService.getJobsByState("dead");

        if (jobs.length === 0) {
            console.log("\n🎉 No dead jobs to retry.\n");

            await input({
                message: "Press Enter to continue..."
            });

            return;
        }

        const jobId = await select({
            message: "Select a dead job:",
            choices: jobs.map(job => ({
                name: `${job.command} (${job.id.substring(0, 8)})`,
                value: job.id
            }))
        });

        // Debug
        console.log("Selected Job ID:", jobId);

        const result = RetryService.retryDeadJob(jobId);

        console.log(result);

        if (result.changes > 0) {
            console.log("\n✅ Job moved back to Pending.\n");
        } else {
            console.log("\n❌ Retry failed.\n");
        }

        await input({
            message: "Press Enter to continue..."
        });

    } catch (err) {
        console.log("\n❌ " + err.message);
    }
}
async function showConfig() {
    try {
        const option = await select({
            message: "Configuration",
            choices: [
                { name: "📋 List Configuration", value: "list" },
                { name: "🔍 Get Configuration", value: "get" },
                { name: "✏️ Update Configuration", value: "set" }
            ]
        });

        switch (option) {
            case "list":
                console.table(ConfigService.getAll());
                break;

            case "get": {
                const key = await input({
                    message: "Enter configuration key:"
                });

                try {
                    console.log(`\n${key}: ${ConfigService.get(key)}\n`);
                } catch (err) {
                    console.log("\n❌ " + err.message);
                }
                break;
            }

            case "set": {
                const key = await input({
                    message: "Enter configuration key:"
                });

                const value = await input({
                    message: "Enter new value:"
                });

                try {
                    ConfigService.set(key, value);
                    console.log(`\n✅ Updated ${key} = ${value}\n`);
                } catch (err) {
                    console.log("\n❌ " + err.message);
                }
                break;
            }
        }

        await input({
            message: "Press Enter to return to the main menu..."
        });

    } catch (err) {
        console.log("\n❌ " + err.message);
    }
}
module.exports = {
    enqueueJob,
    listJobs,
    queueStatus,
    startWorkers,
    showDeadJobs,
    deadLetterMenu,
    retryDeadJob,
     showConfig
};