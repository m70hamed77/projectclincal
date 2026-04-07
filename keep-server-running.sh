#!/bin/bash

# هذا السكريبت يحافظ على تشغيل خادم التطوير
# استخدم: ./keep-server-running.sh

echo "=========================================="
echo "Starting Smile Dental Clinic Dev Server"
echo "=========================================="
echo ""

# إيقاف أي عمليات قديمة
echo "🔧 Stopping any old servers..."
pkill -f "next dev" 2>/dev/null
sleep 2

# تشغيل الخادم
echo "🚀 Starting development server on http://localhost:3000"
echo "📝 Logs are saved to: /home/z/my-project/server.log"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

# تشغيل الخادم مع إعادة التشغيل التلقائي
while true; do
    cd /home/z/my-project
    bun run dev >> /home/z/my-project/server.log 2>&1

    echo ""
    echo "⚠️ Server stopped! Restarting in 3 seconds..."
    echo "[$(date)] Server stopped unexpectedly" >> /home/z/my-project/server.log
    sleep 3
done
