#!/bin/bash
# Stop Bear Capital Server and ngrok

echo "🛑 Stopping Bear Capital..."

# Kill Python server
pkill -f "python3 server.py" 2>/dev/null && echo "  ✓ Flask server stopped" || echo "  - Flask server not running"

# Kill ngrok
pkill -f ngrok 2>/dev/null && echo "  ✓ ngrok stopped" || echo "  - ngrok not running"

# Kill any process on port 5001
lsof -ti:5001 | xargs kill -9 2>/dev/null

echo ""
echo "✅ Bear Capital stopped!"
