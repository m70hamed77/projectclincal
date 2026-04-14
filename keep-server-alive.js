const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = '/home/z/my-project/dev.log';
const managerLogFile = '/home/z/my-project/server-manager.log';

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(managerLogFile, logMessage);
  console.log(message);
}

function startServer() {
  log('Starting Next.js dev server...');

  const server = spawn('bun', ['run', 'dev'], {
    cwd: '/home/z/my-project',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Redirect stdout and stderr to log file
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });
  server.stdout.pipe(logStream);
  server.stderr.pipe(logStream);

  server.on('exit', (code, signal) => {
    log(`Server exited with code ${code}, signal: ${signal}`);
    logStream.end();

    // Restart after 3 seconds
    setTimeout(() => {
      startServer();
    }, 3000);
  });

  server.on('error', (err) => {
    log(`Server error: ${err.message}`);
    setTimeout(() => {
      startServer();
    }, 3000);
  });

  return server;
}

// Start the server
log('=== Server Manager Started ===');
const server = startServer();

// Keep the process alive
process.on('SIGTERM', () => {
  log('Received SIGTERM, shutting down...');
  server.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  log('Received SIGINT, shutting down...');
  server.kill();
  process.exit(0);
});
