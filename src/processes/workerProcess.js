const Worker = require('../workers/Worker');

const workerId = process.argv[2] || `worker-${process.pid}`;

const worker = new Worker(workerId);

worker.start();

async function shutdown() {
    await worker.stop();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);