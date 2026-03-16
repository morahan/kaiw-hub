import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './Dashboard.css';

// Mock 24h timeseries data (hourly)
const generateTimeseries = () => {
  const data = [];
  const now = new Date(2026, 2, 16, 14, 0); // March 16, 2026, 2pm
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600000);
    const hour = t.getHours();
    // Realistic usage pattern: low overnight, peaks mid-morning and afternoon
    const base = hour >= 8 && hour <= 18 ? 60 : 15;
    const sessions = Math.round(base + Math.random() * 40 + (hour === 10 || hour === 14 ? 30 : 0));
    const tokens = Math.round((sessions * 3200) + Math.random() * 8000);
    data.push({
      time: `${String(t.getHours()).padStart(2, '0')}:00`,
      sessions,
      tokens,
    });
  }
  return data;
};

const mockTimeseries = generateTimeseries();

const RANGES = ['24h', '7d', '30d'];

function MainDashboard() {
  const [activeRange, setActiveRange] = useState('24h');

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-row">
          <div>
            <h1><span>◉</span> Overview</h1>
            <p>Rolling 24 hours &bull; Denver timezone (MST)</p>
          </div>
          <div className="dashboard-header-right">
            <div className="time-range-selector">
              {RANGES.map(r => (
                <button
                  key={r}
                  className={activeRange === r ? 'active' : ''}
                  onClick={() => setActiveRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            <span className="last-updated">Last updated: 2 min ago</span>
          </div>
        </div>
      </header>

      <div className="stats-grid stats-grid-hero">
        {/* Hero KPI — Total Sessions */}
        <div className="stat-card stat-card-hero">
          <span className="stat-label">Total Sessions</span>
          <span className="stat-value stat-value-hero">1,247</span>
          <span className="stat-change positive">
            ↑ 12% vs prev 24h
          </span>
        </div>
        {/* Secondary KPIs */}
        <div className="stat-card">
          <span className="stat-label">Tokens This Month</span>
          <span className="stat-value">4.2M</span>
          <span className="stat-change positive">↑ 8% vs prev month</span>
        </div>
        <div className="stat-card stat-card-cost">
          <span className="stat-label">Est. Cost (USD)</span>
          <span className="stat-value">$8.30</span>
          <span className="stat-change negative">↑ 3% vs prev 24h</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Agents</span>
          <span className="stat-value">9<span className="stat-value-sub">/12</span></span>
          <span className="stat-change positive">● 9 online</span>
        </div>
      </div>

      {/* Top Model callout */}
      <div className="top-model-bar">
        <span className="top-model-label">Top Model</span>
        <span className="top-model-value">claude-sonnet-4-5</span>
        <span className="top-model-detail">71% of requests &bull; avg 1.2s latency</span>
      </div>

      <div className="charts-grid">
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Activity Timeline &bull; Last 24 Hours</h3>
            <div className="chart-legend-custom">
              <span className="legend-dot" style={{ background: '#00d4ff' }}></span>
              <span>Sessions</span>
              <span className="legend-dot" style={{ background: '#a855f7' }}></span>
              <span>Tokens (K)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={mockTimeseries}>
              <defs>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{fontSize: 11, fontFamily: 'JetBrains Mono'}}
              />
              <YAxis
                yAxisId="sessions"
                stroke="#64748b"
                tick={{fontSize: 11, fontFamily: 'JetBrains Mono'}}
                label={{ value: 'Sessions', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
              />
              <YAxis
                yAxisId="tokens"
                orientation="right"
                stroke="#64748b"
                tick={{fontSize: 11, fontFamily: 'JetBrains Mono'}}
                tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}
                label={{ value: 'Tokens', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#16161f',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px'
                }}
                formatter={(value, name) => [
                  formatNumber(value),
                  name === 'sessions' ? 'Sessions' : 'Tokens'
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area
                yAxisId="sessions"
                type="monotone"
                dataKey="sessions"
                stroke="#00d4ff"
                fillOpacity={1}
                fill="url(#colorSessions)"
                strokeWidth={2}
                name="sessions"
                animationDuration={1000}
              />
              <Area
                yAxisId="tokens"
                type="monotone"
                dataKey="tokens"
                stroke="#a855f7"
                fillOpacity={1}
                fill="url(#colorTokens)"
                strokeWidth={2}
                name="tokens"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default MainDashboard;
