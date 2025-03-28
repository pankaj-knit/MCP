#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Process arguments to determine which service to run
// When run as "npx -y github:username/repo service-name" 
// the service name will be in process.argv[2]
let serviceName = 'weather'; // Default to weather service

// Check if there's a command-line argument specifying the service
if (process.argv.length > 2) {
  // Get the first non-option argument
  for (let i = 2; i < process.argv.length; i++) {
    if (!process.argv[i].startsWith('-')) {
      serviceName = process.argv[i];
      break;
    }
  }
}

console.log(`Requested MCP service: ${serviceName}`);

// Map of available services and their execution commands
const services = {
  'weather': {
    dir: path.join(__dirname, 'weather-mcp'),
    script: 'weather.py',
    command: process.platform === 'win32' ? 'python' : 'python3'
  },
  'weather-mcp': {  // Alias for weather
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

// Check if the service directory exists
if (!fs.existsSync(service.dir)) {
  console.error(`Error: Service directory not found: ${service.dir}`);
  process.exit(1);
}

// Check if the script exists
const scriptPath = path.join(service.dir, service.script);
if (!fs.existsSync(scriptPath)) {
  console.error(`Error: Script not found: ${scriptPath}`);
  process.exit(1);
}

console.log(`Starting ${serviceName} MCP Service...`);
console.log(`Running: ${service.command} ${service.script} in ${service.dir}`);

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