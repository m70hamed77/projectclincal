#!/bin/bash

cd /home/z/my-project

# Kill existing processes
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "node.*next" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null

sleep 2

# Start server
bun run dev > /home/z/my-project/dev.log 2>&1 &
SERVER_PID=$!

echo "Server started with PID: $SERVER_PID"
echo "Waiting for server to be ready..."

# Wait and check
sleep 8
if ps -p $SERVER_PID > /dev/null 2>&1; then
  echo "✅ Server is running successfully!"
  tail -n 20 /home/z/my-project/dev.log
else
  echo "❌ Server failed to start"
  cat /home/z/my-project/dev.log
fi
