import { useState, useEffect, useRef } from 'react';
import { useAuth, UserButton } from '@clerk/react';
import './css/badgerDashboard.css';

const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true';

// ── Data ──
const systemMetrics = [
  { label: 'ACTIVE', value: 34, unit: '', color: '#00ff41' },
  { label: 'TODO', value: 4, unit: '', color: '#3b82f6' },
  { label: 'BACKLOG', value: 73, unit: '', color: '#8b5cf6' },
  { label: 'DONE7D', value: 34, unit: '', color: '#f59e0b' },
];

const services = [
  { name: 'michael-voice-router', status: 'running', uptime: 'enabled', port: null },
  { name: 'task-sync.py', status: 'running', uptime: 'synced Mar 6', port: null },
  { name: 'activity-summary.py', status: 'running', uptime: 'verified', port: null },
  { name: 'heartbeat-cycle', status: 'running', uptime: 'cycle 40 idle', port: null },
  { name: 'linear-api', status: 'stopped', uptime: '401 auth', port: null },
  { name: 'onboarding', status: 'running', uptime: '2026-02-19', port: null },
  { name: 'dashboard-test', status: 'running', uptime: 'Mar 8 03:42Z', port: null },
];

const commandHistory = [
  { ts: '16:56:00', cmd: "sed -n '1,40p' memory/working-state.md", output: 'Heartbeat Cycle 40: IDLE — System Nominal\nLinear API: DOWN (401 auth)\nNo unfinished work from previous cycle', status: 'ok' },
  { ts: '18:15:00', cmd: "jq '.summary' memory/tasks-sync.json", output: '{\n  "in_progress": 34,\n  "todo": 4,\n  "backlog": 73,\n  "completed_7d": 34\n}', status: 'ok' },
  { ts: '14:46:00', cmd: "sed -n '1,22p' memory/2026-03-08-ALL-5-TASKS-COMPLETE.md", output: 'ALL 5 PRIORITY TASKS — COMPLETE\nFinal notification sent to Michael\nTotal runtime: 2 hours 11 minutes', status: 'ok' },
  { ts: '15:46:00', cmd: "rg 'Service:|Status:' EXP-1168-COMPLETION.md", output: 'Status: COMPLETE\nService: michael-voice-router.service (enabled, running)\n12/12 tests passing', status: 'ok' },
  { ts: '08:51:19', cmd: "cat .openclaw/workspace-state.json", output: '{\n  "version": 1,\n  "onboardingCompletedAt": "2026-02-19T08:51:19.027Z"\n}', status: 'ok' },
  { ts: '03:42:28', cmd: 'cat activity.log', output: '{\n  "agent_name": "badger",\n  "task_name": "dashboard-test",\n  "status": "started"\n}', status: 'ok' },
];

const activeProjects = [
  { id: 1, name: 'Voice Router', status: 'complete', progress: 100, emoji: '🎙️' },
  { id: 2, name: 'Model Health Checker', status: 'complete', progress: 100, emoji: '📡' },
  { id: 3, name: 'Commit Convention Hook', status: 'complete', progress: 100, emoji: '🪝' },
];

const recentDeploys = [
  { name: 'Auto-Routing Voice System', time: 'Mar 3 15:46', status: 'success' },
  { name: 'All 5 Priority Tasks', time: 'Mar 8 14:46', status: 'success' },
  { name: 'Security Headers Fix Package', time: 'Feb 12', status: 'success' },
  { name: 'dashboard-test', time: 'Mar 8 03:42Z', status: 'success' },
];

const systemInfo = {
  host: 'spark-5495',
  os: 'Linux arm64',
  model: '—',
  kernel: '—',
  arch: 'aarch64',
  cpu: 'NVIDIA Grace',
  gpu: 'Grace Hopper',
};

const quotes = [
  "Lead with the impact.",
  "Tools must pass the ls test before claiming completion.",
  "Security first. Verify on disk.",
];

function BadgerDashboard() {
  const { isSignedIn } = useAuth();
  const [time, setTime] = useState(new Date());
  const [glitch, setGlitch] = useState(false);
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const terminalRef = useRef(null);
  const [rainColumns] = useState(() =>
    Array.from({ length: 18 }).map((_, i) => ({
      left: `${(i / 18) * 100 + Math.random() * 3}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      chars: Array.from({ length: 20 }).map(() =>
        String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
      ),
    }))
  );

  const [metrics, setMetrics] = useState(systemMetrics);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const text = commandHistory.map(c => `[${c.ts}] $ ${c.cmd}\n${c.output}`).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClear = () => {
    // Visual feedback only - this is a display dashboard
  };

  if (!isSignedIn && !SKIP_AUTH) {
    return (
      <div className="badger-dashboard">
        <div className="terminal-locked">
          <div className="terminal-header-bar">
            <span className="terminal-dot red"></span>
            <span className="terminal-dot yellow"></span>
            <span className="terminal-dot green"></span>
            <span className="terminal-title">badger@spark:~$ _</span>
          </div>
          <div className="terminal-body">
            <p><span className="prompt">$</span> whoami</p>
            <p className="output">🦡 Badger — nocturnal dev agent</p>
            <p className="prompt-line"><span className="prompt">$</span> access_portal</p>
            <p className="error">⚠ Authentication required. Sign in to proceed.</p>
            <p className="cursor blink">_</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="badger-dashboard">
      {/* Matrix rain */}
      <div className="matrix-rain" aria-hidden="true">
        {rainColumns.map((col, i) => (
          <div
            key={i}
            className="rain-column"
            style={{ left: col.left, animationDelay: col.delay, animationDuration: col.duration }}
          >
            {col.chars.map((c, j) => <span key={j}>{c}</span>)}
          </div>
        ))}
      </div>

      {/* ── Header ── */}
      <header className="badger-header">
        <div className="header-left">
          <div className={`badger-icon ${glitch ? 'glitch' : ''}`}>🦡</div>
          <div className="header-title">
            <h1>BADGER</h1>
            <p className="tagline">// infrastructure &amp; devops command center · {systemInfo.host}</p>
          </div>
        </div>
        <div className="header-center">
          <div className="breadcrumb">
            <span className="bc-segment">kaiw.io</span>
            <span className="bc-sep">/</span>
            <span className="bc-segment">agents</span>
            <span className="bc-sep">/</span>
            <span className="bc-segment active">badger</span>
            <span className="bc-sep">/</span>
            <span className="bc-segment dim">ops</span>
          </div>
        </div>
        <div className="header-right">
          <div className="clock">
            <span className="time">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
            <span className="date">{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="uptime-badge">
            <span className="status-dot-live">●</span>
            <span>Cycle 40</span>
          </div>
          <UserButton afterSignOutUrl="/login" />
        </div>
      </header>

      {/* ── Main 3-column layout ── */}
      <div className="ops-layout">

        {/* ── LEFT SIDEBAR: System Metrics + Services ── */}
        <aside className="ops-sidebar-left">
          {/* System Metrics */}
          <div className="ops-card metrics-card">
            <h3>
              <span className="card-icon">📊</span>
              SYSTEM METRICS
            </h3>
            <div className="metrics-grid">
              {metrics.map(m => (
                <div key={m.label} className="metric-item">
                  <div className="metric-header">
                    <span className="metric-label">{m.label}</span>
                    <span className="metric-value" style={{ color: m.value > 80 ? '#ef4444' : m.color }}>{m.value}{m.unit}</span>
                  </div>
                  <div className="metric-bar-track">
                    <div
                      className="metric-bar-fill"
                      style={{
                        width: `${m.value}%`,
                        background: m.value > 80
                          ? 'linear-gradient(90deg, #ef4444, #ff6b6b)'
                          : `linear-gradient(90deg, ${m.color}88, ${m.color})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Host info */}
            <div className="host-info">
              <div className="host-row"><span>HOST</span><span>{systemInfo.host}</span></div>
              <div className="host-row"><span>KERNEL</span><span>{systemInfo.kernel}</span></div>
              <div className="host-row"><span>ARCH</span><span>{systemInfo.arch}</span></div>
              <div className="host-row"><span>CPU</span><span>{systemInfo.cpu}</span></div>
              <div className="host-row"><span>GPU</span><span>{systemInfo.gpu}</span></div>
            </div>
          </div>

          {/* Service Status */}
          <div className="ops-card services-card">
            <h3>
              <span className="card-icon">🔌</span>
              SERVICES
            </h3>
            <div className="services-list">
              {services.map(s => (
                <div key={s.name} className={`service-row ${s.status}`}>
                  <span className={`service-dot ${s.status}`}>●</span>
                  <span className="service-name">{s.name}</span>
                  <span className="service-uptime">{s.uptime}</span>
                  {s.port && <span className="service-port">:{s.port}</span>}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── CENTER: Terminal ── */}
        <div className="ops-terminal-area">
          <div className="terminal-window">
            <div className="terminal-header-bar">
              <div className="terminal-dots">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
              </div>
              <span className="terminal-title-text">badger@{systemInfo.host}:~/projects/kaiw-hub</span>
              <div className="terminal-controls">
                <button className="term-btn" onClick={handleCopy} title="Copy output">
                  {copied ? '✓ Copied' : '⧉ Copy'}
                </button>
                <button className="term-btn" onClick={handleClear} title="Clear terminal">
                  ⌧ Clear
                </button>
                <button className="term-btn restart" title="Restart services">
                  ↻ Restart
                </button>
              </div>
            </div>
            <div className="terminal-content" ref={terminalRef}>
              {/* Session start */}
              <div className="term-line system">
                <span className="term-ts">16:56:00</span>
                <span className="term-text">── session started · {systemInfo.host} · {systemInfo.os} ──</span>
              </div>
              <div className="term-line system">
                <span className="term-ts">16:56:01</span>
                <span className="term-text">9,974 tracked workspace files · 2 queued tests · 0 unfinished WIP</span>
              </div>
              <div className="term-spacer" />

              {/* Command history */}
              {commandHistory.slice().reverse().map((cmd, i) => (
                <div key={i} className="term-command-block">
                  <div className="term-line command">
                    <span className="term-ts">{cmd.ts}</span>
                    <span className="term-prompt">$</span>
                    <span className="term-cmd">{cmd.cmd}</span>
                  </div>
                  {cmd.output.split('\n').map((line, j) => (
                    <div key={j} className="term-line output">
                      <span className="term-ts"></span>
                      <span className="term-output-text">{line}</span>
                    </div>
                  ))}
                </div>
              ))}

              {/* Active cursor */}
              <div className="term-line command active-prompt">
                <span className="term-ts">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                <span className="term-prompt">$</span>
                <span className="term-cursor">▊</span>
              </div>
            </div>
          </div>

          {/* Terminal quote bar */}
          <div className="terminal-quote-bar">
            <span className="tq-prompt">$</span> echo &quot;{quote}&quot;
          </div>
        </div>

        {/* ── RIGHT SIDEBAR: Deploys + Projects ── */}
        <aside className="ops-sidebar-right">
          {/* Recent Deploys */}
          <div className="ops-card deploys-card">
            <h3>
              <span className="card-icon">🚀</span>
              RECENT DEPLOYS
            </h3>
            <div className="deploys-list">
              {recentDeploys.map((d, i) => (
                <div key={i} className="deploy-row">
                  <span className="deploy-status-dot success">●</span>
                  <div className="deploy-info">
                    <span className="deploy-name">{d.name}</span>
                    <span className="deploy-time">{d.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Builds */}
          <div className="ops-card builds-card">
            <h3>
              <span className="card-icon">🔥</span>
              TRACKED WORK
            </h3>
            <div className="builds-list">
              {activeProjects.map(p => (
                <div key={p.id} className="build-row">
                  <span className="build-emoji">{p.emoji}</span>
                  <div className="build-info">
                    <div className="build-name-row">
                      <span className="build-name">{p.name}</span>
                      <span className="build-pct">{p.progress}%</span>
                    </div>
                    <div className="build-progress-track">
                      <div className="build-progress-fill" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="ops-card actions-card">
            <h3>
              <span className="card-icon">⚡</span>
              QUICK ACTIONS
            </h3>
            <div className="actions-grid">
              <button className="action-btn"><span>🔄</span> Redeploy</button>
              <button className="action-btn"><span>📋</span> Logs</button>
              <button className="action-btn"><span>🔍</span> Scan</button>
              <button className="action-btn"><span>📡</span> Monitor</button>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Footer ── */}
      <footer className="badger-footer">
        <span>🦡 badger v2.0</span>
        <span className="sep">|</span>
        <span>model: {systemInfo.model}</span>
        <span className="sep">|</span>
        <span>{activeProjects.length} verified deliverables · {recentDeploys.length} logged releases</span>
        <span className="sep">|</span>
        <span className="status-dot-footer">●</span>
        <span>online</span>
      </footer>
    </div>
  );
}

export default BadgerDashboard;
