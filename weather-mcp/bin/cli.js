#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Determine the directory where the script is located
const scriptDir = __dirname;
const repoDir = path.resolve(scriptDir, '..');

// Path to the Python script relative to the repo directory
const pythonScriptPath = path.join(repoDir, 'weather.py');

// Check if Python is available
const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

// Check if the Python script exists
if (!fs.existsSync(pythonScriptPath)) {
  console.error(`Error: Could not find ${pythonScriptPath}`);
  process.exit(1);
}

console.log('Starting Weather MCP Service...');
console.log(`Running: ${pythonCommand} ${pythonScriptPath}`);

// Run the Python script
const python = spawn(pythonCommand, [pythonScriptPath], {
  stdio: 'inherit',
  cwd: repoDir
});

// Handle process events
python.on('error', (err) => {
  console.error('Failed to start Python process:', err);
  process.exit(1);
});

python.on('close', (code) => {
  if (code !== 0) {
    console.log(`Python process exited with code ${code}`);
  }
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  python.kill('SIGINT');
});

process.on('SIGTERM', () => {
  python.kill('SIGTERM');
}); 