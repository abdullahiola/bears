#!/bin/bash
# Start Bear Capital Server with ngrok

echo "🐻 Starting Bear Capital..."
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Kill any existing processes
pkill -f "python3 server.py" 2>/dev/null
pkill -f ngrok 2>/dev/null
lsof -ti:5001 | xargs kill -9 2>/dev/null

# Start Python server (includes ngrok)
echo "Starting Flask server with ngrok..."
echo ""
python3 server.py
