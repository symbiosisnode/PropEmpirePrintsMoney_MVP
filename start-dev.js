const { spawn } = require('child_process');
const path = require('path');

// Start the Express server
const server = spawn('node', ['app.js'], {
  stdio: 'inherit',
  shell: true
});

console.log('Express server started on port 5000');

// Start the Vite development server
const vite = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

console.log('Vite development server started');

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  server.kill();
  vite.kill();
  process.exit();
});

// Handle server errors
server.on('error', (err) => {
  console.error('Express server error:', err);
});

vite.on('error', (err) => {
  console.error('Vite server error:', err);
}); 