const Worker = require('../workers/Worker');

const workerId = process.argv[2] || `worker-${process.pid}`;

const worker = new Worker(workerId);

worker.start();

process.on('SIGINT', () => {
  worker.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  worker.stop();
  process.exit(0);
});