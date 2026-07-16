const { fork } = require('child_process');
const path = require('path');

class WorkerManager {
  constructor() {
    this.processes = [];
  }

  start(count = 1) {
    if (this.processes.length > 0) {
      console.log('Workers already running.');
      return;
    }

    const workerFile = path.join(
      __dirname,
      '..',
      'processes',
      'workerProcess.js'
    );

    for (let i = 1; i <= count; i++) {
      const child = fork(workerFile, [`worker-${i}`], {
        stdio: 'inherit'
      });

      this.processes.push(child);
    }

    console.log(`Started ${count} worker process(es).`);
  }

 stop() {
    for (const child of this.processes) {
        child.kill('SIGTERM');
    }

    this.processes = [];

    console.log('All workers stopped.');
}
}

module.exports = new WorkerManager();