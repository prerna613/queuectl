const ConfigService = require('../config/ConfigService');
const WorkerService = require('../services/WorkerService');
const logger = require('../logger/logger');

class Worker {
    constructor(id) {
        this.id = id;
        this.running = false;
        this.processing = false;
    }

    async start() {
        if (this.running) return;

        this.running = true;

        logger.info(`Worker ${this.id} started`);

        const pollInterval = ConfigService.getPollInterval();

        while (this.running) {
            try {
                this.processing = true;

                await WorkerService.processNextJob(this.id);

                this.processing = false;
            } catch (err) {
                this.processing = false;

                logger.error(err.stack || err.message);
            }

            if (!this.running) {
                break;
            }

            await new Promise(resolve =>
                setTimeout(resolve, pollInterval)
            );
        }

        logger.info(`Worker ${this.id} exited gracefully`);
    }

    async stop() {
        logger.info(`Stopping worker ${this.id}...`);

        this.running = false;

        while (this.processing) {
            await new Promise(resolve =>
                setTimeout(resolve, 100)
            );
        }

        logger.info(`Worker ${this.id} stopped`);
    }
}

module.exports = Worker;