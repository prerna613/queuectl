const { spawn } = require('child_process');

class ExecutorService {
  execute(command) {
    return new Promise((resolve) => {
      const child = spawn(command, {
        shell: true,
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        resolve({
          success: code === 0,
          exitCode: code,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
        });
      });

      child.on('error', (error) => {
        resolve({
          success: false,
          exitCode: -1,
          stdout: '',
          stderr: error.message,
        });
      });
    });
  }
}

module.exports = new ExecutorService();