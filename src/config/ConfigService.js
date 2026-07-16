const ConfigRepository = require('../repositories/ConfigRepository');

class ConfigService {
  get(key) {
    const config = ConfigRepository.get(key);

    if (!config) {
      throw new Error(`Configuration "${key}" not found.`);
    }

    return config.value;
  }

  getAll() {
    return ConfigRepository.getAll();
  }

  set(key, value) {
    ConfigRepository.set(key, String(value));
  }

  getNumber(key) {
    return Number(this.get(key));
  }
}

module.exports = new ConfigService();