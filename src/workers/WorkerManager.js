const { fork } = require("child_process");
const path = require("path");

class WorkerManager {
    constructor() {
        // Store all worker processes
        this.processes = [];

        // Register graceful shutdown only once
        process.on("SIGINT", () => {
            console.log("\n🛑 Received SIGINT. Stopping workers gracefully...");
            this.stop();
            process.exit(0);
        });

        process.on("SIGTERM", () => {
            console.log("\n🛑 Received SIGTERM. Stopping workers gracefully...");
            this.stop();
            process.exit(0);
        });
    }

    start(count = 1) {
        if (this.processes.length > 0) {
            console.log("⚠ Workers are already running.");
            return;
        }

        const workerFile = path.join(
            __dirname,
            "..",
            "processes",
            "workerProcess.js"
        );

        for (let i = 1; i <= count; i++) {
            const child = fork(workerFile, [`worker-${i}`], {
                stdio: "inherit",
            });

            this.processes.push(child);

            child.on("exit", (code, signal) => {
                console.log(
                    `👷 Worker-${i} exited (code: ${code}, signal: ${signal})`
                );
            });
        }

        console.log(`✅ Started ${count} worker process(es).`);
    }

    stop() {
        if (this.processes.length === 0) {
            console.log("⚠ No workers are running.");
            return;
        }

        for (const child of this.processes) {
            if (!child.killed) {
                child.kill("SIGTERM");
            }
        }

        this.processes = [];

        console.log("✅ All workers stopped gracefully.");
    }
}

module.exports = new WorkerManager();