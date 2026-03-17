import { useState, useEffect } from 'react';
import { useAuth, UserButton } from '@clerk/react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, BarChart2, Cpu, Database, Zap, Clock, CheckCircle2,
  AlertTriangle, TrendingUp, Users, MessageSquare, RefreshCw,
  Terminal, Server, HardDrive, Wifi, Eye, Target, Award
} from 'lucide-react';
import './css/quantaDashboard.css';

// ─── Real analytics snapshots ───────────────────────────────────────────────

const AGENT_COLOR = '#10b981'; // emerald / teal

const agentMetrics = [
  { agent: 'Marty', emoji: '⚡', msgs: 163, tasks: 2765, avgTps: 21.15, status: 'active', color: '#ef4444' },
  { agent: 'Aria', emoji: '🎵', msgs: 108, tasks: 1448, avgTps: 24.81, status: 'active', color: '#ec4899' },
  { agent: 'Renzo', emoji: '🔥', msgs: 26, tasks: 1661, avgTps: 26.07, status: 'active', color: '#0ea5e9' },
  { agent: 'Reno', emoji: '📈', msgs: 25, tasks: 311, avgTps: 41.86, status: 'active', color: '#f43f5e' },
  { agent: 'Freq', emoji: '🎧', msgs: 21, tasks: 452, avgTps: 18.87, status: 'active', color: '#14b8a6' },
  { agent: 'Thea', emoji: '🏛️', msgs: 12, tasks: 197, avgTps: 27.54, status: 'active', color: '#a855f7' },
  { agent: 'Quanta', emoji: '⏱️', msgs: 10, tasks: 644, avgTps: 28.01, status: 'active', color: '#10b981' },
  { agent: 'Kaia', emoji: '🌊', msgs: 9, tasks: 254, avgTps: 23.33, status: 'active', color: '#06b6d4' },
  { agent: 'Maverick', emoji: '🚦', msgs: 8, tasks: 146, avgTps: 32.38, status: 'active', color: '#eab308' },
  { agent: 'Greta', emoji: '📚', msgs: 5, tasks: 36, avgTps: 25.11, status: 'idle', color: '#8b5cf6' },
  { agent: 'Badger', emoji: '🦡', msgs: 5, tasks: 62, avgTps: 24.37, status: 'idle', color: '#f97316' },
  { agent: 'Workout Flow', emoji: '🏃', msgs: 5, tasks: 45, avgTps: 20.5, status: 'idle', color: '#22c55e' },
];

const systemHealth = {
  cpu: { value: '—', label: 'CPU', unit: '', icon: Cpu, color: '#10b981', warn: null },
  memory: { value: 47, label: 'Memory', unit: '%', icon: HardDrive, color: '#06b6d4', warn: 85 },
  gpu: { value: 23, label: 'GPU', unit: '%', icon: Zap, color: '#a855f7', warn: 90 },
  disk: { value: 57, label: 'Disk', unit: '%', icon: Database, color: '#f97316', warn: 90 },
  net: { value: '—', label: 'Net I/O', unit: '', icon: Wifi, color: '#3b82f6', warn: null },
  uptime: { value: '611.6h', label: 'Uptime', unit: '', icon: Server, color: '#22c55e', warn: null },
};

const services = [
  { name: 'Quanta API Server', status: 'online', latency: null, port: '3001' },
  { name: 'Analytics DB', status: 'online', latency: null, port: 'analytics.db' },
  { name: 'daily_agent_summary', status: 'online', latency: null, port: '5950 rows' },
  { name: 'system_snapshots', status: 'online', latency: null, port: 'latest 2026-02-19' },
  { name: 'qwen3:32b snapshot', status: 'online', latency: null, port: '29.1GB VRAM' },
];

const weeklyActivity = [
  { day: '3/11', Marty: 11, Aria: 0, Renzo: 0, Reno: 2, Other: 3 },
  { day: '3/12', Marty: 15, Aria: 1, Renzo: 1, Reno: 1, Other: 10 },
  { day: '3/13', Marty: 19, Aria: 2, Renzo: 0, Reno: 1, Other: 4 },
  { day: '3/14', Marty: 11, Aria: 2, Renzo: 0, Reno: 4, Other: 6 },
  { day: '3/15', Marty: 55, Aria: 51, Renzo: 11, Reno: 8, Other: 6 },
  { day: '3/16', Marty: 52, Aria: 52, Renzo: 14, Reno: 9, Other: 52 },
];

const responseTimeline = [
  { day: '3/05', sessions: 192, turns: 1394 },
  { day: '3/06', sessions: 429, turns: 3655 },
  { day: '3/07', sessions: 17, turns: 514 },
  { day: '3/08', sessions: 33, turns: 2189 },
  { day: '3/09', sessions: 2, turns: 9 },
  { day: '3/10', sessions: 4, turns: 567 },
  { day: '3/11', sessions: 16, turns: 153 },
  { day: '3/12', sessions: 28, turns: 2149 },
  { day: '3/13', sessions: 26, turns: 907 },
  { day: '3/14', sessions: 23, turns: 442 },
  { day: '3/15', sessions: 131, turns: 1808 },
  { day: '3/16', sessions: 179, turns: 2641 },
];

const taskDistribution = [
  { name: 'Marty', value: 163, color: '#ef4444' },
  { name: 'Aria', value: 108, color: '#ec4899' },
  { name: 'Renzo', value: 26, color: '#0ea5e9' },
  { name: 'Reno', value: 25, color: '#f43f5e' },
  { name: 'Freq', value: 21, color: '#14b8a6' },
  { name: 'Other', value: 54, color: '#374151' },
];

const recentActivity = [
  { id: 1, time: '2026-03-16', agent: 'Aria', emoji: '🎵', color: '#ec4899', action: '52 sessions and 663 turns recorded in daily_agent_summary', type: 'msg' },
  { id: 2, time: '2026-03-16', agent: 'Marty', emoji: '⚡', color: '#ef4444', action: '52 sessions and 14,034,022 tokens captured', type: 'task' },
  { id: 3, time: '2026-03-16', agent: 'Renzo', emoji: '🔥', color: '#0ea5e9', action: '14 sessions with 40,093,817 tokens processed', type: 'content' },
  { id: 4, time: '2026-03-16', agent: 'Reno', emoji: '📈', color: '#f43f5e', action: '9 sessions and 127 turns logged', type: 'research' },
  { id: 5, time: '2026-03-16', agent: 'Quanta', emoji: '⏱️', color: '#10b981', action: '6 sessions reached 34.8 avg TPS', type: 'check' },
  { id: 6, time: '2026-03-16', agent: 'Maverick', emoji: '🚦', color: '#eab308', action: '7 sessions and 4,143,208 tokens attributed', type: 'system' },
  { id: 7, time: '2026-03-16', agent: 'Thea', emoji: '🏛️', color: '#a855f7', action: '7 sessions completed at 31.7 avg TPS', type: 'review' },
];

const typeIcons = {
  msg: MessageSquare, task: Target, code: Terminal, content: Award,
  audio: Activity, review: Eye, system: Server, research: Database, check: CheckCircle2,
};

const TABS = ['overview', 'agents', 'health', 'charts'];

// ─── Subcomponents ──────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  return (
    <motion.div
      className="qd-stat-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <div className="qd-stat-icon" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
        <Icon size={18} color={color} />
      </div>
      <div className="qd-stat-body">
        <span className="qd-stat-value" style={{ color }}>{value}</span>
        <span className="qd-stat-label">{label}</span>
        {sub && <span className="qd-stat-sub">{sub}</span>}
      </div>
    </motion.div>
  );
}

function GaugeBar({ label, value, unit, color, warn }) {
  const pct = typeof value === 'number' ? value : null;
  const isWarn = pct !== null && warn !== null && pct >= warn * 0.85;
  const activeColor = isWarn ? '#f59e0b' : color;
  return (
    <div className="qd-gauge">
      <div className="qd-gauge-header">
        <span className="qd-gauge-label">{label}</span>
        <span className="qd-gauge-value" style={{ color: activeColor }}>
          {value}{unit}
        </span>
      </div>
      {pct !== null && (
        <div className="qd-gauge-track">
          <motion.div
            className="qd-gauge-fill"
            style={{ background: activeColor }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );
}

function ServiceRow({ name, status, latency, port }) {
  const dot = status === 'online' ? '#10b981' : status === 'standby' ? '#f59e0b' : '#ef4444';
  return (
    <div className="qd-service-row">
      <span className="qd-service-dot" style={{ background: dot }} />
      <span className="qd-service-name">{name}</span>
      <span className="qd-service-port">{port}</span>
      <span className="qd-service-latency">
        {latency !== null ? `${latency}ms` : status}
      </span>
    </div>
  );
}

function AgentRow({ agent, emoji, msgs, tasks, avgTps, status, color, rank, maxMsgs }) {
  const bar = Math.round((msgs / maxMsgs) * 100);
  return (
    <motion.div
      className="qd-agent-row"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.04 }}
    >
      <span className="qd-agent-rank">#{rank + 1}</span>
      <span className="qd-agent-emoji">{emoji}</span>
      <span className="qd-agent-name" style={{ color }}>{agent}</span>
      <div className="qd-agent-bar-wrap">
        <motion.div
          className="qd-agent-bar"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${bar}%` }}
          transition={{ delay: rank * 0.04 + 0.2, duration: 0.6 }}
        />
      </div>
      <span className="qd-agent-msgs">{msgs.toLocaleString()}</span>
      <span className="qd-agent-tasks">{tasks}</span>
      <span className="qd-agent-ms">{avgTps.toFixed(2)}</span>
      <span className={`qd-agent-badge qd-badge-${status}`}>{status}</span>
    </motion.div>
  );
}

function TimelineItem({ item, idx }) {
  const Icon = typeIcons[item.type] || Activity;
  return (
    <motion.div
      className="qd-timeline-item"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
    >
      <span className="qd-tl-time">{item.time}</span>
      <div className="qd-tl-dot-wrap">
        <span className="qd-tl-dot" style={{ background: item.color }} />
        {idx < recentActivity.length - 1 && <span className="qd-tl-line" />}
      </div>
      <div className="qd-tl-body">
        <span className="qd-tl-agent" style={{ color: item.color }}>{item.emoji} {item.agent}</span>
        <Icon size={12} color="#555" className="qd-tl-icon" />
        <span className="qd-tl-action">{item.action}</span>
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="qd-tooltip">
      <p className="qd-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}{typeof p.value === 'number' && p.name?.includes('ms') ? '' : ''}</p>
      ))}
    </div>
  );
};

// ─── Main Dashboard ─────────────────────────────────────────────────────────

function QuantaDashboard() {
  const { isSignedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [time, setTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const refresh = () => {
    setIsRefreshing(true);
    setTimeout(() => { setIsRefreshing(false); setLastUpdate(new Date()); }, 900);
  };

  const totalMsgs  = 4620;
  const totalTasks = agentMetrics.reduce((s, a) => s + a.tasks, 0);
  const avgResp = (agentMetrics.reduce((s, a) => s + a.avgTps, 0) / agentMetrics.length).toFixed(2);
  const activeAgents = agentMetrics.filter(a => a.status === 'active').length;
  const maxMsgs = Math.max(...agentMetrics.map(a => a.msgs));

  if (!isSignedIn) {
    return (
      <div className="qd-root">
        <div className="qd-locked">
          <div className="qd-locked-icon">⏱️</div>
          <h2>Quanta — Data Intelligence</h2>
          <p>Authentication required to access mission control.</p>
          <p className="qd-locked-sub">Sign in to view team analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="qd-root">
      {/* Header */}
      <motion.header
        className="qd-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="qd-header-left">
          <span className="qd-header-emoji">⏱️</span>
          <div>
            <h1 className="qd-header-title">Quanta</h1>
            <p className="qd-header-role">Data Intelligence · Mission Control</p>
          </div>
        </div>
        <div className="qd-header-right">
          <div className="qd-clock">
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className="qd-clock-date">{time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <button className="qd-refresh-btn" onClick={refresh} title="Refresh data">
            <RefreshCw size={15} className={isRefreshing ? 'qd-spin' : ''} />
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </motion.header>

      {/* Live status bar */}
      <div className="qd-status-bar">
        <span className="qd-status-dot" />
        <span>LIVE</span>
        <span className="qd-status-sep">·</span>
        <span>Last updated {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        <span className="qd-status-sep">·</span>
        <span>{activeAgents} agents active</span>
        <span className="qd-status-sep">·</span>
        <span>{services.filter(s => s.status === 'online').length}/{services.length} services online</span>
      </div>

      {/* Tabs */}
      <div className="qd-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`qd-tab ${activeTab === tab ? 'qd-tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="qd-content"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="qd-tab-content">
              {/* KPI row */}
              <div className="qd-stat-grid">
                <StatCard icon={MessageSquare} label="Total Sessions" value={totalMsgs.toLocaleString()} sub="Across 15 tracked agents" color="#10b981" delay={0.0} />
                <StatCard icon={CheckCircle2} label="Turns (7d)" value={totalTasks.toLocaleString()} sub="Daily summary aggregate" color="#06b6d4" delay={0.05} />
                <StatCard icon={Clock} label="Avg TPS" value={avgResp} sub="7-day agent average" color="#a855f7" delay={0.1} />
                <StatCard icon={Users} label="Active Agents" value={`${activeAgents}/15`} sub="Seen on 2026-03-16" color="#f97316" delay={0.15} />
                <StatCard icon={TrendingUp} label="Peak Day" value="429 sessions" sub="2026-03-06" color="#eab308" delay={0.2} />
                <StatCard icon={Zap} label="Snapshot Uptime" value="611.6h" sub="Latest system snapshot" color="#22c55e" delay={0.25} />
              </div>

              {/* Two-column: Weekly activity + timeline */}
              <div className="qd-two-col">
                <div className="qd-panel">
                  <h3 className="qd-panel-title"><BarChart2 size={14} /> Daily Sessions</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={weeklyActivity} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2a2a" />
                      <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="Marty"  stackId="a" fill="#ef4444" radius={[0,0,0,0]} />
                      <Bar dataKey="Aria"   stackId="a" fill="#ec4899" />
                      <Bar dataKey="Renzo"  stackId="a" fill="#0ea5e9" />
                      <Bar dataKey="Reno" stackId="a" fill="#f43f5e" />
                      <Bar dataKey="Other"  stackId="a" fill="#374151" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="qd-panel">
                  <h3 className="qd-panel-title"><Activity size={14} /> Recent Activity</h3>
                  <div className="qd-timeline">
                    {recentActivity.slice(0, 7).map((item, idx) => (
                      <TimelineItem key={item.id} item={item} idx={idx} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── AGENTS ── */}
          {activeTab === 'agents' && (
            <div className="qd-tab-content">
              <div className="qd-panel qd-agents-panel">
                <div className="qd-agents-header-row">
                  <span className="qd-agents-col qd-col-rank">#</span>
                  <span className="qd-agents-col qd-col-name">Agent</span>
                  <span className="qd-agents-col qd-col-bar">Volume</span>
                  <span className="qd-agents-col qd-col-msgs">Sessions</span>
                  <span className="qd-agents-col qd-col-tasks">Turns</span>
                  <span className="qd-agents-col qd-col-ms">Avg TPS</span>
                  <span className="qd-agents-col qd-col-status">Status</span>
                </div>
                {agentMetrics.map((a, i) => (
                  <AgentRow key={a.agent} {...a} rank={i} maxMsgs={maxMsgs} />
                ))}
              </div>

              {/* Task distribution pie */}
              <div className="qd-two-col qd-mt">
                <div className="qd-panel">
                  <h3 className="qd-panel-title"><Target size={14} /> Session Distribution</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={taskDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {taskDistribution.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v} sessions`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="qd-panel">
                  <h3 className="qd-panel-title"><Activity size={14} /> Full Activity Feed</h3>
                  <div className="qd-timeline">
                    {recentActivity.map((item, idx) => (
                      <TimelineItem key={item.id} item={item} idx={idx} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── HEALTH ── */}
          {activeTab === 'health' && (
            <div className="qd-tab-content">
              <div className="qd-two-col">
                {/* System gauges */}
                <div className="qd-panel">
                  <h3 className="qd-panel-title"><Cpu size={14} /> System Resources</h3>
                  <div className="qd-gauges">
                    {Object.entries(systemHealth).map(([key, h]) => (
                      <GaugeBar key={key} label={h.label} value={h.value} unit={h.unit} color={h.color} warn={h.warn} />
                    ))}
                  </div>
                  <div className="qd-health-meta">
                    <span>Host: spark-5495</span>
                    <span>OS: Linux arm64</span>
                    <span>Snapshot: 2026-02-19 10:17 UTC</span>
                  </div>
                </div>

                {/* Service status */}
                <div className="qd-panel">
                  <h3 className="qd-panel-title"><Server size={14} /> Services</h3>
                  <div className="qd-services">
                    {services.map(s => <ServiceRow key={s.name} {...s} />)}
                  </div>
                  <div className="qd-service-legend">
                    <span><i className="qd-leg-dot" style={{ background: '#10b981' }} />online</span>
                    <span><i className="qd-leg-dot" style={{ background: '#f59e0b' }} />standby</span>
                    <span><i className="qd-leg-dot" style={{ background: '#ef4444' }} />offline</span>
                  </div>
                </div>
              </div>

              {/* Response time area chart */}
              <div className="qd-panel qd-mt">
                <h3 className="qd-panel-title"><TrendingUp size={14} /> Sessions and Turns (last 12d)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={responseTimeline} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="gradAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradP95" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2a2a" />
                    <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
                    <Area type="monotone" dataKey="sessions" name="sessions" stroke="#10b981" fill="url(#gradAvg)" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="turns" name="turns" stroke="#a855f7" fill="url(#gradP95)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── CHARTS ── */}
          {activeTab === 'charts' && (
            <div className="qd-tab-content">
              <div className="qd-two-col">
                <div className="qd-panel">
                  <h3 className="qd-panel-title"><BarChart2 size={14} /> Sessions by Agent (7d)</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={agentMetrics.slice(0, 8).map(a => ({ agent: a.agent, msgs: a.msgs, color: a.color }))}
                      layout="vertical"
                      margin={{ top: 4, right: 40, bottom: 0, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2a2a" horizontal={false} />
                      <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} />
                      <YAxis type="category" dataKey="agent" tick={{ fill: '#9ca3af', fontSize: 11 }} width={58} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="msgs" name="Messages" radius={[0,4,4,0]}>
                        {agentMetrics.slice(0, 8).map((a, idx) => (
                          <Cell key={idx} fill={a.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="qd-panel">
                  <h3 className="qd-panel-title"><Target size={14} /> Session Distribution</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={taskDistribution}
                        cx="50%" cy="45%"
                        innerRadius={55} outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {taskDistribution.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v, name) => [`${v} sessions`, name]} />
                      <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="qd-panel qd-mt">
                <h3 className="qd-panel-title"><TrendingUp size={14} /> Daily Session Volume (stacked)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={weeklyActivity} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <defs>
                      {[['Marty','#ef4444'],['Aria','#ec4899'],['Renzo','#0ea5e9'],['Reno','#f43f5e'],['Other','#374151']].map(([name, color]) => (
                        <linearGradient key={name} id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={color} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2a2a" />
                    <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
                    {[['Marty','#ef4444'],['Aria','#ec4899'],['Renzo','#0ea5e9'],['Reno','#f43f5e'],['Other','#374151']].map(([name, color]) => (
                      <Area key={name} type="monotone" dataKey={name} stackId="1" stroke={color} fill={`url(#grad-${name})`} strokeWidth={1.5} />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      <footer className="qd-footer">
        <span>⏱️ Quanta · Data Intelligence · kaiw.io</span>
        <span>spark-5495 · {time.toLocaleDateString()}</span>
      </footer>
    </div>
  );
}

export default QuantaDashboard;
