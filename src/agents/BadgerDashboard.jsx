import { useState, useEffect } from 'react';
import { useAuth, UserButton } from '@clerk/react';
import './css/badgerDashboard.css';

// Current active projects - pulled from memory/active work
const activeProjects = [
  { id: 1, name: 'kaiw.io Hub', status: 'building', progress: 85, priority: 'high', emoji: '⚡' },
  { id: 2, name: 'Agent Dashboard Merge', status: 'complete', progress: 100, priority: 'high', emoji: '🔀' },
  { id: 3, name: 'Security Sentinel', status: 'complete', progress: 100, priority: 'medium', emoji: '🔒' },
  { id: 4, name: 'wf-dev.sh', status: 'complete', progress: 100, priority: 'medium', emoji: '🛠️' },
];

const recentCompletions = [
  { id: 1, name: 'kaiw-hub (auth + merge)', date: '2026-03-12', impact: 'high', emoji: '⚡' },
  { id: 2, name: 'agent-mode-switch.sh', date: '2026-03-11', impact: 'medium', emoji: '🔄' },
  { id: 3, name: 'wf-security-sentinel.sh', date: '2026-03-08', impact: 'high', emoji: '🔒' },
  { id: 4, name: 'wf-dev.sh', date: '2026-03-07', impact: 'medium', emoji: '🛠️' },
  { id: 5, name: 'MediaPipe Form Detection', date: '2026-02-17', impact: 'high', emoji: '🧘' },
];

const skills = [
  { name: 'React/React Native', level: 88, color: '#61dafb' },
  { name: 'Node.js', level: 82, color: '#68a063' },
  { name: 'Python', level: 75, color: '#ffd43b' },
  { name: 'Shell/Bash', level: 95, color: '#4e5a6e' },
  { name: 'Codex CLI', level: 90, color: '#10b981' },
];

const weekActivity = [
  { day: 'Mon', hours: 4, commits: 12 },
  { day: 'Tue', hours: 6, commits: 18 },
  { day: 'Wed', hours: 8, commits: 24 },
  { day: 'Thu', hours: 3, commits: 9 },
  { day: 'Fri', hours: 7, commits: 21 },
  { day: 'Sat', hours: 5, commits: 15 },
  { day: 'Sun', hours: 2, commits: 8 },
];

const quotes = [
  "The best code is no code.",
  "Complexity is the enemy.",
  "Work smarter, not harder.",
  "3 AM code flows better.",
  "Delete more. Write less.",
];

function BadgerDashboard() {
  const { isSignedIn } = useAuth();
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [glitch, setGlitch] = useState(false);
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

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
            <p><span className="prompt">$</span> access_denied</p>
            <p className="error">Please sign in to access Badger's domain.</p>
            <p className="cursor">_</p>
          </div>
        </div>
      </div>
    );
  }

  const totalHours = weekActivity.reduce((sum, d) => sum + d.hours, 0);
  const totalCommits = weekActivity.reduce((sum, d) => sum + d.commits, 0);

  return (
    <div className="badger-dashboard">
      {/* Matrix rain effect */}
      <div className="matrix-rain">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="rain-column" style={{ animationDelay: `${i * 0.3}s` }}>
            {Array.from({ length: 15 }).map((_, j) => (
              <span key={j}>{String.fromCharCode(0x30A0 + Math.random() * 96)}</span>
            ))}
          </div>
        ))}
      </div>

      <header className="badger-header">
        <div className="header-left">
          <div className={`badger-icon ${glitch ? 'glitch' : ''}`}>
            🦡
          </div>
          <div className="header-title">
            <h1>BADGER</h1>
            <p className="tagline">// nocturnal coder</p>
          </div>
        </div>
        <div className="header-right">
          <div className="clock">
            <span className="time">{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
            <span className="date">{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <UserButton afterSignOutUrl="/login" />
        </div>
      </header>

      {/* Terminal-style quote */}
      <div className="terminal-quote">
        <span className="prompt">$</span> {quote}
      </div>

      <nav className="badger-nav">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
          📡 overview
        </button>
        <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>
          🔥 projects
        </button>
        <button className={activeTab === 'complete' ? 'active' : ''} onClick={() => setActiveTab('complete')}>
          ✅ done
        </button>
        <button className={activeTab === 'skills' ? 'active' : ''} onClick={() => setActiveTab('skills')}>
          🛠️ skills
        </button>
      </nav>

      <main className="badger-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="stat-card main-stat">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <span className="stat-label">STATUS</span>
                <span className="stat-value">HACKING</span>
                <span className="stat-sub">building kaiw.io</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-label">THIS WEEK</span>
                <span className="stat-value">{totalHours}h</span>
                <span className="stat-sub">{totalCommits} commits</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <span className="stat-label">ACTIVE</span>
                <span className="stat-value">{activeProjects.filter(p => p.status === 'building').length}</span>
                <span className="stat-sub">projects</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <span className="stat-label">COMPLETED</span>
                <span className="stat-value">{recentCompletions.length}</span>
                <span className="stat-sub">this month</span>
              </div>
            </div>

            <div className="chart-card wide">
              <h3>// weekly_activity</h3>
              <div className="bar-chart">
                {weekActivity.map((day) => (
                  <div key={day.day} className="bar-container">
                    <div className="bar" style={{ height: `${(day.hours / 8) * 100}%` }}>
                      <span className="bar-tooltip">{day.hours}h</span>
                    </div>
                    <span className="bar-label">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <h3>// hot_projects</h3>
              <div className="project-list">
                {activeProjects.slice(0, 3).map(p => (
                  <div key={p.id} className="project-item">
                    <span className="project-emoji">{p.emoji}</span>
                    <span className="project-name">{p.name}</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${p.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-grid">
            {activeProjects.map(p => (
              <div key={p.id} className={`project-card ${p.status}`}>
                <div className="project-header">
                  <span className="project-emoji">{p.emoji}</span>
                  <span className={`priority-badge ${p.priority}`}>{p.priority}</span>
                </div>
                <h3>{p.name}</h3>
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

        {activeTab === 'skills' && (
          <div className="skills-grid">
            {skills.map(s => (
              <div key={s.name} className="skill-card">
                <div className="skill-header">
                  <span className="skill-name">{s.name}</span>
                  <span className="skill-level">{s.level}%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-fill" style={{ width: `${s.level}%`, backgroundColor: s.color }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="badger-footer">
        <span>🦡 badger v1.0</span>
        <span className="separator">|</span>
        <span>model: minimax-m2.5</span>
        <span className="separator">|</span>
        <span>{totalHours}h this week</span>
        <span className="separator">|</span>
        <span className="status-indicator">●</span>
      </footer>
    </div>
  );
}

export default BadgerDashboard;
