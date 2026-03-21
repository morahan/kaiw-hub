#!/bin/bash
# Start Quanta Dashboard API Server
# Runs on port 3001 with automatic restart on crash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PID_FILE="/tmp/quanta-api.pid"
LOG_FILE="/var/log/quanta-api.log"

# Create log directory if needed
mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null || LOG_FILE="/tmp/quanta-api.log"

# Function to start the server
start_server() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Starting Quanta API Server on port 3001..."
    
    cd "$SCRIPT_DIR"
    nohup node quanta.js >> "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    
    sleep 2
    
    if kill -0 $(cat "$PID_FILE") 2>/dev/null; then
        echo "[$(date +'%Y-%m-%d %H:%M:%S')] ✅ Quanta API Server started (PID: $(cat "$PID_FILE"))"
        return 0
    else
        echo "[$(date +'%Y-%m-%d %H:%M:%S')] ❌ Failed to start Quanta API Server"
        return 1
    fi
}

# Function to stop the server
stop_server() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            echo "[$(date +'%Y-%m-%d %H:%M:%S')] Stopping Quanta API Server (PID: $PID)..."
            kill "$PID"
            rm -f "$PID_FILE"
            echo "[$(date +'%Y-%m-%d %H:%M:%S')] ✅ Quanta API Server stopped"
        fi
    fi
}

# Handle signals
trap stop_server SIGTERM SIGINT

# Parse arguments
case "${1:-start}" in
    start)
        start_server
        # Keep the script running to monitor the process
        while true; do
            sleep 10
            if ! kill -0 $(cat "$PID_FILE" 2>/dev/null) 2>/dev/null; then
                echo "[$(date +'%Y-%m-%d %H:%M:%S')] Process died, restarting..."
                start_server
            fi
        done
        ;;
    stop)
        stop_server
        ;;
    restart)
        stop_server
        sleep 1
        start_server
        ;;
    status)
        if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
            echo "✅ Quanta API Server is running (PID: $(cat "$PID_FILE"))"
            curl -s http://localhost:3001/api/quanta/health | jq .
        else
            echo "❌ Quanta API Server is not running"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
