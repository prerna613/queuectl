const ConfigRepository = require('../repositories/ConfigRepository');

class ConfigService {
  get(key) {
    const config = ConfigRepository.get(key);

    if (!config) {
      throw new Error(`Configuration '${key}' not found.`);
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