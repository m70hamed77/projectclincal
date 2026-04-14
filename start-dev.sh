#!/bin/bash

echo "🚀 Starting development server..."
echo "================================"

# Kill any existing server
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "node.*next" 2>/dev/null

# Wait a moment
sleep 2

# Start server
cd /home/z/my-project
echo "✅ Starting Next.js dev server..."
echo "📍 Logs will be saved to: /home/z/my-project/dev.log"
echo "🌐 Server will run at: http://localhost:3000"
echo "================================"
echo "Press Ctrl+C to stop the server"
echo ""

bun run dev
