const ExecutorService = require('./services/ExecutorService');

(async () => {

    const result = await ExecutorService.execute('invalid_command_xyz');

    console.log(result);

})();