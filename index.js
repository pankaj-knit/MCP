#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Default to weather MCP if no specific MCP service is specified
const serviceName = process.argv[2] || 'weather';

// Map of available services and their execution commands
const services = {
  'weather': {
    dir: path.join(__dirname, 'weather-mcp'),
    script: 'weather.py',
    command: process.platform === 'win32' ? 'python' : 'python3'
  }
};

// Check if the requested service exists
if (!services[serviceName]) {
  console.error(`Error: Unknown MCP service '${serviceName}'`);
  console.error(`Available services: ${Object.keys(services).join(', ')}`);
  process.exit(1);
}

const service = services[serviceName];

console.log(`Starting ${serviceName} MCP Service...`);

// Run the appropriate script
const proc = spawn(service.command, [service.script], {
  stdio: 'inherit',
  cwd: service.dir
});

// Handle process events
proc.on('error', (err) => {
  console.error(`Failed to start process: ${err}`);
  process.exit(1);
});

proc.on('close', (code) => {
  if (code !== 0) {
    console.log(`Process exited with code ${code}`);
  }
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  proc.kill('SIGINT');
});

process.on('SIGTERM', () => {
  proc.kill('SIGTERM');
}); 