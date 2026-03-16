import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Activity, Target, DollarSign,
  BarChart3, Zap, ArrowUpRight, ArrowDownRight, Clock, Shield
} from 'lucide-react';
import './css/renoDashboard.css';

const agent = { name: 'Reno', emoji: '📈', role: 'Investment & Market Intelligence', color: '#10b981' };

const portfolioTrend = [
  { day: 'Mon', value: 4680 },
  { day: 'Tue', value: 4720 },
  { day: 'Wed', value: 4695 },
  { day: 'Thu', value: 4780 },
  { day: 'Fri', value: 4810 },
  { day: 'Sat', value: 4795 },
  { day: 'Sun', value: 4830 },
];

const btcTrend = [
  { day: 'Mon', value: 4050 },
  { day: 'Tue', value: 4120 },
  { day: 'Wed', value: 4080 },
  { day: 'Thu', value: 4150 },
  { day: 'Fri', value: 4190 },
  { day: 'Sat', value: 4200 },
  { day: 'Sun', value: 4217 },
];

const positions = [
  { ticker: 'BMNR', name: 'Beamer Inc.', type: 'Long', entry: 42.10, current: 42.44, change: +0.8, qty: 120, signal: 'RSI breakout' },
  { ticker: 'NVTX', name: 'NovaTeX Corp.', type: 'Long', entry: 118.50, current: 121.30, change: +2.4, qty: 40, signal: 'Golden cross' },
  { ticker: 'RLXD', name: 'Relaxed Media', type: 'Short', entry: 67.20, current: 65.80, change: +2.1, qty: 60, signal: 'Head & shoulders' },
  { ticker: 'CRDX', name: 'CardioX Health', type: 'Iron Condor', entry: 89.00, current: 88.75, change: -0.3, qty: 10, signal: 'Low vol play' },
  { ticker: 'QNTM', name: 'Quantum Fiber', type: 'Long', entry: 33.60, current: 33.10, change: -1.5, qty: 200, signal: 'Support bounce' },
];

const signals = [
  { id: 1, type: 'buy', ticker: 'BMNR', desc: 'RSI crossed above 30 — oversold bounce triggered', time: '2m ago', strength: 'strong' },
  { id: 2, type: 'alert', ticker: 'SPY', desc: 'VIX spike detected — hedging recommended', time: '18m ago', strength: 'medium' },
  { id: 3, type: 'sell', ticker: 'FRDX', desc: 'MACD bearish divergence on daily chart', time: '34m ago', strength: 'strong' },
  { id: 4, type: 'buy', ticker: 'NVTX', desc: '50/200 DMA golden cross confirmed', time: '1h ago', strength: 'strong' },
  { id: 5, type: 'alert', ticker: 'ETH', desc: 'Gas fees at 90-day low — DeFi entry window', time: '1h ago', strength: 'weak' },
  { id: 6, type: 'sell', ticker: 'QNTM', desc: 'Approaching resistance at $34.20 — tighten stops', time: '2h ago', strength: 'medium' },
  { id: 7, type: 'buy', ticker: 'RLXD', desc: 'Earnings beat estimate by 12% — gap up expected', time: '3h ago', strength: 'strong' },
];

const activityFeed = [
  { id: 1, action: 'Executed', detail: 'Bought 120 BMNR @ $42.10 — RSI signal', time: '2m ago', status: 'success' },
  { id: 2, action: 'Adjusted', detail: 'Tightened RLXD short stop to $66.40', time: '15m ago', status: 'info' },
  { id: 3, action: 'Analyzed', detail: 'Sector rotation scan — tech outperforming utilities', time: '28m ago', status: 'info' },
  { id: 4, action: 'Alert', detail: 'CRDX iron condor approaching short strike — monitor', time: '45m ago', status: 'warning' },
  { id: 5, action: 'Executed', detail: 'Closed FRDX long @ $71.20 — locked in +3.2%', time: '1h ago', status: 'success' },
  { id: 6, action: 'Rebalanced', detail: 'Portfolio beta reduced from 1.4 to 1.1', time: '2h ago', status: 'info' },
  { id: 7, action: 'Scanned', detail: '147 tickers screened — 7 signals generated', time: '3h ago', status: 'info' },
];

const marketData = [
  { name: 'S&P 500', value: '5,892.40', change: '+0.3%', up: true },
  { name: 'NASDAQ', value: '18,420.15', change: '+0.5%', up: true },
  { name: 'VIX', value: '14.8', change: '-2.1%', up: true },
  { name: 'DXY', value: '103.42', change: '-0.1%', up: true },
  { name: '10Y Yield', value: '4.28%', change: '+0.02', up: false },
  { name: 'Gold', value: '2,185.30', change: '+0.4%', up: true },
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
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${color.replace('#','')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function App() {
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
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 11 }} />
                  <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    formatter={(v) => [`$${v}`, 'Value']}
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
                    {p.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
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
            <div className="reno-signals-list">
              {signals.map((s) => (
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
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 11 }} />
                  <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    formatter={(v) => [`$${v}`, 'BTC']}
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
