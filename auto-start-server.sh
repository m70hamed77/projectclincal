#!/bin/bash

# Kill any existing servers
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "node.*next" 2>/dev/null
sleep 2

cd /home/z/my-project

# Start server in a loop to keep it alive
while true; do
  echo "[$(date)] Starting Next.js dev server..."
  bun run dev

  echo "[$(date)] Server stopped! Restarting in 3 seconds..."
  sleep 3
done
