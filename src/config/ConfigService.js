const ConfigRepository = require('../repositories/ConfigRepository');

class ConfigService {
  get(key) {
    const config = ConfigRepository.get(key);

    if (!config) {
      throw new Error(`Unknown configuration: ${key}`);
    }

    return config.value;
  }

  getNumber(key) {
    return Number(this.get(key));
  }

  getAll() {
    return ConfigRepository.getAll();
  }

  set(key, value) {
    if (!ConfigRepository.exists(key)) {
      throw new Error(`Unknown configuration: ${key}`);
    }

    const numericFields = [
      'max_retries',
      'backoff_base',
      'poll_interval',
      'worker_timeout',
    ];

    if (numericFields.includes(key)) {
      const number = Number(value);

      if (!Number.isFinite(number) || number <= 0) {
        throw new Error(`${key} must be a positive number.`);
      }

      value = number;
    }

    ConfigRepository.set(key, value);
  }

  getMaxRetries() {
    return this.getNumber('max_retries');
  }

  getBackoffBase() {
    return this.getNumber('backoff_base');
  }

  getPollInterval() {
    return this.getNumber('poll_interval');
  }

  getWorkerTimeout() {
    return this.getNumber('worker_timeout');
  }
}

module.exports = new ConfigService();