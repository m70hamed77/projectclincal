#!/bin/bash

cd /home/z/my-project

LOG_FILE="/home/z/my-project/dev.log"
MANAGER_LOG="/home/z/my-project/keep-alive.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $MANAGER_LOG
}

log "=== Keep-Alive Manager Started ==="

while true; do
  # Check if server is running
  if ! pgrep -f "next dev" > /dev/null; then
    log "Server is not running. Starting it..."
    nohup bun run dev >> $LOG_FILE 2>&1 &
    SERVER_PID=$!
    log "Server started with PID: $SERVER_PID"
    sleep 5

    # Verify server is actually running
    if pgrep -f "next dev" > /dev/null; then
      log "✅ Server is running successfully"
    else
      log "❌ Server failed to start, retrying in 5 seconds..."
      sleep 5
    fi
  else
    log "✅ Server is running"
  fi

  # Wait 10 seconds before next check
  sleep 10
done
