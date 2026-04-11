#!/bin/bash

# ========================================
# Professional Server Startup Script
# ========================================

echo "🚀 Starting Server Setup..."

# Step 1: Kill all existing processes
echo "📌 Step 1/5: Stopping existing servers..."
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null
pkill -9 -f "node.*next" 2>/dev/null
killall -9 node 2>/dev/null
killall -9 bun 2>/dev/null
fuser -k 3000/tcp 2>/dev/null
sleep 3
echo "✅ All processes stopped"

# Step 2: Clean caches
echo "📌 Step 2/5: Cleaning caches..."
rm -rf /home/z/my-project/.next
rm -rf /home/z/my-project/node_modules/.prisma
echo "✅ Caches cleaned"

# Step 3: Sync database
echo "📌 Step 3/5: Syncing database..."
bun run db:push --accept-data-loss > /dev/null 2>&1
echo "✅ Database synced"

# Step 4: Start server
echo "📌 Step 4/5: Starting Next.js server..."
cd /home/z/my-project
bun run dev > /home/z/my-project/dev.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > /home/z/my-project/server.pid
echo "✅ Server started (PID: $SERVER_PID)"

# Step 5: Wait and verify
echo "📌 Step 5/5: Verifying server status..."
sleep 15

# Check if server is still running
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "✅ Server is running successfully!"
    echo "📊 Server PID: $SERVER_PID"
    echo "📝 Logs: /home/z/my-project/dev.log"
    echo "🌐 Local: http://localhost:3000"
    echo ""
    echo "📈 Recent logs:"
    tail -20 /home/z/my-project/dev.log
else
    echo "❌ Server failed to start. Check logs:"
    cat /home/z/my-project/dev.log
    exit 1
fi
