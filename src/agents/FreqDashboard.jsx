import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Mic, Volume2, MessageSquare, FolderOpen, RefreshCw, CheckCircle, XCircle, AlertTriangle, Zap, Server, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import './App.css';

// Agent voice configuration mapping
const AGENT_VOICES = {
  alan: { voice: 'alan', engine: 'fish', fallback: 'piper-alan', speed: 1.0, color: '#6366f1' },
  aria: { voice: 'cori', engine: 'fish', fallback: 'piper-cori', speed: 1.25, color: '#ec4899' },
  badger: { voice: 'badger', engine: 'fish', fallback: 'piper-ryan', speed: 1.0, color: '#f97316' },
  cori: { voice: 'cori', engine: 'fish', fallback: 'piper-cori', speed: 1.0, color: '#f43f5e' },
  freq: { voice: 'ryan', engine: 'fish', fallback: 'piper-ryan', speed: 0.95, color: '#14b8a6' },
  greta: { voice: 'greta', engine: 'fish', fallback: 'piper-cori', speed: 1.1, color: '#8b5cf6' },
  kaia: { voice: 'kaia', engine: 'fish', fallback: 'piper-amy', speed: 1.1, color: '#06b6d4' },
  lj: { voice: 'lj', engine: 'fish', fallback: 'piper-lj', speed: 1.0, color: '#84cc16' },
  marty: { voice: 'ryan', engine: 'fish', fallback: 'piper-ryan', speed: 1.0, color: '#ef4444' },
  maverick: { voice: 'maverick', engine: 'fish', fallback: 'piper-alan', speed: 1.0, color: '#eab308' },
  michael: { voice: 'michael', engine: 'fish', fallback: 'piper-ryan', speed: 1.0, color: '#3b82f6' },
  quanta: { voice: 'quanta', engine: 'fish', fallback: 'piper-amy', speed: 1.0, color: '#10b981' },
  reno: { voice: 'reno', engine: 'fish', fallback: 'piper-ryan', speed: 1.0, color: '#f43f5e' },
  renzo: { voice: 'renzo', engine: 'fish', fallback: 'piper-alan', speed: 1.1, color: '#0ea5e9' },
  rocio: { voice: 'rocio', engine: 'fish', fallback: 'piper-cori', speed: 1.0, color: '#d946ef' },
  ryan: { voice: 'ryan', engine: 'fish', fallback: 'piper-ryan', speed: 1.0, color: '#22c55e' },
  thea: { voice: 'thea', engine: 'fish', fallback: 'piper-amy', speed: 1.15, color: '#a855f7' }
};

// Software/projects being evaluated
const SOFTWARE_PROJECTS = [
  { name: 'Fish Speech 1.5', type: 'TTS', status: 'production', notes: 'Voice cloning, GPU' },
  { name: 'Piper TTS', type: 'TTS', status: 'fallback', notes: 'Fast, local' },
  { name: 'Demucs 4.0', type: 'Isolation', status: 'production', notes: 'Voice isolation' },
  { name: 'ACE-Step 1.5', type: 'Music', status: 'production', notes: 'Music generation' },
  { name: 'Faster-Whisper', type: 'STT', status: 'production', notes: 'Speech-to-text' },
  { name: 'Chatterbox-Turbo', type: 'Cloning', status: 'eval', notes: 'Michael voice cloning' },
  { name: 'Coqui TTS', type: 'TTS', status: 'eval', notes: 'Open source alternative' },
  { name: 'RVC', type: 'Voice', status: 'eval', notes: 'Real-time voice conversion' }
];

// Helper to run shell commands via API
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
    piper: 'checking',
    demucs: 'checking',
    aceStep: 'checking',
    whisper: 'checking'
  });
  const [agentVoices, setAgentVoices] = useState([]);
  const [messageStats, setMessageStats] = useState({ sent: 0, received: 0, today: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check system health
  const checkHealth = async () => {
    setIsRefreshing(true);
    
    // Check Fish Speech
    let fishSpeech = 'offline';
    try {
      const res = await fetch('http://localhost:8090/', { signal: AbortSignal.timeout(3000) });
      if (res.ok) fishSpeech = 'online';
    } catch { fishSpeech = 'offline'; }
    
    // Check Piper 
    let piper = 'offline';
    try {
      const res = await fetch('/api/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'which piper' })
      });
      const data = await res.json();
      if (data.output && data.output.trim()) piper = 'online';
    } catch {}
    
    // Check Demucs script
    let demucs = 'offline';
    try {
      const res = await fetch('/api/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'ls ~/clawd/scripts/demucs-isolate.sh 2>/dev/null' })
      });
      const data = await res.json();
      if (data.output && data.output.trim()) demucs = 'ready';
    } catch {}
    
    // Check ACE-Step (running process)
    let aceStep = 'offline';
    try {
      const res = await fetch('/api/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'pgrep -f "acestep" | head -1' })
      });
      const data = await res.json();
      if (data.output && data.output.trim()) aceStep = 'online';
    } catch {}
    
    // Check Whisper
    let whisper = 'offline';
    try {
      const res = await fetch('/api/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'pgrep -f "whisper" | head -1' })
      });
      const data = await res.json();
      if (data.output && data.output.trim()) whisper = 'online';
    } catch {}
    
    setSystemHealth({ fishSpeech, piper, demucs, aceStep, whisper });
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  // Get agent voice data
  const loadAgentVoices = async () => {
    const agents = [];
    const voiceDirs = await execCommand('ls -d ~/.openclaw/fish-refs/*/ 2>/dev/null | xargs -n1 basename');
    const dirs = voiceDirs.trim().split('\n').filter(d => d && !d.includes('.') && d !== 'test-agent');
    
    for (const agent of dirs) {
      const config = AGENT_VOICES[agent] || { voice: 'unknown', engine: 'fish', fallback: 'piper-ryan', speed: 1.0, color: '#6b7280' };
      
      // Get ref duration
      let duration = 0;
      let refExists = false;
      try {
        const result = await execCommand(`ffprobe -v error -show_entries format=duration -of csv=p=0 ~/.openclaw/fish-refs/${agent}/audio.wav 2>/dev/null`);
        duration = parseFloat(result) || 0;
        refExists = duration > 0;
      } catch {}
      
      agents.push({
        name: agent,
        ...config,
        refDuration: duration,
        refExists,
        status: refExists && duration >= 10 ? 'healthy' : duration > 0 ? 'degraded' : 'missing'
      });
    }
    
    setAgentVoices(agents.sort((a, b) => a.name.localeCompare(b.name)));
  };

  // Load message stats
  const loadMessageStats = async () => {
    const outbound = await execCommand('ls ~/.openclaw/media/outbound/ 2>/dev/null | wc -l');
    const sent = parseInt(outbound) || 0;
    
    // Estimate received (inbound media)
    let received = 0;
    try {
      const inbound = await execCommand('ls ~/.openclaw/media/inbound/ 2>/dev/null | wc -l');
      received = parseInt(inbound) || 0;
    } catch {}
    
    setMessageStats({ sent, received, today: Math.floor(sent / 10) });
  };

  // Initial load
  useEffect(() => {
    checkHealth();
    loadAgentVoices();
    loadMessageStats();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      checkHealth();
      loadAgentVoices();
      loadMessageStats();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      online: 'bg-emerald-500',
      production: 'bg-emerald-500',
      healthy: 'bg-emerald-500',
      checking: 'bg-yellow-500',
      offline: 'bg-red-500',
      missing: 'bg-red-500',
      degraded: 'bg-yellow-500',
      fallback: 'bg-blue-500',
      eval: 'bg-purple-500',
      ready: 'bg-cyan-500'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${colors[status] || 'bg-gray-500'}`}>
        {status}
      </span>
    );
  };

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        activeTab === id 
          ? 'bg-teal-500 text-white' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="emoji">🎛️</span>
          <div>
            <h1>Freq Audio Operations</h1>
            <p>Real-time audio system monitoring</p>
          </div>
        </div>
        <div className="header-right">
          <button 
            onClick={() => { checkHealth(); loadAgentVoices(); loadMessageStats(); }}
            disabled={isRefreshing}
            className="refresh-btn"
          >
            <RefreshCw size={18} className={isRefreshing ? 'spinning' : ''} />
            {formatTime(lastUpdate)}
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <TabButton id="overview" icon={Activity} label="Overview" />
        <TabButton id="voices" icon={Mic} label="Agent Voices" />
        <TabButton id="systems" icon={Server} label="Systems" />
        <TabButton id="software" icon={FolderOpen} label="Software" />
        <TabButton id="messages" icon={MessageSquare} label="Messages" />
      </nav>

      {/* Content */}
      <main className="content">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overview-grid">
            {/* System Health Cards */}
            <div className="card">
              <h3><Activity size={18} /> System Health</h3>
              <div className="health-grid">
                {Object.entries(systemHealth).map(([service, status]) => (
                  <div key={service} className="health-item">
                    <span className="health-name">{service}</span>
                    <StatusBadge status={status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3><Volume2 size={18} /> Quick Stats</h3>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-value">{agentVoices.length}</span>
                  <span className="stat-label">Agents</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{agentVoices.filter(a => a.status === 'healthy').length}</span>
                  <span className="stat-label">Healthy Voices</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{messageStats.sent}</span>
                  <span className="stat-label">Audio Sent</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{SOFTWARE_PROJECTS.filter(p => p.status === 'production').length}</span>
                  <span className="stat-label">Production</span>
                </div>
              </div>
            </div>

            {/* Recent Activity placeholder */}
            <div className="card full-width">
              <h3><Zap size={18} /> Active Services</h3>
              <div className="services-list">
                {Object.entries(systemHealth).map(([service, status]) => (
                  <div key={service} className="service-row">
                    <div className="service-info">
                      {status === 'online' || status === 'production' || status === 'healthy' || status === 'ready' ? 
                        <CheckCircle size={16} className="text-emerald-500" /> : 
                        <XCircle size={16} className="text-red-500" />
                      }
                      <span>{service}</span>
                    </div>
                    <StatusBadge status={status} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'voices' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="card">
              <h3><Mic size={18} /> Agent Voice Status</h3>
              <div className="voices-table">
                <div className="table-header">
                  <span>Agent</span>
                  <span>Voice</span>
                  <span>Engine</span>
                  <span>Fallback</span>
                  <span>Speed</span>
                  <span>Ref Duration</span>
                  <span>Status</span>
                </div>
                {agentVoices.map(agent => (
                  <div key={agent.name} className="table-row">
                    <span style={{ color: agent.color, fontWeight: 600 }}>{agent.name}</span>
                    <span>{agent.voice}</span>
                    <StatusBadge status={agent.engine} />
                    <span className="text-gray-400">{agent.fallback}</span>
                    <span>{agent.speed}x</span>
                    <span>{agent.refDuration.toFixed(1)}s</span>
                    <StatusBadge status={agent.status} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'systems' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="systems-grid">
            {Object.entries(systemHealth).map(([service, status]) => (
              <div key={service} className="card">
                <h3>{service}</h3>
                <div className="system-status">
                  {status === 'online' || status === 'production' || status === 'ready' ? 
                    <CheckCircle size={48} className="text-emerald-500" /> : 
                    <XCircle size={48} className="text-red-500" />
                  }
                  <StatusBadge status={status} />
                </div>
                <p className="system-desc">
                  {service === 'fishSpeech' && 'Voice cloning TTS engine on port 8090'}
                  {service === 'piper' && 'Fast local TTS fallback'}
                  {service === 'demucs' && 'Voice isolation script ready'}
                  {service === 'aceStep' && 'AI music generation'}
                  {service === 'whisper' && 'Speech-to-text engine'}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'software' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="card">
              <h3><FolderOpen size={18} /> Software & Projects</h3>
              <div className="software-grid">
                {SOFTWARE_PROJECTS.map(project => (
                  <div key={project.name} className="software-card">
                    <div className="software-header">
                      <span className="software-name">{project.name}</span>
                      <StatusBadge status={project.status} />
                    </div>
                    <span className="software-type">{project.type}</span>
                    <p className="software-notes">{project.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overview-grid">
            <div className="card">
              <h3><MessageSquare size={18} /> Message Statistics</h3>
              <div className="stats-grid large">
                <div className="stat">
                  <span className="stat-value">{messageStats.sent}</span>
                  <span className="stat-label">Audio Messages Sent</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{messageStats.received}</span>
                  <span className="stat-label">Media Received</span>
                </div>
              </div>
            </div>
            <div className="card full-width">
              <h3>Message Volume</h3>
              <div className="volume-chart">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { name: 'Mon', value: 12 },
                    { name: 'Tue', value: 19 },
                    { name: 'Wed', value: 15 },
                    { name: 'Thu', value: 22 },
                    { name: 'Fri', value: 18 },
                    { name: 'Sat', value: 8 },
                    { name: 'Sun', value: 5 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                    <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;
