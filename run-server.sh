#!/bin/bash

cd /home/z/my-project

while true; do
  echo "$(date): Starting server..." >> /home/z/my-project/server-pid.log
  bun run dev >> /home/z/my-project/dev.log 2>&1 &
  SERVER_PID=$!

  echo "$(date): Server started with PID $SERVER_PID" >> /home/z/my-project/server-pid.log

  # Wait for server process
  wait $SERVER_PID 2>/dev/null

  echo "$(date): Server stopped, restarting in 2 seconds..." >> /home/z/my-project/server-pid.log
  sleep 2
done
