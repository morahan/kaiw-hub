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

// ── Mock data — DGX Spark (spark-5495) ──────────────────────────────────────
const SYSTEM_INFO = {
  host: 'spark-5495',
  os: 'Linux 6.14.0-1013-nvidia (arm64)',
  gpu: 'NVIDIA Grace Blackwell',
  totalRAM: 128,
  totalVRAM: 128, // unified memory
  arch: 'aarch64',
};

const MOCK_RESOURCES = {
  gpu: 74,        // %
  vram: 89,       // GB used of 128
  cpu: 42,        // %
  ram: 61,        // GB used of 128
  temp: 68,       // °C
  power: 340,     // W
};

const MODELS = [
  {
    id: 'minimax',
    name: 'MiniMax M2.5',
    port: 8081,
    vram: 81,
    status: 'active',
    tokens: '128K ctx',
    tag: 'Reasoning · Research',
  },
  {
    id: 'qwen',
    name: 'Qwen3.5-35B-A3B',
    port: 8082,
    vram: 34,
    status: 'standby',
    tokens: '32K ctx',
    tag: 'Coding · Agents',
  },
];

const PROCESSES = [
  { id: 1,  name: 'aria',     emoji: '🎵', role: 'Personal Assistant',   cpu: 2.1,  mem: 4.2,  status: 'active',   pid: 18520 },
  { id: 2,  name: 'marty',    emoji: '⚡', role: 'Business Director',     cpu: 3.4,  mem: 5.8,  status: 'active',   pid: 18521 },
  { id: 3,  name: 'renzo',    emoji: '🔥', role: 'Content Creator',       cpu: 1.8,  mem: 3.1,  status: 'active',   pid: 18522 },
  { id: 4,  name: 'kaia',     emoji: '🌊', role: 'Community Manager',     cpu: 0.9,  mem: 2.4,  status: 'idle',     pid: 18523 },
  { id: 5,  name: 'thea',     emoji: '🏛️', role: 'Systems Architect',     cpu: 1.2,  mem: 2.9,  status: 'active',   pid: 18524 },
  { id: 6,  name: 'badger',   emoji: '🦡', role: 'Dev Engineer',          cpu: 4.7,  mem: 6.3,  status: 'active',   pid: 18525 },
  { id: 7,  name: 'maverick', emoji: '🚦', role: 'Resource Gatekeeper',   cpu: 0.8,  mem: 1.9,  status: 'active',   pid: 18526 },
  { id: 8,  name: 'freq',     emoji: '🎧', role: 'Audio Engineer',        cpu: 5.2,  mem: 7.1,  status: 'active',   pid: 18527 },
  { id: 9,  name: 'greta',    emoji: '📊', role: 'Data Analyst',          cpu: 2.3,  mem: 3.8,  status: 'idle',     pid: 18528 },
  { id: 10, name: 'reno',     emoji: '🏗️', role: 'Infrastructure',        cpu: 1.5,  mem: 2.7,  status: 'active',   pid: 18529 },
  { id: 11, name: 'quanta',   emoji: '⚛️', role: 'Research',              cpu: 0.4,  mem: 1.6,  status: 'idle',     pid: 18530 },
  { id: 12, name: 'buddy',    emoji: '🐶', role: 'Companion',             cpu: 0.3,  mem: 1.2,  status: 'idle',     pid: 18531 },
];

const ALLOCATION_DATA = PROCESSES.map(p => ({
  name: p.name,
  cpu: p.cpu,
  mem: p.mem,
  fill: p.status === 'active' ? '#f97316' : '#4b5563',
}));

const PIE_DATA = [
  { name: 'MiniMax M2.5', value: 81, color: '#f97316' },
  { name: 'Agent Pool',   value: 22, color: '#3b82f6' },
  { name: 'OS/System',    value: 8,  color: '#6b7280' },
  { name: 'Available',    value: 17, color: '#1f2937' },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function TrafficLight({ status }) {
  return (
    <span className={`mv-traffic-light mv-tl-${status}`}>
      {status === 'active'  && '🟢'}
      {status === 'idle'    && '🟡'}
      {status === 'standby' && '🟡'}
      {status === 'offline' && '🔴'}
      {status === 'error'   && '🔴'}
    </span>
  );
}

function GaugeBar({ label, value, max, unit = '%', color, icon: Icon, warn = 70, crit = 90 }) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor = pct >= crit ? '#ef4444' : pct >= warn ? '#f59e0b' : color || '#22c55e';
  return (
    <div className="mv-gauge">
      <div className="mv-gauge-header">
        {Icon && <Icon size={14} />}
        <span className="mv-gauge-label">{label}</span>
        <span className="mv-gauge-val" style={{ color: barColor }}>
          {value}{unit}
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
      </div>
    </div>
  );
}

function ModelCard({ model, onSwitch }) {
  const isActive = model.status === 'active';
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
      {!isActive && (
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
      <span className="mv-proc-pid">PID {proc.pid}</span>
      <span className="mv-proc-cpu">{proc.cpu}% CPU</span>
      <span className="mv-proc-mem">{proc.mem}GB</span>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="mv-tooltip">
        <p>{payload[0]?.payload?.name}</p>
        <p>CPU: {payload[0]?.value}%</p>
        <p>Mem: {payload[1]?.value}GB</p>
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
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [activeModel, setActiveModel] = useState('minimax');
  const [switching, setSwitching] = useState(false);
  const [tab, setTab] = useState('overview');

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate live resource fluctuation
  useEffect(() => {
    const t = setInterval(() => {
      setResources(prev => ({
        gpu:   Math.max(10, Math.min(98, prev.gpu   + (Math.random() - 0.48) * 4)),
        vram:  Math.max(20, Math.min(126, prev.vram + (Math.random() - 0.5)  * 1)),
        cpu:   Math.max(5,  Math.min(95, prev.cpu   + (Math.random() - 0.48) * 3)),
        ram:   Math.max(20, Math.min(120, prev.ram  + (Math.random() - 0.5)  * 0.5)),
        temp:  Math.max(45, Math.min(85, prev.temp  + (Math.random() - 0.5)  * 1)),
        power: Math.max(200, Math.min(450, prev.power + (Math.random() - 0.5) * 10)),
      }));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const handleModelSwitch = (modelId) => {
    setSwitching(true);
    setTimeout(() => {
      setActiveModel(modelId);
      setSwitching(false);
    }, 1500);
  };

  const models = MODELS.map(m => ({
    ...m,
    status: m.id === activeModel ? 'active' : 'standby',
  }));

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

  const activeCount = PROCESSES.filter(p => p.status === 'active').length;
  const idleCount   = PROCESSES.filter(p => p.status === 'idle').length;

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
        <div className="mv-status-pill yellow">
          <Clock size={12} /> {idleCount} idle
        </div>
        <div className={`mv-status-pill ${resources.gpu > 90 ? 'red' : resources.gpu > 70 ? 'yellow' : 'green'}`}>
          <Gauge size={12} /> GPU {Math.round(resources.gpu)}%
        </div>
        <div className={`mv-status-pill ${resources.temp > 75 ? 'red' : resources.temp > 65 ? 'yellow' : 'green'}`}>
          <Activity size={12} /> {Math.round(resources.temp)}°C
        </div>
        <div className="mv-status-pill orange">
          <Zap size={12} /> {Math.round(resources.power)}W
        </div>
        {switching && (
          <motion.div
            className="mv-status-pill orange"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <RefreshCw size={12} /> Switching model…
          </motion.div>
        )}
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
                    value={Math.round(resources.cpu)}
                    max={100}
                    unit="%"
                    color="#22c55e"
                    icon={Activity}
                    warn={65} crit={85}
                  />
                  <GaugeBar
                    label="RAM"
                    value={Math.round(resources.ram)}
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
                    <strong>{Math.round(resources.ram)} / 128 GB</strong>
                  </div>
                  <div className="mv-res-stat">
                    <span>Temperature</span>
                    <strong style={{ color: resources.temp > 75 ? '#ef4444' : resources.temp > 65 ? '#f59e0b' : '#22c55e' }}>
                      {Math.round(resources.temp)}°C
                    </strong>
                  </div>
                  <div className="mv-res-stat">
                    <span>Power Draw</span>
                    <strong>{Math.round(resources.power)}W</strong>
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
                    <ModelCard key={m.id} model={m} onSwitch={handleModelSwitch} />
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
                  <div className="mv-fleet-stat yellow">
                    <strong>{idleCount}</strong>
                    <span>Idle</span>
                  </div>
                  <div className="mv-fleet-stat gray">
                    <strong>{PROCESSES.length}</strong>
                    <span>Total</span>
                  </div>
                </div>
                <div className="mv-proc-mini-list">
                  {PROCESSES.filter(p => p.status === 'active').slice(0, 5).map(p => (
                    <div key={p.id} className="mv-proc-mini">
                      <TrafficLight status={p.status} />
                      <span>{p.emoji} {p.name}</span>
                      <span className="mv-proc-mini-cpu">{p.cpu}%</span>
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
                <span>Role</span>
                <span>PID</span>
                <span>CPU</span>
                <span>Memory</span>
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
                Only one model can run at a time due to VRAM constraints (128GB unified). Switching takes ~30–60s.
              </div>
              <div className="mv-models-grid">
                {models.map(m => (
                  <ModelCard key={m.id} model={m} onSwitch={handleModelSwitch} />
                ))}
              </div>
              <div className="mv-vram-breakdown">
                <h3>VRAM Allocation</h3>
                <div className="mv-vram-bar-wrap">
                  <div
                    className="mv-vram-segment orange"
                    style={{ width: `${(81/128)*100}%` }}
                    title="MiniMax M2.5 — 81GB"
                  />
                  <div
                    className="mv-vram-segment blue"
                    style={{ width: `${(22/128)*100}%` }}
                    title="Agent pool — 22GB"
                  />
                  <div
                    className="mv-vram-segment gray"
                    style={{ width: `${(8/128)*100}%` }}
                    title="System — 8GB"
                  />
                </div>
                <div className="mv-vram-legend">
                  <span><span className="dot orange" /> MiniMax M2.5 (81GB)</span>
                  <span><span className="dot blue" /> Agent Pool (22GB)</span>
                  <span><span className="dot gray" /> System (8GB)</span>
                  <span><span className="dot dark" /> Available (17GB)</span>
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
                  <h2>CPU Usage by Agent</h2>
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
                    <Bar dataKey="cpu" radius={[4, 4, 0, 0]}>
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
                  <h2>VRAM Distribution</h2>
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
                      formatter={(v) => `${v}GB`}
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
                  <h2>Memory Usage by Agent</h2>
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
                    <Bar dataKey="mem" radius={[4, 4, 0, 0]}>
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
        <span>Live · Updates every 2.5s</span>
      </footer>
    </div>
  );
}
