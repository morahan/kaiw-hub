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

// ─── Mock data ──────────────────────────────────────────────────────────────

const AGENT_COLOR = '#10b981'; // emerald / teal

const agentMetrics = [
  { agent: 'Marty',    emoji: '⚡', msgs: 1842, tasks: 213, avgMs: 1240, status: 'active',  color: '#ef4444' },
  { agent: 'Aria',     emoji: '🎵', msgs: 1287, tasks: 178, avgMs:  980, status: 'active',  color: '#ec4899' },
  { agent: 'Renzo',    emoji: '🔥', msgs:  924, tasks: 142, avgMs: 1100, status: 'active',  color: '#0ea5e9' },
  { agent: 'Badger',   emoji: '🦡', msgs:  763, tasks: 196, avgMs:  820, status: 'active',  color: '#f97316' },
  { agent: 'Kaia',     emoji: '🌊', msgs:  688, tasks: 134, avgMs:  760, status: 'active',  color: '#06b6d4' },
  { agent: 'Freq',     emoji: '🎧', msgs:  547, tasks:  89, avgMs:  640, status: 'active',  color: '#14b8a6' },
  { agent: 'Thea',     emoji: '🏛️', msgs:  421, tasks: 112, avgMs:  920, status: 'active',  color: '#a855f7' },
  { agent: 'Reno',     emoji: '🔬', msgs:  398, tasks:  97, avgMs: 1380, status: 'active',  color: '#f43f5e' },
  { agent: 'Maverick', emoji: '🚦', msgs:  312, tasks:  64, avgMs:  540, status: 'idle',    color: '#eab308' },
  { agent: 'Greta',    emoji: '💜', msgs:  287, tasks:  71, avgMs:  870, status: 'idle',    color: '#8b5cf6' },
  { agent: 'Quanta',   emoji: '⏱️', msgs:  244, tasks:  58, avgMs:  710, status: 'active',  color: '#10b981' },
];

const systemHealth = {
  cpu:    { value: 34, label: 'CPU',    unit: '%', icon: Cpu,      color: '#10b981', warn: 80 },
  memory: { value: 61, label: 'Memory', unit: '%', icon: HardDrive,color: '#06b6d4', warn: 85 },
  gpu:    { value: 78, label: 'GPU',    unit: '%', icon: Zap,      color: '#a855f7', warn: 90 },
  disk:   { value: 42, label: 'Disk',   unit: '%', icon: Database, color: '#f97316', warn: 90 },
  net:    { value: 12, label: 'Net I/O',unit: 'MB/s',icon: Wifi,   color: '#3b82f6', warn: 100 },
  uptime: { value: '18d 4h', label: 'Uptime', unit: '', icon: Server, color: '#22c55e', warn: null },
};

const services = [
  { name: 'Fish Speech TTS', status: 'online',  latency: 42,  port: 8090 },
  { name: 'Faster-Whisper',  status: 'online',  latency: 18,  port: 8095 },
  { name: 'Piper TTS',       status: 'online',  latency: 11,  port: 8091 },
  { name: 'OpenClaw Gateway',status: 'online',  latency: 5,   port: 4242 },
  { name: 'Vite Dev Server', status: 'online',  latency: 3,   port: 5174 },
  { name: 'ACE-Step Music',  status: 'standby', latency: null,port: 8099 },
  { name: 'Local MiniMax',   status: 'standby', latency: null,port: 8081 },
  { name: 'Local Qwen3.5',   status: 'offline', latency: null,port: 8082 },
];

// Last 7 days agent activity (messages per day, stacked by top agents)
const weeklyActivity = [
  { day: 'Mon', Marty: 280, Aria: 190, Renzo: 140, Badger: 110, Other: 220 },
  { day: 'Tue', Marty: 310, Aria: 210, Renzo: 165, Badger: 125, Other: 245 },
  { day: 'Wed', Marty: 260, Aria: 175, Renzo: 120, Badger: 100, Other: 195 },
  { day: 'Thu', Marty: 340, Aria: 225, Renzo: 180, Badger: 140, Other: 270 },
  { day: 'Fri', Marty: 295, Aria: 200, Renzo: 150, Badger: 115, Other: 230 },
  { day: 'Sat', Marty: 180, Aria: 140, Renzo: 90,  Badger:  80, Other: 160 },
  { day: 'Sun', Marty: 145, Aria: 115, Renzo: 70,  Badger:  60, Other: 130 },
];

// Response time trend (last 12 hours)
const responseTimeline = Array.from({ length: 12 }, (_, i) => ({
  hour: `${(new Date().getHours() - 11 + i + 24) % 24}:00`,
  avg:  Math.round(700 + Math.sin(i * 0.8) * 200 + Math.random() * 100),
  p95:  Math.round(1200 + Math.sin(i * 0.8) * 300 + Math.random() * 150),
}));

// Task distribution by agent type
const taskDistribution = [
  { name: 'Business',  value: 38, color: '#ef4444' },
  { name: 'Personal',  value: 22, color: '#ec4899' },
  { name: 'Dev/Infra', value: 19, color: '#f97316' },
  { name: 'Content',   value: 12, color: '#0ea5e9' },
  { name: 'Analysis',  value:  9, color: '#10b981' },
];

// Recent team activity timeline
const recentActivity = [
  { id: 1,  time: '14:38', agent: 'Marty',    emoji: '⚡', color: '#ef4444', action: 'Sent sprint2 dashboard status to Michael',         type: 'msg' },
  { id: 2,  time: '14:35', agent: 'Aria',     emoji: '🎵', color: '#ec4899', action: 'Spawned Quanta subagent for dashboard build',       type: 'task' },
  { id: 3,  time: '14:22', agent: 'Badger',   emoji: '🦡', color: '#f97316', action: 'Committed Freq Dashboard to kaiw-hub (sprint2)',    type: 'code' },
  { id: 4,  time: '14:15', agent: 'Renzo',    emoji: '🔥', color: '#0ea5e9', action: 'Generated 3 Workout Flow content drafts',           type: 'content' },
  { id: 5,  time: '14:08', agent: 'Freq',     emoji: '🎧', color: '#14b8a6', action: 'Processed voice batch: 8 agents, 24 clips',          type: 'audio' },
  { id: 6,  time: '13:55', agent: 'Thea',     emoji: '🏛️', color: '#a855f7', action: 'Completed brand audit for WF App v2.3',             type: 'review' },
  { id: 7,  time: '13:41', agent: 'Kaia',     emoji: '🌊', color: '#06b6d4', action: 'Scheduled 12 posts across Instagram + X',           type: 'content' },
  { id: 8,  time: '13:30', agent: 'Maverick', emoji: '🚦', color: '#eab308', action: 'Switched GPU model: MiniMax → Qwen3.5',             type: 'system' },
  { id: 9,  time: '13:18', agent: 'Reno',     emoji: '🔬', color: '#f43f5e', action: 'Research digest: 6 new insights filed',             type: 'research' },
  { id: 10, time: '13:05', agent: 'Greta',    emoji: '💜', color: '#8b5cf6', action: 'Weekly team health check complete — all green',      type: 'check' },
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
      <span className="qd-service-port">:{port}</span>
      <span className="qd-service-latency">
        {latency !== null ? `${latency}ms` : status}
      </span>
    </div>
  );
}

function AgentRow({ agent, emoji, msgs, tasks, avgMs, status, color, rank }) {
  const bar = Math.round((msgs / 1842) * 100);
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
      <span className="qd-agent-ms">{avgMs}ms</span>
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

  const totalMsgs  = agentMetrics.reduce((s, a) => s + a.msgs, 0);
  const totalTasks = agentMetrics.reduce((s, a) => s + a.tasks, 0);
  const avgResp    = Math.round(agentMetrics.reduce((s, a) => s + a.avgMs, 0) / agentMetrics.length);
  const activeAgents = agentMetrics.filter(a => a.status === 'active').length;

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
                <StatCard icon={MessageSquare} label="Messages (7d)" value={totalMsgs.toLocaleString()} sub="+12% vs last week" color="#10b981" delay={0.0} />
                <StatCard icon={CheckCircle2} label="Tasks Complete" value={totalTasks.toLocaleString()} sub="Across all agents" color="#06b6d4" delay={0.05} />
                <StatCard icon={Clock} label="Avg Response" value={`${avgResp}ms`} sub="Team average" color="#a855f7" delay={0.1} />
                <StatCard icon={Users} label="Active Agents" value={`${activeAgents}/${agentMetrics.length}`} sub="Online now" color="#f97316" delay={0.15} />
                <StatCard icon={TrendingUp} label="Peak Load" value="18:30" sub="Yesterday's peak" color="#eab308" delay={0.2} />
                <StatCard icon={Zap} label="Uptime" value="99.8%" sub="Last 30 days" color="#22c55e" delay={0.25} />
              </div>

              {/* Two-column: Weekly activity + timeline */}
              <div className="qd-two-col">
                <div className="qd-panel">
                  <h3 className="qd-panel-title"><BarChart2 size={14} /> Weekly Activity</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={weeklyActivity} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2a2a" />
                      <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="Marty"  stackId="a" fill="#ef4444" radius={[0,0,0,0]} />
                      <Bar dataKey="Aria"   stackId="a" fill="#ec4899" />
                      <Bar dataKey="Renzo"  stackId="a" fill="#0ea5e9" />
                      <Bar dataKey="Badger" stackId="a" fill="#f97316" />
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
                  <span className="qd-agents-col qd-col-msgs">Msgs</span>
                  <span className="qd-agents-col qd-col-tasks">Tasks</span>
                  <span className="qd-agents-col qd-col-ms">Avg Resp</span>
                  <span className="qd-agents-col qd-col-status">Status</span>
                </div>
                {agentMetrics.map((a, i) => (
                  <AgentRow key={a.agent} {...a} rank={i} />
                ))}
              </div>

              {/* Task distribution pie */}
              <div className="qd-two-col qd-mt">
                <div className="qd-panel">
                  <h3 className="qd-panel-title"><Target size={14} /> Task Distribution</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={taskDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {taskDistribution.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v} tasks`, '']} />
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
                    <span>DGX Spark</span>
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
                <h3 className="qd-panel-title"><TrendingUp size={14} /> Response Times (last 12h)</h3>
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
                    <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} unit="ms" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
                    <Area type="monotone" dataKey="avg" name="avg (ms)" stroke="#10b981" fill="url(#gradAvg)" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="p95" name="p95 (ms)" stroke="#a855f7" fill="url(#gradP95)" strokeWidth={2} dot={false} />
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
                  <h3 className="qd-panel-title"><BarChart2 size={14} /> Messages by Agent (7d)</h3>
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
                  <h3 className="qd-panel-title"><Target size={14} /> Task Distribution</h3>
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
                      <Tooltip formatter={(v, name) => [`${v} tasks`, name]} />
                      <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="qd-panel qd-mt">
                <h3 className="qd-panel-title"><TrendingUp size={14} /> Daily Message Volume (stacked)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={weeklyActivity} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <defs>
                      {[['Marty','#ef4444'],['Aria','#ec4899'],['Renzo','#0ea5e9'],['Badger','#f97316'],['Other','#374151']].map(([name, color]) => (
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
                    {[['Marty','#ef4444'],['Aria','#ec4899'],['Renzo','#0ea5e9'],['Badger','#f97316'],['Other','#374151']].map(([name, color]) => (
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
