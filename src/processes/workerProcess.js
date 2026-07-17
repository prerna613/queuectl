const Worker = require("../workers/Worker");

const workerId = process.argv[2] || `worker-${process.pid}`;

const worker = new Worker(workerId);

worker.start();

async function shutdown(signal) {
    console.log(`\n🛑 ${workerId} received ${signal}. Shutting down gracefully...`);

    try {
        await worker.stop();
        console.log(`✅ ${workerId} stopped successfully.`);
    } catch (err) {
        console.error(`❌ Error stopping ${workerId}:`, err.message);
    }

    process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));