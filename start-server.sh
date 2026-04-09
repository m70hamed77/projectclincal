#!/bin/bash
cd /home/z/my-project

# Kill any existing server
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "node.*next" 2>/dev/null

# Start new server
bun run dev > /home/z/my-project/dev.log 2>&1 &
echo "Server restarted at $(date)" >> /home/z/my-project/server-restart.log
