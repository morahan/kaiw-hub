import { useState, useEffect } from 'react';
import { useAuth, UserButton } from '@clerk/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import {
  Cpu, MemoryStick, Activity, Zap, Server, RefreshCw,
  CheckCircle, AlertTriangle, XCircle, Clock, ChevronRight, Gauge
} from 'lucide-react';
import './css/maverickDashboard.css';

// ── Real workspace data — DGX Spark scheduler + latency snapshots ───────────
const SYSTEM_INFO = {
  host: 'spark-5495',
  os: 'Linux 6.14.0-1013-nvidia (arm64)',
  gpu: 'NVIDIA Grace Blackwell',
  totalRAM: 128,
  totalVRAM: 128,
  arch: 'aarch64',
};

const RESOURCE_SNAPSHOT = {
  gpu: 19,
  vram: 24,
  cpu: null,
  ram: null,
  temp: null,
  power: null,
};

const MODELS = [
  {
    id: 'deepseek-r1-70b',
    name: 'ollama/deepseek-r1:70b',
    port: 'sched',
    vram: 42,
    status: 'active',
    tokens: 'priority 1',
    tag: 'Scheduled now for thea',
  },
  {
    id: 'qwen3-32b',
    name: 'ollama/qwen3:32b',
    port: 'queue',
    vram: 40,
    status: 'running',
    tokens: '2 queued tasks',
    tag: 'Scheduled twice for renzo',
  },
  {
    id: 'llama4-16x17b',
    name: 'ollama/llama4:16x17b',
    port: 'preload',
    vram: 67,
    status: 'warning',
    tokens: 'candidate',
    tag: 'Preload candidate for kaia',
  },
];

const PROCESSES = [
  { id: 1, name: 'renzo', emoji: '🔥', role: 'ollama/qwen3:32b', queue: 'now · p1', urgency: 12.5, vram: 20, status: 'active', pid: '—' },
  { id: 2, name: 'thea', emoji: '🏛️', role: 'ollama/deepseek-r1:70b', queue: 'now · p1', urgency: 11.0, vram: 42, status: 'active', pid: '—' },
  { id: 3, name: 'renzo', emoji: '🔥', role: 'ollama/qwen3:32b', queue: 'now · p2', urgency: 10.0, vram: 20, status: 'running', pid: '—' },
  { id: 4, name: 'quanta', emoji: '⚛️', role: 'ollama/llama3.1:8b', queue: 'now · p3', urgency: 2.0, vram: 5, status: 'running', pid: '—' },
  { id: 5, name: 'kaia', emoji: '🌊', role: 'ollama/llama4:16x17b', queue: 'waiting · p2', urgency: 5.0, vram: 67, status: 'warning', pid: '—' },
  { id: 6, name: 'kaia', emoji: '🌊', role: 'manual override', queue: '17:00-19:00', urgency: 0.75, vram: 67, status: 'idle', pid: '—' },
  { id: 7, name: 'thea', emoji: '🏛️', role: 'manual override', queue: '19:00-21:00', urgency: 0.75, vram: 42, status: 'idle', pid: '—' },
];

const ALLOCATION_DATA = PROCESSES.map(p => ({
  name: p.name,
  urgency: p.urgency,
  vram: p.vram,
  fill: p.status === 'active' || p.status === 'running' ? '#f97316' : p.status === 'warning' ? '#eab308' : '#4b5563',
}));

const PIE_DATA = [
  { name: 'Scheduled Now', value: 4, color: '#f97316' },
  { name: 'Waiting', value: 1, color: '#eab308' },
  { name: 'Manual Overrides', value: 2, color: '#3b82f6' },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function TrafficLight({ status }) {
  const colors = {
    active:  '#22c55e',
    running: '#22c55e',
    idle:    '#3b82f6',
    standby: '#3b82f6',
    preload: '#3b82f6',
    stopped: '#ef4444',
    offline: '#ef4444',
    error:   '#ef4444',
    warning: '#f59e0b',
  };
  const col = colors[status] || '#6b7280';
  return (
    <span className="mv-traffic-light" style={{ color: col, fontSize: '0.6rem' }}>
      {'\u25CF'}
    </span>
  );
}

function GaugeBar({ label, value, max, unit = '%', color, icon: Icon, warn = 70, crit = 90 }) {
  const hasValue = typeof value === 'number';
  const pct = hasValue ? Math.min((value / max) * 100, 100) : 0;
  const barColor = !hasValue ? '#4b5563' : pct >= crit ? '#ef4444' : pct >= warn ? '#f59e0b' : color || '#22c55e';
  const pctLabel = hasValue ? `${Math.round(pct)}% ${label}` : `No data for ${label}`;
  return (
    <div className="mv-gauge">
      <div className="mv-gauge-header">
        {Icon && <Icon size={14} />}
        <span className="mv-gauge-label">{label}</span>
        <span className="mv-gauge-val" style={{ color: barColor }}>
          {hasValue ? `${value}${unit}` : '—'}
        </span>
      </div>
      <div className="mv-gauge-track">
        <motion.div
          className="mv-gauge-fill"
          style={{ background: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <span className="mv-gauge-pct-label">{pctLabel}</span>
      </div>
    </div>
  );
}

function ModelCard({ model, onSwitch }) {
  const isActive = model.status === 'active' || model.status === 'running';
  return (
    <motion.div
      className={`mv-model-card ${isActive ? 'mv-model-active' : 'mv-model-standby'}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="mv-model-top">
        <div className="mv-model-indicator">
          <TrafficLight status={model.status} />
          <span className="mv-model-name">{model.name}</span>
        </div>
        <span className={`mv-model-badge ${isActive ? 'badge-active' : 'badge-standby'}`}>
          {isActive ? 'ACTIVE' : 'STANDBY'}
        </span>
      </div>
      <div className="mv-model-meta">
        <span>:{model.port}</span>
        <span>{model.vram}GB VRAM</span>
        <span>{model.tokens}</span>
      </div>
      <div className="mv-model-tag">{model.tag}</div>
      {!isActive && onSwitch && (
        <button className="mv-model-switch" onClick={() => onSwitch(model.id)}>
          <RefreshCw size={12} /> Switch to this model
        </button>
      )}
    </motion.div>
  );
}

function ProcessRow({ proc }) {
  return (
    <motion.div
      className={`mv-proc-row mv-proc-${proc.status}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mv-proc-name">
        <TrafficLight status={proc.status} />
        <span className="mv-proc-emoji">{proc.emoji}</span>
        <span className="mv-proc-label">{proc.name}</span>
      </div>
      <span className="mv-proc-role">{proc.role}</span>
      <span className="mv-proc-pid">{proc.queue}</span>
      <span className="mv-proc-cpu">{proc.urgency} urgency</span>
      <span className="mv-proc-mem">{proc.vram}GB</span>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="mv-tooltip">
        <p>{payload[0]?.payload?.name}</p>
        <p>Urgency: {payload[0]?.value}</p>
        <p>VRAM: {payload[1]?.value}GB</p>
      </div>
    );
  }
  return null;
};

// ── Main dashboard ───────────────────────────────────────────────────────────

export default function MaverickDashboard() {
  const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true';
  const { isSignedIn: clerkSignedIn } = useAuth();
  const isSignedIn = SKIP_AUTH || clerkSignedIn;
  const [now, setNow] = useState(new Date());
  const [resources] = useState(RESOURCE_SNAPSHOT);
  const [tab, setTab] = useState('overview');

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const models = MODELS;

  // ── Auth gate ────────────────────────────────────────────────────────────
  if (!isSignedIn) {
    return (
      <div className="mv-dashboard">
        <div className="mv-locked">
          <div className="mv-locked-icon">🚦</div>
          <h2>Resource Control — Restricted</h2>
          <p>Authentication required to access Maverick's control panel.</p>
          <a href="/sign-in" className="mv-sign-in-btn">Sign in to continue</a>
        </div>
      </div>
    );
  }

  const activeCount = 4;
  const idleCount = 1;

  return (
    <div className="mv-dashboard">
      {/* ── HEADER ── */}
      <header className="mv-header">
        <div className="mv-header-left">
          <motion.span
            className="mv-hero-emoji"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >🚦</motion.span>
          <div>
            <h1 className="mv-title">Maverick</h1>
            <p className="mv-subtitle">Resource Gatekeeper · DGX Spark</p>
          </div>
        </div>
        <div className="mv-header-right">
          <div className="mv-sys-info">
            <span className="mv-sys-host">{SYSTEM_INFO.host}</span>
            <span className="mv-sys-os">{SYSTEM_INFO.os}</span>
          </div>
          <div className="mv-clock">
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <UserButton />
        </div>
      </header>

      {/* ── STATUS BAR ── */}
      <div className="mv-status-bar">
        <div className="mv-status-pill green">
          <CheckCircle size={12} /> {activeCount} agents active
        </div>
        <div className="mv-status-pill blue">
          <Clock size={12} /> {idleCount} idle
        </div>
        <div className={`mv-status-pill ${resources.gpu > 90 ? 'red' : resources.gpu > 70 ? 'yellow' : 'green'}`}>
          <Gauge size={12} /> GPU {Math.round(resources.gpu)}%
        </div>
        <div className="mv-status-pill yellow">
          <Activity size={12} /> p95 latency 13.39ms
        </div>
        <div className="mv-status-pill orange">
          <Zap size={12} /> 2 overrides enabled
        </div>
      </div>

      {/* ── TABS ── */}
      <nav className="mv-tabs">
        {['overview', 'processes', 'models', 'allocation'].map(t => (
          <button
            key={t}
            className={`mv-tab ${tab === t ? 'mv-tab-active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'overview'    && <Server size={14} />}
            {t === 'processes'   && <Activity size={14} />}
            {t === 'models'      && <MemoryStick size={14} />}
            {t === 'allocation'  && <Cpu size={14} />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      {/* ── CONTENT ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          className="mv-content"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >

          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div className="mv-overview">
              {/* Resource gauges */}
              <section className="mv-card mv-gauges-card">
                <div className="mv-card-header">
                  <Gauge size={16} />
                  <h2>System Resources</h2>
                  <span className="mv-card-meta">{SYSTEM_INFO.gpu}</span>
                </div>
                <div className="mv-gauges-grid">
                  <GaugeBar
                    label="GPU"
                    value={Math.round(resources.gpu)}
                    max={100}
                    unit="%"
                    color="#22c55e"
                    icon={Cpu}
                    warn={70} crit={90}
                  />
                  <GaugeBar
                    label="VRAM"
                    value={Math.round(resources.vram)}
                    max={128}
                    unit="GB"
                    color="#22c55e"
                    icon={MemoryStick}
                    warn={90} crit={115}
                  />
                  <GaugeBar
                    label="CPU"
                    value={resources.cpu}
                    max={100}
                    unit="%"
                    color="#22c55e"
                    icon={Activity}
                    warn={65} crit={85}
                  />
                  <GaugeBar
                    label="RAM"
                    value={resources.ram}
                    max={128}
                    unit="GB"
                    color="#22c55e"
                    icon={Server}
                    warn={90} crit={115}
                  />
                </div>
                <div className="mv-resource-stats">
                  <div className="mv-res-stat">
                    <span>VRAM Used</span>
                    <strong>{Math.round(resources.vram)} / 128 GB</strong>
                  </div>
                  <div className="mv-res-stat">
                    <span>RAM Used</span>
                    <strong>—</strong>
                  </div>
                  <div className="mv-res-stat">
                    <span>Latency Mean</span>
                    <strong>3.24 ms</strong>
                  </div>
                  <div className="mv-res-stat">
                    <span>Error Samples</span>
                    <strong>10 / 10</strong>
                  </div>
                </div>
              </section>

              {/* Quick model status */}
              <section className="mv-card mv-quick-models">
                <div className="mv-card-header">
                  <MemoryStick size={16} />
                  <h2>Active Model</h2>
                  <button className="mv-card-link" onClick={() => setTab('models')}>
                    All models <ChevronRight size={12} />
                  </button>
                </div>
                <div className="mv-model-quick-grid">
                  {models.map(m => (
                    <ModelCard key={m.id} model={m} />
                  ))}
                </div>
              </section>

              {/* Quick process count */}
              <section className="mv-card mv-quick-procs">
                <div className="mv-card-header">
                  <Activity size={16} />
                  <h2>Agent Fleet</h2>
                  <button className="mv-card-link" onClick={() => setTab('processes')}>
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                <div className="mv-fleet-stats">
                  <div className="mv-fleet-stat green">
                    <strong>{activeCount}</strong>
                    <span>Active</span>
                  </div>
                  <div className="mv-fleet-stat blue">
                    <strong>{idleCount}</strong>
                    <span>Idle</span>
                  </div>
                  <div className="mv-fleet-stat gray">
                    <strong>{PROCESSES.length}</strong>
                    <span>Total</span>
                  </div>
                </div>
                <div className="mv-proc-mini-list">
                  {PROCESSES.filter(p => p.status === 'active' || p.status === 'running').slice(0, 5).map(p => (
                    <div key={p.id} className="mv-proc-mini">
                      <TrafficLight status={p.status} />
                      <span>{p.emoji} {p.name}</span>
                      <span className="mv-proc-mini-cpu">{p.vram}GB</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* PROCESSES TAB */}
          {tab === 'processes' && (
            <section className="mv-card mv-processes-card">
              <div className="mv-card-header">
                <Activity size={16} />
                <h2>Running Agents & Services</h2>
                <span className="mv-card-meta">{PROCESSES.length} total</span>
              </div>
              <div className="mv-proc-table-header">
                <span>Agent</span>
                <span>Model</span>
                <span>Queue Slot</span>
                <span>Urgency</span>
                <span>VRAM</span>
              </div>
              <div className="mv-proc-list">
                {PROCESSES.map(p => (
                  <ProcessRow key={p.id} proc={p} />
                ))}
              </div>
            </section>
          )}

          {/* MODELS TAB */}
          {tab === 'models' && (
            <section className="mv-card mv-models-card">
              <div className="mv-card-header">
                <MemoryStick size={16} />
                <h2>GPU Model Status</h2>
                <span className="mv-card-meta">1 active at a time</span>
              </div>
              <div className="mv-models-note">
                <AlertTriangle size={14} />
                `queue-scheduler-status.json` shows 4 tasks scheduled now, 1 waiting task, and a 67GB preload candidate for kaia.
              </div>
              <div className="mv-models-grid">
                {models.map(m => (
                  <ModelCard key={m.id} model={m} />
                ))}
              </div>
              <div className="mv-vram-breakdown">
                <h3>VRAM Snapshot</h3>
                <div className="mv-vram-bar-wrap">
                  <div
                    className="mv-vram-segment orange"
                    style={{ width: `${(24/128)*100}%` }}
                    title="Currently reserved — 24GB"
                  >
                    <span className="mv-vram-seg-label">19% used</span>
                  </div>
                  <div
                    className="mv-vram-segment blue"
                    style={{ width: `${(104/128)*100}%` }}
                    title="Available — 104GB"
                  >
                    <span className="mv-vram-seg-label">81% free</span>
                  </div>
                </div>
                <div className="mv-vram-legend">
                  <span><span className="dot orange" /> Reserved now (24GB)</span>
                  <span><span className="dot blue" /> Available (104GB)</span>
                  <span><span className="dot gray" /> Peak scheduled demand (87GB)</span>
                  <span><span className="dot dark" /> Waiting demand (67GB)</span>
                </div>
              </div>
            </section>
          )}

          {/* ALLOCATION TAB */}
          {tab === 'allocation' && (
            <div className="mv-alloc-grid">
              <section className="mv-card mv-bar-chart-card">
                <div className="mv-card-header">
                  <Cpu size={16} />
                  <h2>Urgency by Agent</h2>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ALLOCATION_DATA} margin={{ top: 8, right: 16, left: -10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#9ca3af', fontSize: 11 }}
                      angle={-40}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="urgency" radius={[4, 4, 0, 0]}>
                      {ALLOCATION_DATA.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </section>

              <section className="mv-card mv-pie-card">
                <div className="mv-card-header">
                  <MemoryStick size={16} />
                  <h2>Queue Composition</h2>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {PIE_DATA.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => `${v} items`}
                      contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#fff' }}
                    />
                    <Legend
                      formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </section>

              <section className="mv-card mv-mem-chart-card">
                <div className="mv-card-header">
                  <Server size={16} />
                  <h2>VRAM Requested by Agent</h2>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ALLOCATION_DATA} margin={{ top: 8, right: 16, left: -10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#9ca3af', fontSize: 11 }}
                      angle={-40}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="vram" radius={[4, 4, 0, 0]}>
                      {ALLOCATION_DATA.map((entry, index) => (
                        <Cell key={index} fill={entry.fill === '#f97316' ? '#3b82f6' : '#374151'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </section>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      <footer className="mv-footer">
        <span>🚦 Maverick · Resource Gatekeeper · {SYSTEM_INFO.host}</span>
        <span>Scheduler snapshot 2026-03-08 · latency sample size 10</span>
      </footer>
    </div>
  );
}
