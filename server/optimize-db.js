#!/usr/bin/env node
/**
 * Database optimization script
 * Creates indexes for frequently queried columns to improve performance
 */

import Database from 'better-sqlite3';

const db = new Database('/home/scribble0563/clawd/dashboard/data/analytics.db');

const indexes = [
  // session_metrics indexes
  'CREATE INDEX IF NOT EXISTS idx_session_metrics_date ON session_metrics(date)',
  'CREATE INDEX IF NOT EXISTS idx_session_metrics_agent ON session_metrics(agent)',
  'CREATE INDEX IF NOT EXISTS idx_session_metrics_model ON session_metrics(model)',
  'CREATE INDEX IF NOT EXISTS idx_session_metrics_date_agent ON session_metrics(date, agent)',
  'CREATE INDEX IF NOT EXISTS idx_session_metrics_date_model ON session_metrics(date, model)',
  
  // sys_snapshots indexes (already has some, adding more)
  'CREATE INDEX IF NOT EXISTS idx_sys_snapshots_gpu_util ON sys_snapshots(gpu_util_pct)',
  'CREATE INDEX IF NOT EXISTS idx_sys_snapshots_vram ON sys_snapshots(vram_used_gb)',
  'CREATE INDEX IF NOT EXISTS idx_sys_snapshots_ts_gpu ON sys_snapshots(timestamp DESC, gpu_util_pct)',
  
  // anomalies_log indexes
  'CREATE INDEX IF NOT EXISTS idx_anomalies_severity ON anomalies_log(level)',
  'CREATE INDEX IF NOT EXISTS idx_anomalies_timestamp ON anomalies_log(detected_at DESC)',
];

console.log('🔧 Optimizing Quanta Analytics Database...');
console.log(`📊 Database: /home/scribble0563/clawd/dashboard/data/analytics.db\n`);

let created = 0;
let skipped = 0;

for (const sql of indexes) {
  try {
    db.exec(sql);
    const indexName = sql.match(/ON (\w+)\(/)?.[1] || 'unknown';
    console.log(`✅ ${indexName}`);
    created++;
  } catch (err) {
    if (err.message.includes('already exists')) {
      skipped++;
    } else {
      console.error(`❌ Error: ${err.message}`);
    }
  }
}

console.log(`\n📈 Database optimization complete!`);
console.log(`   Created: ${created} indexes`);
console.log(`   Skipped: ${skipped} (already exist)`);

// Analyze query performance
console.log('\n⚡ Query Performance Analysis:\n');

const queries = [
  { name: 'Daily agent summary (7 days)', sql: `SELECT agent, COUNT(*) as sessions, SUM(total_tokens) as tokens FROM session_metrics WHERE date >= ? AND date <= ? GROUP BY agent`, param: ['2026-03-10', '2026-03-17'] },
  { name: 'Model efficiency (7 days)', sql: `SELECT model, COUNT(*) as sessions, SUM(cost_usd) as cost FROM session_metrics WHERE date >= ? AND date <= ? GROUP BY model ORDER BY cost DESC`, param: ['2026-03-10', '2026-03-17'] },
  { name: 'System load (last 24h)', sql: `SELECT substr(timestamp, 1, 13) as hour, AVG(gpu_util_pct) as gpu_util FROM sys_snapshots WHERE timestamp >= datetime('now', '-24 hours') GROUP BY hour`, param: [] },
];

for (const q of queries) {
  const start = performance.now();
  const result = db.prepare(q.sql).all(...q.param);
  const elapsed = (performance.now() - start).toFixed(2);
  console.log(`  ${q.name}: ${elapsed}ms (${result.length} rows)`);
}

console.log('\n✨ Quanta API is now optimized for fast queries!');
db.close();
