const ConfigService = require('../src/config/ConfigService');

describe('Configuration Service', () => {

    test('should return max retries', () => {
        expect(ConfigService.getMaxRetries()).toBeGreaterThan(0);
    });

    test('should return poll interval', () => {
        expect(ConfigService.getPollInterval()).toBeGreaterThan(0);
    });

});