const ExecutorService = require('../src/services/ExecutorService');

describe('Executor Service', () => {

    test('echo command executes successfully', async () => {

        const result = await ExecutorService.execute('echo Hello');

        expect(result.success).toBe(true);

    });

});