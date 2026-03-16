import { useState, useEffect } from 'react';
import { useAuth, UserButton } from '@clerk/react';
import './css/badgerDashboard.css';

// Current active + recent projects — update as Badger ships
const activeProjects = [
  { id: 1, name: 'kaiw.io Hub', status: 'building', progress: 88, priority: 'high', emoji: '⚡', desc: 'Auth + agent dashboard portal' },
  { id: 2, name: 'MediaPipe Form AI', status: 'building', progress: 60, priority: 'high', emoji: '🧘', desc: 'Rep detection & form feedback' },
  { id: 3, name: 'WF App v2.3', status: 'building', progress: 45, priority: 'high', emoji: '📱', desc: 'Native RN polish + iOS fixes' },
];

const recentCompletions = [
  { id: 1, name: 'kaiw-hub auth + merge', date: 'Mar 12', impact: 'high', emoji: '⚡' },
  { id: 2, name: 'agent-mode-switch.sh', date: 'Mar 11', impact: 'medium', emoji: '🔄' },
  { id: 3, name: 'wf-security-sentinel.sh', date: 'Mar 8', impact: 'high', emoji: '🔒' },
  { id: 4, name: 'wf-dev.sh', date: 'Mar 7', impact: 'medium', emoji: '🛠️' },
  { id: 5, name: 'GPU Audio Docker image', date: 'Mar 5', impact: 'high', emoji: '🎙️' },
  { id: 6, name: 'Chatterbox-Turbo voice', date: 'Mar 3', impact: 'medium', emoji: '🗣️' },
];

const skills = [
  { name: 'React / React Native', level: 88, color: '#61dafb' },
  { name: 'Shell / Bash', level: 95, color: '#00ff41' },
  { name: 'Node.js', level: 82, color: '#68a063' },
  { name: 'Python', level: 76, color: '#ffd43b' },
  { name: 'Codex CLI', level: 92, color: '#8b5cf6' },
  { name: 'Docker / GPU', level: 78, color: '#3b82f6' },
];

// Week of Mar 10–16, 2026 — qualitative activity signal
const weekActivity = [
  { day: 'Mon', level: 5 },
  { day: 'Tue', level: 8 },
  { day: 'Wed', level: 9 },
  { day: 'Thu', level: 4 },
  { day: 'Fri', level: 7 },
  { day: 'Sat', level: 6 },
  { day: 'Sun', level: 3 },
];

const systemInfo = {
  host: 'spark-5495',
  os: 'Linux arm64',
  model: 'claude-sonnet-4-6',
};

const quotes = [
  "The best code is no code.",
  "Complexity is the enemy.",
  "Work smarter, not harder.",
  "3 AM code flows better.",
  "Delete more. Write less.",
  "Ship it. Fix it. Ship again.",
  "Read the source.",
];

const statusMessages = [
  { label: 'HACKING', sub: 'building kaiw.io', color: '#00ff41' },
  { label: 'SHIPPING', sub: 'WF app v2.3', color: '#3b82f6' },
  { label: 'REVIEWING', sub: 'PR feedback loop', color: '#f59e0b' },
];

function BadgerDashboard() {
  const { isSignedIn } = useAuth();
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [glitch, setGlitch] = useState(false);
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const [statusIdx] = useState(() => Math.floor(Math.random() * statusMessages.length));
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

  if (!isSignedIn) {
    return (
      <div className="badger-dashboard">
        <div className="terminal-locked">
          <div className="terminal-header">
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

  const currentStatus = statusMessages[statusIdx];
  const activeCount = activeProjects.filter(p => p.status === 'building').length;
  const peakDay = weekActivity.reduce((a, b) => a.level > b.level ? a : b);

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

      {/* Header */}
      <header className="badger-header">
        <div className="header-left">
          <div className={`badger-icon ${glitch ? 'glitch' : ''}`}>🦡</div>
          <div className="header-title">
            <h1>BADGER</h1>
            <p className="tagline">// nocturnal dev agent · {systemInfo.host}</p>
          </div>
        </div>
        <div className="header-right">
          <div className="clock">
            <span className="time">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
            <span className="date">{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <UserButton afterSignOutUrl="/login" />
        </div>
      </header>

      {/* Terminal quote */}
      <div className="terminal-quote">
        <span className="prompt">$</span> echo &quot;{quote}&quot;
      </div>

      {/* Nav */}
      <nav className="badger-nav">
        {[
          { id: 'overview', label: '📡 overview' },
          { id: 'projects', label: '🔥 projects' },
          { id: 'complete', label: '✅ shipped' },
          { id: 'skills', label: '🛠️ skills' },
        ].map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="badger-content">

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="overview-layout">

            {/* Stat row */}
            <div className="stats-row">
              <div className="stat-card highlight">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <span className="stat-label">STATUS</span>
                  <span className="stat-value" style={{ color: currentStatus.color }}>{currentStatus.label}</span>
                  <span className="stat-sub">{currentStatus.sub}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-info">
                  <span className="stat-label">IN PROGRESS</span>
                  <span className="stat-value">{activeCount}</span>
                  <span className="stat-sub">active projects</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <span className="stat-label">SHIPPED</span>
                  <span className="stat-value">{recentCompletions.length}</span>
                  <span className="stat-sub">this month</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📡</div>
                <div className="stat-info">
                  <span className="stat-label">HOST</span>
                  <span className="stat-value sys">{systemInfo.host}</span>
                  <span className="stat-sub">{systemInfo.os}</span>
                </div>
              </div>
            </div>

            {/* Charts row */}
            <div className="charts-row">
              <div className="chart-card wide">
                <h3>// weekly_activity <span className="chart-sub">week of Mar 10–16</span></h3>
                <div className="bar-chart">
                  {weekActivity.map((day) => (
                    <div key={day.day} className={`bar-container ${day.day === peakDay.day ? 'peak' : ''}`}>
                      <div className="bar" style={{ height: `${(day.level / 10) * 100}%` }}>
                        <span className="bar-tooltip">{day.day === 'Sun' ? 'today' : ''}</span>
                      </div>
                      <span className="bar-label">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <h3>// active_builds</h3>
                <div className="project-list">
                  {activeProjects.map(p => (
                    <div key={p.id} className="project-item">
                      <span className="project-emoji">{p.emoji}</span>
                      <div className="project-item-info">
                        <span className="project-name">{p.name}</span>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${p.progress}%` }}></div>
                        </div>
                      </div>
                      <span className="progress-pct">{p.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent completions strip */}
            <div className="chart-card recents-card">
              <h3>// recently_shipped</h3>
              <div className="recents-strip">
                {recentCompletions.slice(0, 4).map(c => (
                  <div key={c.id} className="recent-pill">
                    <span>{c.emoji}</span>
                    <span className="pill-name">{c.name}</span>
                    <span className="pill-date">{c.date}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── PROJECTS ── */}
        {activeTab === 'projects' && (
          <div className="projects-grid">
            {activeProjects.map(p => (
              <div key={p.id} className={`project-card ${p.status}`}>
                <div className="project-header">
                  <span className="project-emoji">{p.emoji}</span>
                  <span className={`priority-badge ${p.priority}`}>{p.priority}</span>
                </div>
                <h3>{p.name}</h3>
                <p className="project-desc">{p.desc}</p>
                <div className="project-progress">
                  <div className="progress-bar large">
                    <div className="progress-fill" style={{ width: `${p.progress}%` }}></div>
                  </div>
                  <span className="progress-text">{p.progress}%</span>
                </div>
                <span className={`status-badge ${p.status}`}>{p.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── SHIPPED ── */}
        {activeTab === 'complete' && (
          <div className="completions-grid">
            {recentCompletions.map(c => (
              <div key={c.id} className="completion-card">
                <span className="completion-emoji">{c.emoji}</span>
                <div className="completion-info">
                  <h3>{c.name}</h3>
                  <span className="completion-date">{c.date}</span>
                </div>
                <span className={`impact-badge ${c.impact}`}>{c.impact}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── SKILLS ── */}
        {activeTab === 'skills' && (
          <div className="skills-grid">
            {skills.map(s => (
              <div key={s.name} className="skill-card">
                <div className="skill-header">
                  <span className="skill-name">{s.name}</span>
                  <span className="skill-level">{s.level}%</span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-fill"
                    style={{ width: `${s.level}%`, backgroundColor: s.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <footer className="badger-footer">
        <span>🦡 badger v1.1</span>
        <span className="sep">|</span>
        <span>model: {systemInfo.model}</span>
        <span className="sep">|</span>
        <span>{activeCount} building · {recentCompletions.length} shipped</span>
        <span className="sep">|</span>
        <span className="status-dot">●</span>
        <span>online</span>
      </footer>
    </div>
  );
}

export default BadgerDashboard;
