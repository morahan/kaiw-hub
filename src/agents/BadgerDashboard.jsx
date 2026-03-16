import { useState, useEffect, useRef } from 'react';
import { useAuth, UserButton } from '@clerk/react';
import './css/badgerDashboard.css';

const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true';

// ── Data ──
const systemMetrics = [
  { label: 'CPU', value: 23, unit: '%', color: '#00ff41' },
  { label: 'MEM', value: 61, unit: '%', color: '#3b82f6' },
  { label: 'GPU', value: 34, unit: '%', color: '#8b5cf6' },
  { label: 'DISK', value: 47, unit: '%', color: '#f59e0b' },
];

const services = [
  { name: 'nginx', status: 'running', uptime: '14d 7h', port: 443 },
  { name: 'postgres', status: 'running', uptime: '14d 7h', port: 5432 },
  { name: 'redis', status: 'running', uptime: '6d 22h', port: 6379 },
  { name: 'vite-dev', status: 'running', uptime: '2h 14m', port: 5174 },
  { name: 'docker', status: 'running', uptime: '14d 7h', port: null },
  { name: 'clamav', status: 'running', uptime: '14d 7h', port: null },
  { name: 'waydroid', status: 'stopped', uptime: '—', port: null },
];

const commandHistory = [
  { ts: '16:42:18', cmd: 'git push origin master', output: 'Everything up-to-date', status: 'ok' },
  { ts: '16:41:55', cmd: 'npm run build', output: '✓ built in 3.2s — 847 modules', status: 'ok' },
  { ts: '16:40:03', cmd: 'docker ps --format "table {{.Names}}\\t{{.Status}}"', output: 'gpu-audio   Up 6 days\npostgres    Up 14 days', status: 'ok' },
  { ts: '16:38:22', cmd: 'systemctl status nginx', output: '● nginx.service — active (running) since Mar 02', status: 'ok' },
  { ts: '16:35:10', cmd: 'clamscan -r --infected /home/scribble0563/projects/', output: '----------- SCAN SUMMARY -----------\nInfected files: 0', status: 'ok' },
  { ts: '16:31:44', cmd: 'df -h / /home', output: '/dev/nvme0n1p2  457G  214G  220G  50%  /\n/dev/nvme0n1p3  1.8T  847G  892G  49%  /home', status: 'ok' },
  { ts: '16:28:09', cmd: 'nvidia-smi --query-gpu=name,temperature.gpu,utilization.gpu --format=csv,noheader', output: 'NVIDIA GH200, 42, 34 %', status: 'ok' },
  { ts: '16:22:50', cmd: 'uptime', output: ' 16:22:50 up 14 days, 7:03, 3 users, load average: 1.24, 0.98, 0.87', status: 'ok' },
  { ts: '16:18:33', cmd: 'journalctl -u clamav-freshclam --since "1 hour ago" --no-pager', output: 'Mar 16 16:00:01 spark-5495 freshclam: ClamAV update process started\nMar 16 16:00:03 spark-5495 freshclam: daily.cvd database is up-to-date', status: 'ok' },
];

const activeProjects = [
  { id: 1, name: 'kaiw.io Hub', status: 'building', progress: 88, emoji: '⚡' },
  { id: 2, name: 'MediaPipe Form AI', status: 'building', progress: 60, emoji: '🧘' },
  { id: 3, name: 'WF App v2.3', status: 'building', progress: 45, emoji: '📱' },
];

const recentDeploys = [
  { name: 'kaiw-hub auth + merge', time: 'Mar 12 23:14', status: 'success' },
  { name: 'agent-mode-switch.sh', time: 'Mar 11 19:42', status: 'success' },
  { name: 'wf-security-sentinel.sh', time: 'Mar 8 03:11', status: 'success' },
  { name: 'GPU Audio Docker image', time: 'Mar 5 01:33', status: 'success' },
];

const systemInfo = {
  host: 'spark-5495',
  os: 'Linux arm64',
  model: 'claude-sonnet-4-6',
  kernel: '6.14.0-1013-nvidia',
  arch: 'aarch64',
  cpu: 'NVIDIA Grace',
  gpu: 'GH200 120GB',
};

const quotes = [
  "The best code is no code.",
  "Complexity is the enemy.",
  "Ship it. Fix it. Ship again.",
  "Read the source.",
  "Delete more. Write less.",
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

  // Animated metric values
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

  // Fluctuate metrics slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => ({
        ...m,
        value: Math.max(5, Math.min(95, m.value + Math.floor(Math.random() * 7) - 3)),
      })));
    }, 3000);
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
            <span>14d 7h</span>
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
                <span className="term-ts">16:15:00</span>
                <span className="term-text">── session started · {systemInfo.host} · {systemInfo.os} ──</span>
              </div>
              <div className="term-line system">
                <span className="term-ts">16:15:01</span>
                <span className="term-text">load avg: 1.24, 0.98, 0.87 · 72 processes · 3 users</span>
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
              ACTIVE BUILDS
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
        <span>{activeProjects.length} building · {recentDeploys.length} deployed</span>
        <span className="sep">|</span>
        <span className="status-dot-footer">●</span>
        <span>online</span>
      </footer>
    </div>
  );
}

export default BadgerDashboard;
