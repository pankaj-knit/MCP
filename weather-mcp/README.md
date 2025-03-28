# Weather MCP Service

This is a simple MCP service that provides weather information from the National Weather Service API.

## Features

- `get_alerts`: Get weather alerts for a specific US state
- `get_forecast`: Get weather forecast for a specific location by latitude and longitude

## Setup

There are multiple ways to run this service:

### 1. Using Python directly

1. Create a virtual environment: `python -m venv .venv`
2. Activate the virtual environment: 
   - Windows: `.venv\Scripts\activate`
   - macOS/Linux: `source .venv/bin/activate`
3. Install dependencies: `pip install -e .`
4. Run the service: `python weather.py`

### 2. Using UV (Python package manager)

```bash
uv --directory /path/to/MCP/weather run weather.py
```

### 3. Using NPX (Node.js package executor)

```bash
# Run directly from GitHub repository (replace USERNAME with your GitHub username)
npx -y github:USERNAME/weather-mcp

# Run from a local directory
npx -y .

# Or using the package name (if published to npm)
npx -y weather-mcp
```

Note: When running with NPX, make sure Python 3 is installed and available in your PATH. The NPX command will automatically handle downloading the package and running it.

## Integration with Claude Desktop

To configure the Claude desktop app to use this service, add the following to your claude_desktop_config.json:

```json
{
  "mcpServers": {
      "weather": {
          "command": "/path/to/python",
          "args": [
              "--directory",
              "/path/to/MCP/weather",
              "run",
              "weather.py"
          ]
      }
  }
}
```

Replace "/path/to/python" with the path to your Python interpreter and "/path/to/MCP/weather" with the path to the weather directory.
