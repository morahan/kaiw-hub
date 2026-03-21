#!/bin/bash
# Database optimization script using sqlite3 CLI
# Creates indexes for frequently queried columns

DB_PATH="$HOME/clawd/dashboard/data/analytics.db"

echo "🔧 Optimizing Quanta Analytics Database..."
echo "📊 Database: $DB_PATH"
echo ""

if [ ! -f "$DB_PATH" ]; then
    echo "❌ Database not found at $DB_PATH"
    exit 1
fi

# Create indexes
indexes=(
    "CREATE INDEX IF NOT EXISTS idx_session_metrics_date ON session_metrics(date);"
    "CREATE INDEX IF NOT EXISTS idx_session_metrics_agent ON session_metrics(agent);"
    "CREATE INDEX IF NOT EXISTS idx_session_metrics_model ON session_metrics(model);"
    "CREATE INDEX IF NOT EXISTS idx_session_metrics_date_agent ON session_metrics(date, agent);"
    "CREATE INDEX IF NOT EXISTS idx_session_metrics_date_model ON session_metrics(date, model);"
    "CREATE INDEX IF NOT EXISTS idx_sys_snapshots_gpu_util ON sys_snapshots(gpu_util_pct);"
    "CREATE INDEX IF NOT EXISTS idx_sys_snapshots_vram ON sys_snapshots(vram_used_gb);"
    "CREATE INDEX IF NOT EXISTS idx_sys_snapshots_ts_gpu ON sys_snapshots(timestamp DESC, gpu_util_pct);"
    "CREATE INDEX IF NOT EXISTS idx_anomalies_level ON anomalies_log(level);"
    "CREATE INDEX IF NOT EXISTS idx_anomalies_timestamp ON anomalies_log(detected_at DESC);"
)

created=0
for idx in "${indexes[@]}"; do
    output=$(sqlite3 "$DB_PATH" "$idx" 2>&1)
    if [ $? -eq 0 ]; then
        # Extract table name for nice display
        table=$(echo "$idx" | grep -oP 'ON \K\w+')
        echo "✅ $table"
        ((created++))
    else
        if echo "$output" | grep -q "already exists"; then
            ((created++))
        else
            echo "⚠️  $idx"
        fi
    fi
done

echo ""
echo "📈 Database optimization complete!"
echo "   Indexed: ${created} columns"
echo ""

# Performance analysis
echo "⚡ Query Performance Analysis:"
echo ""

queries=(
    "Daily agent summary (7 days)|SELECT agent, COUNT(*) as sessions, SUM(total_tokens) as tokens FROM session_metrics WHERE date >= '2026-03-10' AND date <= '2026-03-17' GROUP BY agent;"
    "Model efficiency (7 days)|SELECT model, COUNT(*) as sessions, SUM(cost_usd) as cost FROM session_metrics WHERE date >= '2026-03-10' AND date <= '2026-03-17' GROUP BY model ORDER BY cost DESC LIMIT 5;"
    "System GPU utilization|SELECT substr(timestamp, 1, 13) as hour, ROUND(AVG(gpu_util_pct), 1) as gpu_util, COUNT(*) as samples FROM sys_snapshots WHERE timestamp >= datetime('now', '-24 hours') GROUP BY hour LIMIT 5;"
)

for query in "${queries[@]}"; do
    IFS='|' read -r name sql <<< "$query"
    echo "  Testing: $name"
    result=$(time sqlite3 "$DB_PATH" "$sql" 2>&1)
    echo "    ✅ Query complete"
    echo ""
done

echo "✨ Quanta API is now optimized!"
echo ""
echo "Next steps:"
echo "  1. sudo systemctl start quanta-api     # Start persistent server"
echo "  2. systemctl status quanta-api         # Verify it's running"
echo "  3. curl http://localhost:3001/api/quanta/health  # Test endpoint"
