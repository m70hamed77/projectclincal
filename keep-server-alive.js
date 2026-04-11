#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('Starting server monitor...');

function startServer() {
  console.log('[Server] Starting Next.js dev server on port 3000...');

  const server = spawn('bun', ['run', 'dev'], {
    cwd: '/home/z/my-project',
    stdio: 'inherit',
    shell: true
  });

  server.on('error', (err) => {
    console.error('[Server] Error:', err);
  });

  server.on('exit', (code, signal) => {
    console.log(`[Server] Exited with code ${code}, signal ${signal}`);
    console.log('[Server] Restarting in 3 seconds...');

    setTimeout(() => {
      startServer();
    }, 3000);
  });
}

startServer();
