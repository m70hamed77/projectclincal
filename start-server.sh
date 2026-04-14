#!/bin/bash

# Script to keep the dev server running permanently

cd /home/z/my-project

echo "Starting dev server with auto-restart..."

while true; do
    echo "[$(date)] Starting dev server..."
    bun run dev >> /home/z/my-project/dev.log 2>&1
    EXIT_CODE=$?

    if [ $EXIT_CODE -eq 0 ]; then
        echo "[$(date)] Server exited normally. Restarting..."
    else
        echo "[$(date)] Server crashed with exit code $EXIT_CODE. Restarting in 3 seconds..."
    fi

    # Wait a bit before restarting
    sleep 3
done
