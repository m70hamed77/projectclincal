#!/bin/bash
cd /home/z/my-project
while true; do
  if ! ps aux | grep "node.*next.*dev.*3000" | grep -v grep > /dev/null; then
    echo "$(date): Starting server..."
    node node_modules/.bin/next dev -p 3000 > /home/z/my-project/server.log 2>&1 &
    echo "Server started with PID: $!"
  fi
  sleep 5
done
