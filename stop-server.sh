#!/bin/bash
# Stop Bear Capital server and ngrok

echo "🛑 Stopping Bear Capital Server..."

# Kill the Python server
pkill -f "python3 server.py" 2>/dev/null && echo "  ✓ Python server stopped" || echo "  - Python server not running"

# Kill ngrok
pkill -f ngrok 2>/dev/null && echo "  ✓ ngrok stopped" || echo "  - ngrok not running"

echo "Done!"
