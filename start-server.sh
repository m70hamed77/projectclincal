#!/bin/bash

# Stop any existing servers
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "node.*next" 2>/dev/null

# Wait for processes to stop
sleep 2

cd /home/z/my-project

# Start the server in background
bun run dev > /home/z/my-project/dev.log 2>&1 &

# Save PID
echo $! > /home/z/my-project/server.pid

echo "✅ Server started at $(date)"
echo "PID: $(cat /home/z/my-project/server.pid)"
echo "Logs: /home/z/my-project/dev.log"
