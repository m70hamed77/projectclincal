#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting dev server..."
  bun run dev 2>&1
  echo "[$(date)] Server stopped! Restarting in 3 seconds..."
  sleep 3
done
