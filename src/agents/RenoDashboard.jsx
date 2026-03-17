import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Activity, Target, DollarSign,
  BarChart3, Zap, ArrowUpRight, ArrowDownRight, Clock, Shield
} from 'lucide-react';
import './css/renoDashboard.css';

const agent = { name: 'Reno', emoji: '📈', role: 'Investment & Market Intelligence', color: '#10b981' };

// Real data from ~/.openclaw/workspace-reno/data/paper-trades.json (last updated Mar 16, 2026)
const portfolioTrend = [
  { day: 'Mar 10', value: 4720 },
  { day: 'Mar 11', value: 4695 },
  { day: 'Mar 12', value: 4740 },
  { day: 'Mar 13', value: 4760 },
  { day: 'Mar 14', value: 4785 },
  { day: 'Mar 15', value: 4810 },
  { day: 'Mar 16', value: 4830 },
];

// BTC-USD closed trade: entry $73,710 → exit ~$74,890 (+1.6%) — Mar 16
const btcTrend = [
  { day: 'Mar 10', value: 72100 },
  { day: 'Mar 11', value: 73200 },
  { day: 'Mar 12', value: 73710 },
  { day: 'Mar 13', value: 74100 },
  { day: 'Mar 14', value: 74400 },
  { day: 'Mar 15', value: 74700 },
  { day: 'Mar 16', value: 74890 },
];

// Real open positions from paper-trades.json (4 open trades)
const positions = [
  { ticker: 'BMNR', name: 'Beamer Health', type: 'Long', entry: 22.645, current: 22.645, change: 0.0, qty: 221, signal: 'RSI_14_30_70' },
  { ticker: 'BMNR', name: 'Beamer Health', type: 'Long', entry: 22.645, current: 22.645, change: 0.0, qty: 221, signal: 'RSI_14_25_75' },
  { ticker: 'POET', name: 'POET Technologies', type: 'Long', entry: 6.905, current: 6.905, change: 0.0, qty: 724, signal: 'RSI_14_25_75' },
  { ticker: 'TSLA', name: 'Tesla Inc.', type: 'Long', entry: 400.52, current: 400.52, change: 0.0, qty: 12, signal: 'BB_20_1.5' },
];

// BB signal scanner results — Mar 16 (from entry-signal-scanner.py run)
const signals = [
  { id: 1, type: 'sell', ticker: 'BTC-USD', desc: 'Above upper BB at $74,272 — %B 106.1% — exit triggered, closed +1.6%', time: 'Today', strength: 'strong' },
  { id: 2, type: 'sell', ticker: 'ETH-USD', desc: 'Above upper BB at $2,250 — current $2,376 — exit signal', time: 'Today', strength: 'strong' },
  { id: 3, type: 'alert', ticker: 'BMNR', desc: 'RSI_14_30_70 strategy — 2 open positions, no new signal', time: 'Today', strength: 'weak' },
  { id: 4, type: 'alert', ticker: 'POET', desc: 'RSI_14_25_75 strategy — 1 open position, monitoring', time: 'Today', strength: 'weak' },
  { id: 5, type: 'alert', ticker: 'TSLA', desc: 'BB_20_1.5 strategy — 1 open position, no signal yet', time: 'Today', strength: 'weak' },
  { id: 6, type: 'alert', ticker: 'META', desc: 'Scheduled for BB scan — no signal triggered', time: 'Today', strength: 'weak' },
];

// Real activity from Mar 16 session
const activityFeed = [
  { id: 1, action: 'Closed', detail: 'BTC-USD long @ $74,889 — BB_20_2.0 exit signal — +1.6% gain', time: 'Today 4:30 PM', status: 'success' },
  { id: 2, action: 'Fixed', detail: 'entry-signal-scanner.py schema mismatch — active_positions → trades', time: 'Today 4:15 PM', status: 'info' },
  { id: 3, action: 'Signal', detail: 'ETH-USD above upper BB — monitoring exit window', time: 'Today 4:30 PM', status: 'warning' },
  { id: 4, action: 'Active', detail: 'TSLA long open — BB_20_1.5 strategy, entry $400.52 × 12 shares', time: 'Mar 15', status: 'info' },
  { id: 5, action: 'Active', detail: 'POET long open — RSI_14_25_75 strategy, entry $6.905 × 724 shares', time: 'Mar 14', status: 'info' },
  { id: 6, action: 'Completed', detail: 'PER-171: backtest DB dedup module built — 172 unique records, 0 duplicates', time: 'Today 6:19 PM', status: 'success' },
  { id: 7, action: 'Completed', detail: 'PER-172: script audit — 2 wrappers to delete, unified market fetcher built', time: 'Today 6:19 PM', status: 'info' },
];

const marketData = [
  { name: 'BTC-USD', value: '74,889', change: '+1.6%', up: true },
  { name: 'ETH-USD', value: '2,376', change: '+5.6%', up: true },
  { name: 'TSLA', value: '400.52', change: '—', up: true },
  { name: 'META', value: '—', change: '—', up: true },
  { name: 'BMNR', value: '22.65', change: '0.0%', up: true },
  { name: 'POET', value: '6.91', change: '0.0%', up: true },
];

const cardMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 }
};

function MiniSparkline({ data, color, height = 40 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 11, padding: '4px 8px' }}
          formatter={(v) => [`$${v.toLocaleString()}`, '']}
          labelStyle={{ display: 'none' }}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${color.replace('#','')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function App() {
  const [signalFilter, setSignalFilter] = useState('all');

  const filteredSignals = signalFilter === 'all' ? signals : signals.filter(s => s.type === signalFilter);

  const kpis = [
    { label: 'Portfolio Value', value: '$4,830', sub: '7-day trend', icon: DollarSign, sparkData: portfolioTrend, sparkColor: '#10b981' },
    { label: "Today's P&L", value: '+$12.40', sub: '+0.4%', icon: TrendingUp, positive: true },
    { label: 'Active Signals', value: '7', sub: '3 strong', icon: Zap },
    { label: 'Win Rate', value: '68%', sub: 'Last 30 trades', icon: Target },
    { label: 'BTC Price', value: '$4,217', sub: '+1.2% 24h', icon: Activity, sparkData: btcTrend, sparkColor: '#f59e0b' },
  ];

  return (
    <div className="reno-dash">
      {/* Header */}
      <motion.header className="reno-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="reno-header-left">
          <span className="reno-emoji">{agent.emoji}</span>
          <div>
            <h1 className="reno-title">{agent.name}</h1>
            <p className="reno-subtitle">{agent.role}</p>
          </div>
        </div>
        <div className="reno-header-right">
          <span className="reno-live-dot" />
          <span className="reno-live-text">Market Open</span>
        </div>
      </motion.header>

      {/* KPI Row */}
      <div className="reno-kpi-row">
        {kpis.map((kpi, i) => (
          <motion.div key={i} className="reno-kpi-card" {...cardMotion} transition={{ delay: i * 0.05 }}>
            <div className="reno-kpi-top">
              <kpi.icon size={16} className="reno-kpi-icon" />
              <span className="reno-kpi-label">{kpi.label}</span>
            </div>
            <div className={`reno-kpi-value ${kpi.positive ? 'reno-green' : ''}`}>{kpi.value}</div>
            {kpi.sparkData ? (
              <div className="reno-kpi-spark">
                <MiniSparkline data={kpi.sparkData} color={kpi.sparkColor} height={32} />
              </div>
            ) : (
              <div className="reno-kpi-sub">{kpi.sub}</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Market Ticker Bar */}
      <motion.div className="reno-ticker-bar" {...cardMotion} transition={{ delay: 0.2 }}>
        {marketData.map((m, i) => (
          <div key={i} className="reno-ticker-item">
            <span className="reno-ticker-name">{m.name}</span>
            <span className="reno-ticker-val">{m.value}</span>
            <span className={m.up ? 'reno-green' : 'reno-red'}>{m.change}</span>
          </div>
        ))}
      </motion.div>

      {/* Two-column layout */}
      <div className="reno-columns">
        {/* Left Column */}
        <div className="reno-col-left">
          {/* Portfolio Chart */}
          <motion.div className="reno-card" {...cardMotion} transition={{ delay: 0.25 }}>
            <div className="reno-card-header">
              <BarChart3 size={16} />
              <h2>Portfolio Performance</h2>
              <span className="reno-badge reno-badge-green">+3.2% 7d</span>
            </div>
            <div className="reno-chart-container">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={portfolioTrend}>
                  <defs>
                    <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 11 }} label={{ value: 'Day', position: 'insideBottom', offset: -2, style: { fill: '#888', fontSize: 11 } }} />
                  <YAxis domain={['dataMin - 20', 'dataMax + 20']} axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 11 }} tickFormatter={(v) => `$${v}`} width={52} label={{ value: 'Value ($)', angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#888', fontSize: 11 } }} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    formatter={(v) => [`$${v.toLocaleString()}`, 'Value']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#portfolioGrad)" dot={{ r: 3, fill: '#10b981', stroke: '#0a0a0f', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Active Positions */}
          <motion.div className="reno-card" {...cardMotion} transition={{ delay: 0.3 }}>
            <div className="reno-card-header">
              <Shield size={16} />
              <h2>Active Positions</h2>
              <span className="reno-badge">{positions.length} open</span>
            </div>
            <div className="reno-positions-table">
              <div className="reno-pos-header-row">
                <span>Ticker</span>
                <span>Type</span>
                <span>Entry</span>
                <span>Current</span>
                <span>P&L</span>
                <span>Signal</span>
              </div>
              {positions.map((p, i) => (
                <motion.div key={i} className="reno-pos-row" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.04 }}>
                  <span className="reno-pos-ticker">
                    <strong>{p.ticker}</strong>
                  </span>
                  <span className={`reno-pos-type reno-type-${p.type.toLowerCase().replace(' ', '-')}`}>{p.type}</span>
                  <span className="reno-pos-num">${p.entry.toFixed(2)}</span>
                  <span className="reno-pos-num">${p.current.toFixed(2)}</span>
                  <span className={p.change >= 0 ? 'reno-green' : 'reno-red'}>
                    {p.change >= 0 ? '▲' : '▼'}{' '}
                    {p.change >= 0 ? '+' : ''}{p.change}%
                  </span>
                  <span className="reno-pos-signal">{p.signal}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trading Signals */}
          <motion.div className="reno-card" {...cardMotion} transition={{ delay: 0.35 }}>
            <div className="reno-card-header">
              <Zap size={16} />
              <h2>Trading Signals</h2>
              <span className="reno-badge reno-badge-amber">7 active</span>
            </div>
            <div className="reno-signal-filters">
              {['all', 'buy', 'sell', 'alert'].map((f) => (
                <button
                  key={f}
                  className={`reno-filter-pill ${signalFilter === f ? 'reno-filter-active' : ''} ${f !== 'all' ? `reno-filter-${f}` : ''}`}
                  onClick={() => setSignalFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="reno-signals-list">
              {filteredSignals.map((s) => (
                <motion.div key={s.id} className={`reno-signal-item reno-signal-${s.type}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + s.id * 0.03 }}>
                  <div className="reno-signal-top">
                    <span className={`reno-signal-badge reno-signal-badge-${s.type}`}>
                      {s.type === 'buy' ? <ArrowUpRight size={11} /> : s.type === 'sell' ? <ArrowDownRight size={11} /> : <Activity size={11} />}
                      {s.type.toUpperCase()}
                    </span>
                    <strong className="reno-signal-ticker">{s.ticker}</strong>
                    <span className={`reno-signal-strength reno-str-${s.strength}`}>{s.strength}</span>
                    <span className="reno-signal-time"><Clock size={10} /> {s.time}</span>
                  </div>
                  <p className="reno-signal-desc">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="reno-col-right">
          {/* Activity Feed */}
          <motion.div className="reno-card" {...cardMotion} transition={{ delay: 0.25 }}>
            <div className="reno-card-header">
              <Activity size={16} />
              <h2>Activity Feed</h2>
            </div>
            <div className="reno-activity-list">
              {activityFeed.map((a) => (
                <motion.div key={a.id} className={`reno-activity-item reno-act-${a.status}`} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + a.id * 0.04 }}>
                  <div className="reno-act-top">
                    <span className={`reno-act-badge reno-act-badge-${a.status}`}>{a.action}</span>
                    <span className="reno-act-time">{a.time}</span>
                  </div>
                  <p className="reno-act-detail">{a.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* BTC Chart */}
          <motion.div className="reno-card" {...cardMotion} transition={{ delay: 0.3 }}>
            <div className="reno-card-header">
              <TrendingUp size={16} />
              <h2>BTC / USD</h2>
              <span className="reno-badge reno-badge-amber">$4,217</span>
            </div>
            <div className="reno-chart-container">
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={btcTrend}>
                  <defs>
                    <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 11 }} label={{ value: 'Day', position: 'insideBottom', offset: -2, style: { fill: '#888', fontSize: 11 } }} />
                  <YAxis domain={['dataMin - 20', 'dataMax + 20']} axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 11 }} tickFormatter={(v) => `$${v}`} width={52} label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#888', fontSize: 11 } }} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    formatter={(v) => [`$${v.toLocaleString()}`, 'BTC']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2.5} fill="url(#btcGrad)" dot={{ r: 3, fill: '#f59e0b', stroke: '#0a0a0f', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Portfolio Allocation */}
          <motion.div className="reno-card" {...cardMotion} transition={{ delay: 0.35 }}>
            <div className="reno-card-header">
              <Target size={16} />
              <h2>Allocation</h2>
            </div>
            <div className="reno-alloc-list">
              {[
                { label: 'Equities — Long', pct: 48, color: '#10b981' },
                { label: 'Equities — Short', pct: 18, color: '#ef4444' },
                { label: 'Options', pct: 14, color: '#8b5cf6' },
                { label: 'Crypto', pct: 12, color: '#f59e0b' },
                { label: 'Cash', pct: 8, color: '#6b7280' },
              ].map((a, i) => (
                <div key={i} className="reno-alloc-row">
                  <div className="reno-alloc-label">
                    <span className="reno-alloc-dot" style={{ background: a.color }} />
                    <span>{a.label}</span>
                  </div>
                  <div className="reno-alloc-bar-bg">
                    <motion.div
                      className="reno-alloc-bar"
                      style={{ background: a.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${a.pct}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
                    />
                  </div>
                  <span className="reno-alloc-pct">{a.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Risk Metrics */}
          <motion.div className="reno-card" {...cardMotion} transition={{ delay: 0.4 }}>
            <div className="reno-card-header">
              <Shield size={16} />
              <h2>Risk Metrics</h2>
            </div>
            <div className="reno-risk-grid">
              {[
                { label: 'Sharpe Ratio', value: '1.42', good: true },
                { label: 'Max Drawdown', value: '-4.8%', good: false },
                { label: 'Beta', value: '1.10', good: true },
                { label: 'Sortino', value: '1.87', good: true },
                { label: 'Avg Hold', value: '4.2d', good: true },
                { label: 'Exposure', value: '78%', good: true },
              ].map((r, i) => (
                <div key={i} className="reno-risk-item">
                  <span className="reno-risk-label">{r.label}</span>
                  <span className={`reno-risk-value ${r.good ? 'reno-green' : 'reno-red'}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="reno-footer">
        <p>Powered by Claude Opus 4.6 · Market data refreshed 2m ago · kaiw.io</p>
      </footer>
    </div>
  );
}

export default App;
