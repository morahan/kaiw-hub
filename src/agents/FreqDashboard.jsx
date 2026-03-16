import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Mic, Volume2, MessageSquare, FolderOpen, RefreshCw, CheckCircle, XCircle, Server, Music, Radio, Cpu, FileAudio, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import './css/freqDashboard.css';

// Agent voice configuration — live data
const AGENT_VOICES = {
  alan:     { voice: 'alan',     engine: 'fish', fallback: 'piper-alan', speed: 1.0,  color: '#6366f1' },
  aria:     { voice: 'cori',     engine: 'fish', fallback: 'piper-cori', speed: 1.25, color: '#ec4899' },
  badger:   { voice: 'badger',   engine: 'fish', fallback: 'piper-ryan', speed: 1.0,  color: '#f97316' },
  cori:     { voice: 'cori',     engine: 'fish', fallback: 'piper-cori', speed: 1.0,  color: '#f43f5e' },
  freq:     { voice: 'ryan',     engine: 'fish', fallback: 'piper-ryan', speed: 0.95, color: '#14b8a6' },
  greta:    { voice: 'greta',    engine: 'fish', fallback: 'piper-cori', speed: 1.1,  color: '#8b5cf6' },
  kaia:     { voice: 'kaia',     engine: 'fish', fallback: 'piper-amy',  speed: 1.1,  color: '#06b6d4' },
  lj:       { voice: 'lj',       engine: 'fish', fallback: 'piper-lj',   speed: 1.0,  color: '#84cc16' },
  marty:    { voice: 'ryan',     engine: 'fish', fallback: 'piper-ryan', speed: 1.0,  color: '#ef4444' },
  maverick: { voice: 'maverick', engine: 'fish', fallback: 'piper-alan', speed: 1.0,  color: '#eab308' },
  michael:  { voice: 'michael',  engine: 'fish', fallback: 'piper-ryan', speed: 1.0,  color: '#3b82f6' },
  quanta:   { voice: 'quanta',   engine: 'fish', fallback: 'piper-amy',  speed: 1.0,  color: '#10b981' },
  reno:     { voice: 'reno',     engine: 'fish', fallback: 'piper-ryan', speed: 1.0,  color: '#f43f5e' },
  renzo:    { voice: 'renzo',    engine: 'fish', fallback: 'piper-alan', speed: 1.1,  color: '#0ea5e9' },
  rocio:    { voice: 'rocio',    engine: 'fish', fallback: 'piper-cori', speed: 1.0,  color: '#d946ef' },
  ryan:     { voice: 'ryan',     engine: 'fish', fallback: 'piper-ryan', speed: 1.0,  color: '#22c55e' },
  thea:     { voice: 'thea',     engine: 'fish', fallback: 'piper-amy',  speed: 1.15, color: '#a855f7' }
};

// Software stack — production + eval
const SOFTWARE_STACK = [
  { name: 'Fish Speech 1.5',   type: 'TTS',       status: 'production', notes: 'Voice cloning, GPU, port 8090',     icon: '🐟' },
  { name: 'Piper TTS',         type: 'TTS',       status: 'fallback',   notes: 'Fast local fallback, CPU',          icon: '⚡' },
  { name: 'Faster-Whisper',    type: 'STT',       status: 'production', notes: 'Speech-to-text, local',             icon: '👂' },
  { name: 'Demucs 4.0',        type: 'Isolation', status: 'production', notes: 'Source separation & voice isolate', icon: '🎛️' },
  { name: 'ACE-Step 1.5',      type: 'Music',     status: 'production', notes: 'AI music generation',               icon: '🎵' },
  { name: 'Chatterbox-Turbo',  type: 'Cloning',   status: 'eval',       notes: 'Michael voice cloning (Docker)',    icon: '🎭' },
  { name: 'Coqui TTS',         type: 'TTS',       status: 'eval',       notes: 'Open-source TTS alternative',       icon: '🐸' },
  { name: 'RVC',               type: 'Voice',     status: 'eval',       notes: 'Real-time voice conversion',        icon: '🔄' },
];

// Audio pipeline stages
const PIPELINE_STAGES = [
  { id: 'ingest',   label: 'Ingest',     desc: 'Audio/text in',        icon: '📥', color: '#6366f1' },
  { id: 'stt',      label: 'STT',        desc: 'Faster-Whisper',       icon: '👂', color: '#06b6d4' },
  { id: 'process',  label: 'Process',    desc: 'Demucs / isolation',   icon: '🎛️', color: '#f97316' },
  { id: 'tts',      label: 'TTS',        desc: 'Fish Speech / Piper',  icon: '🔊', color: '#14b8a6' },
  { id: 'deliver',  label: 'Deliver',    desc: 'OGG → Telegram',       icon: '📤', color: '#22c55e' },
];

// Readable service names
const SERVICE_LABELS = {
  fishSpeech: 'Fish Speech TTS',
  piper:      'Piper TTS',
  demucs:     'Demucs',
  aceStep:    'ACE-Step Music',
  whisper:    'Faster-Whisper',
};

const SERVICE_ICONS = {
  fishSpeech: '🐟',
  piper:      '⚡',
  demucs:     '🎛️',
  aceStep:    '🎵',
  whisper:    '👂',
};

// Helper: API exec
const execCommand = async (cmd) => {
  try {
    const res = await fetch('/api/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: cmd })
    });
    const data = await res.json();
    return data.output || '';
  } catch {
    return '';
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [systemHealth, setSystemHealth] = useState({
    fishSpeech: 'checking',
    piper:      'checking',
    demucs:     'checking',
    aceStep:    'checking',
    whisper:    'checking'
  });
  const [agentVoices, setAgentVoices] = useState([]);
  const [mediaCounts, setMediaCounts] = useState({ outbound: 0, inbound: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check system health
  const checkHealth = async () => {
    setIsRefreshing(true);

    // Fish Speech — check port 8090
    let fishSpeech = 'offline';
    try {
      const res = await fetch('http://localhost:8090/', { signal: AbortSignal.timeout(3000) });
      if (res.ok || res.status < 500) fishSpeech = 'online';
    } catch { fishSpeech = 'offline'; }

    // Piper — check binary
    const piperOut = await execCommand('which piper 2>/dev/null || ls ~/clawd/venvs/tts/bin/piper 2>/dev/null | head -1');
    const piper = piperOut.trim() ? 'online' : 'offline';

    // Demucs — check script
    const demucsOut = await execCommand('ls ~/clawd/scripts/demucs-isolate.sh 2>/dev/null');
    const demucs = demucsOut.trim() ? 'ready' : 'offline';

    // ACE-Step — check process
    const aceOut = await execCommand('pgrep -f "acestep" | head -1');
    const aceStep = aceOut.trim() ? 'online' : 'offline';

    // Whisper — check process or venv
    const whisperOut = await execCommand('pgrep -f "whisper" | head -1 || ls ~/clawd/venvs/whisper/bin/python 2>/dev/null | head -1');
    const whisper = whisperOut.trim() ? 'online' : 'offline';

    setSystemHealth({ fishSpeech, piper, demucs, aceStep, whisper });
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  // Load agent voice ref data
  const loadAgentVoices = async () => {
    const dirsOut = await execCommand('ls -d ~/.openclaw/fish-refs/*/ 2>/dev/null | xargs -n1 basename 2>/dev/null');
    const dirs = dirsOut.trim().split('\n').filter(d => d && !d.includes('.') && d !== 'test-agent' && d !== 'health.db');

    const agents = await Promise.all(dirs.map(async (agent) => {
      const config = AGENT_VOICES[agent] || { voice: 'unknown', engine: 'fish', fallback: 'piper-ryan', speed: 1.0, color: '#6b7280' };

      const result = await execCommand(
        `ffprobe -v error -show_entries format=duration -of csv=p=0 ~/.openclaw/fish-refs/${agent}/audio.wav 2>/dev/null`
      );
      const duration = parseFloat(result) || 0;
      const refExists = duration > 0;
      const status = refExists && duration >= 10 ? 'healthy' : duration > 0 ? 'degraded' : 'missing';

      return { name: agent, ...config, refDuration: duration, refExists, status };
    }));

    setAgentVoices(agents.sort((a, b) => a.name.localeCompare(b.name)));
  };

  // Load media file counts
  const loadMediaCounts = async () => {
    const outRaw = await execCommand('ls ~/.openclaw/media/outbound/ 2>/dev/null | wc -l');
    const inRaw  = await execCommand('ls ~/.openclaw/media/inbound/  2>/dev/null | wc -l');
    setMediaCounts({
      outbound: parseInt(outRaw) || 0,
      inbound:  parseInt(inRaw)  || 0,
    });
  };

  const refresh = () => {
    checkHealth();
    loadAgentVoices();
    loadMediaCounts();
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // ── Sub-components ──────────────────────────────────────────

  const StatusDot = ({ status }) => {
    const cls = {
      online: 'dot-green', production: 'dot-green', healthy: 'dot-green', ready: 'dot-cyan',
      checking: 'dot-yellow', degraded: 'dot-yellow', fallback: 'dot-blue', eval: 'dot-purple',
      offline: 'dot-red', missing: 'dot-red',
    }[status] || 'dot-gray';
    return <span className={`status-dot ${cls}`} />;
  };

  const StatusBadge = ({ status }) => {
    const cls = {
      online: 'badge-green', production: 'badge-green', healthy: 'badge-green', ready: 'badge-cyan',
      checking: 'badge-yellow', degraded: 'badge-yellow', fallback: 'badge-blue', eval: 'badge-purple',
      fish: 'badge-teal', offline: 'badge-red', missing: 'badge-red',
    }[status] || 'badge-gray';
    return <span className={`status-badge ${cls}`}>{status}</span>;
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`tab-btn ${activeTab === id ? 'tab-active' : ''}`}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );

  // Derived stats
  const healthyVoices = agentVoices.filter(a => a.status === 'healthy').length;
  const missingVoices = agentVoices.filter(a => a.status === 'missing').length;
  const degradedVoices = agentVoices.filter(a => a.status === 'degraded').length;
  const productionTools = SOFTWARE_STACK.filter(s => s.status === 'production').length;
  const healthyServices = Object.values(systemHealth).filter(s => ['online','ready','production'].includes(s)).length;

  // Voice status distribution for mini bar chart
  const voiceChartData = [
    { label: 'Healthy', count: healthyVoices, fill: '#10b981' },
    { label: 'Degraded', count: degradedVoices, fill: '#f59e0b' },
    { label: 'Missing', count: missingVoices, fill: '#ef4444' },
  ];

  // ── Render ───────────────────────────────────────────────────

  return (
    <div className="freq-dashboard">
      {/* Header */}
      <header className="freq-header">
        <div className="header-identity">
          <div className="freq-avatar">🎛️</div>
          <div className="header-text">
            <h1>Freq</h1>
            <p>Audio Operations · Voice Cloning · TTS/STT Pipeline</p>
          </div>
        </div>
        <div className="header-right">
          <div className="health-summary">
            <span className="hs-label">Services</span>
            <span className="hs-value">{healthyServices}/{Object.keys(systemHealth).length}</span>
          </div>
          <div className="health-summary">
            <span className="hs-label">Voices</span>
            <span className="hs-value">{healthyVoices}/{agentVoices.length}</span>
          </div>
          <button onClick={refresh} disabled={isRefreshing} className="freq-refresh-btn">
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            <span>{formatTime(lastUpdate)}</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="freq-nav">
        <TabButton id="overview"  label="Overview"       icon={Activity}      />
        <TabButton id="pipeline"  label="Pipeline"       icon={Layers}        />
        <TabButton id="voices"    label="Agent Voices"   icon={Mic}           />
        <TabButton id="systems"   label="Systems"        icon={Server}        />
        <TabButton id="software"  label="Software Stack" icon={FolderOpen}    />
      </nav>

      {/* Content */}
      <main className="freq-content">

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overview-layout">

            {/* Service health column */}
            <div className="freq-card">
              <div className="card-title"><Server size={16} />Service Health</div>
              <div className="service-list">
                {Object.entries(systemHealth).map(([key, status]) => (
                  <div key={key} className="service-row">
                    <span className="service-icon">{SERVICE_ICONS[key]}</span>
                    <span className="service-name">{SERVICE_LABELS[key] || key}</span>
                    <StatusDot status={status} />
                    <StatusBadge status={status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Stats column */}
            <div className="stats-column">
              <div className="freq-card stat-card">
                <div className="stat-big">
                  <span className="stat-num" style={{ color: '#10b981' }}>{healthyVoices}</span>
                  <span className="stat-of">/ {agentVoices.length}</span>
                </div>
                <span className="stat-lbl">Voices Healthy</span>
              </div>
              <div className="freq-card stat-card">
                <span className="stat-num" style={{ color: '#14b8a6' }}>{mediaCounts.outbound}</span>
                <span className="stat-lbl">Audio Files Sent</span>
              </div>
              <div className="freq-card stat-card">
                <span className="stat-num" style={{ color: '#6366f1' }}>{mediaCounts.inbound}</span>
                <span className="stat-lbl">Media Received</span>
              </div>
              <div className="freq-card stat-card">
                <span className="stat-num" style={{ color: '#f97316' }}>{productionTools}</span>
                <span className="stat-lbl">Tools in Production</span>
              </div>
            </div>

            {/* Voice distribution mini chart */}
            <div className="freq-card chart-card">
              <div className="card-title"><Mic size={16} />Voice Ref Status</div>
              {agentVoices.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={voiceChartData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" vertical={false} />
                    <XAxis dataKey="label" stroke="#606070" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#606070" tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 8 }}
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {voiceChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">Loading voice data…</div>
              )}
              <div className="chart-legend">
                {voiceChartData.map(d => (
                  <span key={d.label} className="legend-item">
                    <span className="legend-dot" style={{ background: d.fill }} />
                    {d.label}: {d.count}
                  </span>
                ))}
              </div>
            </div>

            {/* Freq identity card */}
            <div className="freq-card identity-card">
              <div className="card-title"><Radio size={16} />Freq · Audio Ops</div>
              <div className="identity-body">
                <div className="identity-row"><span>Domain</span><span>Audio Engineering</span></div>
                <div className="identity-row"><span>Primary TTS</span><span>Fish Speech 1.5 (GPU)</span></div>
                <div className="identity-row"><span>Fallback TTS</span><span>Piper (CPU)</span></div>
                <div className="identity-row"><span>STT</span><span>Faster-Whisper</span></div>
                <div className="identity-row"><span>Voice Style</span><span>ryan @ 0.95×</span></div>
                <div className="identity-row"><span>Output Format</span><span>OGG Opus → Telegram</span></div>
                <div className="identity-row"><span>Agents Served</span><span>{Object.keys(AGENT_VOICES).length} agents</span></div>
              </div>
            </div>

          </motion.div>
        )}

        {/* ── PIPELINE ── */}
        {activeTab === 'pipeline' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="freq-card">
              <div className="card-title"><Layers size={16} />Audio Pipeline</div>
              <div className="pipeline-flow">
                {PIPELINE_STAGES.map((stage, i) => (
                  <div key={stage.id} className="pipeline-item">
                    <div className="pipeline-stage" style={{ borderColor: stage.color }}>
                      <span className="pipeline-emoji">{stage.icon}</span>
                      <span className="pipeline-label" style={{ color: stage.color }}>{stage.label}</span>
                      <span className="pipeline-desc">{stage.desc}</span>
                    </div>
                    {i < PIPELINE_STAGES.length - 1 && <span className="pipeline-arrow">→</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="two-col">
              <div className="freq-card">
                <div className="card-title"><FileAudio size={16} />Media Stats</div>
                <div className="media-stats">
                  <div className="media-row">
                    <span>📤 Audio Sent</span>
                    <span className="media-count" style={{ color: '#14b8a6' }}>{mediaCounts.outbound}</span>
                  </div>
                  <div className="media-row">
                    <span>📥 Media Received</span>
                    <span className="media-count" style={{ color: '#6366f1' }}>{mediaCounts.inbound}</span>
                  </div>
                  <div className="media-row">
                    <span>🎙️ Voice Refs Loaded</span>
                    <span className="media-count" style={{ color: '#10b981' }}>{agentVoices.length}</span>
                  </div>
                  <div className="media-row">
                    <span>⚠️ Refs Degraded/Missing</span>
                    <span className="media-count" style={{ color: '#f59e0b' }}>{degradedVoices + missingVoices}</span>
                  </div>
                </div>
              </div>

              <div className="freq-card">
                <div className="card-title"><Cpu size={16} />Runtime Notes</div>
                <div className="runtime-notes">
                  <div className="note-item">
                    <span className="note-dot" style={{ background: '#14b8a6' }} />
                    Fish Speech runs on GPU via Docker or local service on :8090
                  </div>
                  <div className="note-item">
                    <span className="note-dot" style={{ background: '#6366f1' }} />
                    Piper is always available as CPU fallback — no GPU required
                  </div>
                  <div className="note-item">
                    <span className="note-dot" style={{ background: '#f97316' }} />
                    Voice refs are stored in ~/.openclaw/fish-refs/&lt;agent&gt;/audio.wav
                  </div>
                  <div className="note-item">
                    <span className="note-dot" style={{ background: '#10b981' }} />
                    narrate.py auto-routes Fish→Piper based on GPU availability
                  </div>
                  <div className="note-item">
                    <span className="note-dot" style={{ background: '#ec4899' }} />
                    Demucs isolate script: ~/clawd/scripts/demucs-isolate.sh
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── VOICES ── */}
        {activeTab === 'voices' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="freq-card">
              <div className="card-title"><Mic size={16} />Agent Voice Registry — {agentVoices.length} agents</div>
              <div className="voices-table">
                <div className="vt-header">
                  <span>Agent</span>
                  <span>Voice ID</span>
                  <span>Engine</span>
                  <span>Fallback</span>
                  <span>Speed</span>
                  <span>Ref (s)</span>
                  <span>Status</span>
                </div>
                {agentVoices.map(agent => (
                  <div key={agent.name} className="vt-row">
                    <span className="vt-agent">
                      <span className="vt-dot" style={{ background: agent.color }} />
                      {agent.name}
                    </span>
                    <span className="vt-mono">{agent.voice}</span>
                    <StatusBadge status={agent.engine} />
                    <span className="vt-muted">{agent.fallback}</span>
                    <span className="vt-mono">{agent.speed}×</span>
                    <span className={`vt-mono ${agent.refDuration > 0 ? '' : 'vt-dim'}`}>
                      {agent.refDuration > 0 ? agent.refDuration.toFixed(1) : '—'}
                    </span>
                    <StatusBadge status={agent.status} />
                  </div>
                ))}
                {agentVoices.length === 0 && (
                  <div className="empty-state">Loading agent voice data…</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── SYSTEMS ── */}
        {activeTab === 'systems' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="systems-grid">
            {Object.entries(systemHealth).map(([key, status]) => {
              const isUp = ['online','ready','production'].includes(status);
              return (
                <div key={key} className={`freq-card system-card ${isUp ? 'sys-up' : 'sys-down'}`}>
                  <div className="sys-icon">{SERVICE_ICONS[key]}</div>
                  <div className="sys-name">{SERVICE_LABELS[key] || key}</div>
                  <div className="sys-status-row">
                    {isUp
                      ? <CheckCircle size={28} className="icon-green" />
                      : <XCircle size={28} className="icon-red" />
                    }
                    <StatusBadge status={status} />
                  </div>
                  <p className="sys-desc">
                    {key === 'fishSpeech' && 'Voice cloning TTS · GPU · port 8090'}
                    {key === 'piper'      && 'Fast local TTS fallback · CPU · no GPU needed'}
                    {key === 'demucs'     && 'Source separation & voice isolation script'}
                    {key === 'aceStep'    && 'AI music generation · ACE-Step 1.5'}
                    {key === 'whisper'    && 'Speech-to-text · Faster-Whisper (local)'}
                  </p>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ── SOFTWARE STACK ── */}
        {activeTab === 'software' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="freq-card">
              <div className="card-title"><FolderOpen size={16} />Software Stack — {SOFTWARE_STACK.filter(s => s.status === 'production').length} production · {SOFTWARE_STACK.filter(s => s.status === 'eval').length} eval</div>
              <div className="software-grid">
                {SOFTWARE_STACK.map(proj => (
                  <div key={proj.name} className={`software-card sw-${proj.status}`}>
                    <div className="sw-top">
                      <span className="sw-emoji">{proj.icon}</span>
                      <div>
                        <div className="sw-name">{proj.name}</div>
                        <div className="sw-type">{proj.type}</div>
                      </div>
                      <StatusBadge status={proj.status} />
                    </div>
                    <p className="sw-notes">{proj.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}

export default App;
