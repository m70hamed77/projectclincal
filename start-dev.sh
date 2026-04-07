#!/bin/bash

# سكريبت للحفاظ على تشغيل خادم التطوير

# إيقاف أي عمليات قديمة
pkill -f "next dev" 2>/dev/null
sleep 2

# تشغيل الخادم في الخلفية مع إعادة التشغيل التلقائي
while true; do
  echo "[$(date)] Starting dev server..."
  npx cross-env TURBOPACK=0 next dev -p 3000 >> /home/z/my-project/dev.log 2>&1

  echo "[$(date)] Server stopped! Restarting in 3 seconds..."
  sleep 3
done
