const ConfigService = require('../config/ConfigService');
const WorkerService = require('../services/WorkerService');

class Worker {
  constructor(id) {
    this.id = id;
    this.running = false;
  }

  async start() {
    if (this.running) {
      return;
    }

    this.running = true;

    console.log(`Worker ${this.id} started`);

    const pollInterval = ConfigService.getPollInterval();

    while (this.running) {
      try {
        await WorkerService.processNextJob(this.id);
      } catch (error) {
        console.error(error);
      }

      await new Promise((resolve) =>
        setTimeout(resolve, pollInterval)
      );
    }
  }

  stop() {
    this.running = false;

    console.log(`Worker ${this.id} stopped`);
  }
}

module.exports = Worker;