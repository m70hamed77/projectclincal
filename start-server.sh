#!/bin/bash

# Kill existing processes
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null
fuser -k 3000/tcp 2>/dev/null
sleep 2

# Set DATABASE_URL explicitly
export DATABASE_URL="postgresql://neondb_owner:npg_8VWQD3iHtPAp@ep-bitter-sound-amro63xu-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Display DATABASE_URL (for debugging)
echo "🔧 DATABASE_URL: ${DATABASE_URL:0:50}..."

# Start the server
cd /home/z/my-project
echo "🚀 Starting server..."
nohup bun run dev > /home/z/my-project/dev-server-persistent.log 2>&1 &

# Wait for server to start
sleep 12

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server started successfully!"
    curl -s http://localhost:3000 | grep -o "<title>.*</title>"
else
    echo "❌ Server failed to start"
    tail -50 /home/z/my-project/dev-server-persistent.log
fi
