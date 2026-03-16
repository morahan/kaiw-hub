import { useState, useEffect } from 'react';
import './css/ariaDashboard.css';

const agent = { name: 'Aria', emoji: '🎵', role: 'Personal Life Assistant', color: '#a855f7', telegram: 'AriaFlowBot' };

const FAMILY_COLORS = {
  michael: { bg: '#a855f7', emoji: '👨' },
  melissa: { bg: '#e91e8c', emoji: '👩' },
  elora:   { bg: '#7c3aed', emoji: '👧' },
  iris:    { bg: '#3b82f6', emoji: '👶' },
  lola:    { bg: '#f97316', emoji: '🐾' },
};

function ScoreRing({ value, max = 100, color, label, sub }) {
  const r = 28, circ = 2 * Math.PI * r;
  const pct = value != null ? Math.min(value / max, 1) : 0;
  const dash = pct * circ;
  const scoreColor = value == null ? '#444'
    : value < 60 ? '#ef4444'
    : value < 80 ? '#eab308'
    : '#22c55e';

  return (
    <div className="score-ring-wrap">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#1e1e2e" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color || scoreColor} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x="36" y="40" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">
          {value ?? '—'}
        </text>
      </svg>
      <div className="score-ring-label">{label}</div>
      {sub && <div className="score-ring-sub">{sub}</div>}
    </div>
  );
}

function StatusDot({ status }) {
  const color = status === 'active' ? '#22c55e' : status === 'recent' ? '#3b82f6' : '#555';
  return <span className="status-dot" style={{ background: color }} />;
}

export default function AriaDashboard() {
  const [ouraData, setOuraData]       = useState(null);
  const [familyData, setFamilyData]   = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [agentStatus, setAgentStatus] = useState([]);
  const [now, setNow]                 = useState(new Date());

  // Tick clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/oura').then(r => r.json()).then(setOuraData).catch(() => {});
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/family').then(r => r.json()).then(setFamilyData).catch(() => {});
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/business').then(r => r.json()).then(setBusinessData).catch(() => {});
  }, []);

  useEffect(() => {
    const load = () =>
      fetch('http://localhost:3001/api/agents').then(r => r.json())
        .then(d => setAgentStatus(d.agents || [])).catch(() => {});
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const greeting = () => {
    const h = now.getHours();
    if (h < 5)  return 'Burning the midnight oil 🌙';
    if (h < 12) return 'Good morning ☀️';
    if (h < 17) return 'Good afternoon 🌤';
    if (h < 21) return 'Good evening 🌆';
    return 'Winding down 🌙';
  };

  const lateNightWarning = now.getHours() >= 23 || now.getHours() < 4;

  return (
    <div className="aria-dashboard">

      {/* ── HERO HEADER ── */}
      <header className="aria-hero">
        <div className="aria-hero-bg" />
        <div className="aria-hero-content">
          <div className="aria-avatar">
            <img
              src="https://cdn1.telesco.pe/file/vYQ6K_dTy3YAVuK__aU9avcE9gQcz3Bta160iRibDW3_nDqBAxljzxung9EicfvZAdr7TyncBc6dOV_GskUm_ngnezSzLsjVO4a9Ba6Z72gHQxJtH_r_19s3S7OChHdMZKu1Hrv_7mHHbmJLzjh7XDlJ2GqXSGjopjFK_TJtxb1-XVS5eNRqhrsR7DuKvGoDZ4m3Tjxard-YN68VBiLsXQ4TZ9UZMJBo0KhpsXdYviSBhrU4erY0WLyVxlKvVNPfoA6ythEx7YEfGuWps6Ae6u0fRpYIsijN17MzOyE7EWAsJhiS77lW8azLYXG_cnlH3BHgyfraOzSu23VPw2t0EQ.jpg"
              alt="Aria"
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
            />
            <div className="aria-avatar-fallback">🎵</div>
          </div>
          <div className="aria-hero-text">
            <h1>Aria <span className="aria-badge">Personal Assistant</span></h1>
            <p className="aria-greeting">{greeting()}</p>
            <p className="aria-time">
              {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              {' · '}
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        {lateNightWarning && (
          <div className="aria-late-banner">
            🌙 It's late — Michael should probably be sleeping
          </div>
        )}
      </header>

      <div className="aria-body">

        {/* ── QUICK PULSE ── */}
        <section className="aria-card aria-pulse" style={{ gridColumn: '1 / -1' }}>
          <div className="pulse-grid">
            <div className="pulse-item">
              <span className="pulse-label">🏠 Family</span>
              <span className="pulse-value">{familyData?.family ? Object.keys(familyData.family).length : '—'} tracked</span>
            </div>
            <div className="pulse-item">
              <span className="pulse-label">💜 Sleep</span>
              <span className="pulse-value" style={{ color: ouraData?.scores?.sleep < 70 ? '#ef4444' : '#22c55e' }}>
                {ouraData?.scores?.sleep ?? '—'}/100
              </span>
            </div>
            <div className="pulse-item">
              <span className="pulse-label">⚡ Tasks</span>
              <span className="pulse-value">{businessData?.metrics?.activeTasks ?? '—'} active</span>
            </div>
            <div className="pulse-item">
              <span className="pulse-label">🤖 Team</span>
              <span className="pulse-value">{agentStatus.filter(a => a.status === 'active').length} online</span>
            </div>
            <div className="pulse-item">
              <span className="pulse-label">🎵 Model</span>
              <span className="pulse-value">Opus 4.6</span>
            </div>
          </div>
        </section>

        {/* ── HEALTH ── */}
        <section className="aria-card aria-health">
          <div className="card-header">
            <span className="card-icon">💜</span>
            <h2>Michael's Health</h2>
            {ouraData?.date && <span className="card-meta">{ouraData.date}</span>}
          </div>

          {ouraData?.scores ? (
            <>
              <div className="score-rings">
                <ScoreRing value={ouraData.scores.sleep}     label="Sleep"     sub={`${ouraData.details?.sleep?.deep ?? '—'}m deep`} />
                <ScoreRing value={ouraData.scores.readiness} label="Readiness" sub={`HRV ${ouraData.details?.sleep?.hrv ?? '—'}`} color="#a855f7" />
                <ScoreRing value={ouraData.scores.activity}  label="Activity"  sub={`${(ouraData.details?.activity?.steps ?? 0).toLocaleString()} steps`} color="#06b6d4" />
              </div>
              <div className="health-row">
                <div className="health-pill">
                  <span>❤️ Resting HR</span>
                  <strong>{ouraData.details?.sleep?.restingHR ?? '—'} bpm</strong>
                </div>
                <div className="health-pill">
                  <span>🧠 HRV</span>
                  <strong>{ouraData.details?.sleep?.hrv ?? '—'} ms</strong>
                </div>
                <div className="health-pill">
                  <span>😴 Total sleep</span>
                  <strong>{ouraData.details?.sleep?.total ?? '—'}h</strong>
                </div>
              </div>
            </>
          ) : (
            <p className="no-data">Oura ring not synced · ring needs charging or sync</p>
          )}
        </section>

        {/* ── FAMILY ── */}
        <section className="aria-card aria-family">
          <div className="card-header">
            <span className="card-icon">🏠</span>
            <h2>Family</h2>
          </div>

          {familyData?.family ? (
            <div className="family-grid">
              {Object.entries(familyData.family).map(([key, data]) => {
                const meta = FAMILY_COLORS[key] || { bg: '#666', emoji: '👤' };
                return (
                  <div key={key} className="family-member">
                    <div className="family-avatar" style={{ background: meta.bg }}>
                      {meta.emoji}
                    </div>
                    <div className="family-info">
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                      {data.birthday && <span>🎂 {data.birthday}</span>}
                      {data.lastActivity && data.lastActivity !== 'unknown' &&
                        <span className="family-last">↻ {data.lastActivity}</span>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">Loading family data…</p>
          )}
        </section>

        {/* ── BUSINESS PULSE ── */}
        <section className="aria-card aria-business">
          <div className="card-header">
            <span className="card-icon">⚡</span>
            <h2>Workout Flow Pulse</h2>
            {businessData?.source && <span className="card-meta">via {businessData.source}</span>}
          </div>

          {businessData ? (
            <>
              <div className="biz-stats">
                <div className="biz-stat">
                  <strong>{businessData.metrics?.activeTasks ?? 0}</strong>
                  <span>Active</span>
                </div>
                <div className="biz-stat">
                  <strong>{businessData.metrics?.todoTasks ?? 0}</strong>
                  <span>To Do</span>
                </div>
                <div className="biz-stat">
                  <strong>{businessData.metrics?.backlogTasks ?? 0}</strong>
                  <span>Backlog</span>
                </div>
              </div>
              {businessData.topTasks?.length > 0 && (
                <ul className="task-list">
                  {businessData.topTasks.slice(0, 4).map((t, i) => (
                    <li key={i} className="task-item">
                      <span className={`task-dot ${t.state?.toLowerCase().replace(' ', '-')}`} />
                      <span className="task-title">{t.title}</span>
                      <span className="task-state">{t.state}</span>
                    </li>
                  ))}
                </ul>
              )}
              {businessData.notes && <p className="biz-note">{businessData.notes}</p>}
            </>
          ) : (
            <p className="no-data">Loading business data…</p>
          )}
        </section>

        {/* ── TEAM STATUS ── */}
        <section className="aria-card aria-team">
          <div className="card-header">
            <span className="card-icon">🤖</span>
            <h2>Team Status</h2>
            <span className="card-meta">
              {agentStatus.filter(a => a.status === 'active').length} active
            </span>
          </div>

          <div className="team-grid">
            {agentStatus.length > 0 ? agentStatus.map((a, i) => (
              <div key={i} className="team-member">
                <StatusDot status={a.status} />
                <span className="team-name">{a.name}</span>
                <span className="team-last">{a.lastSeen}</span>
              </div>
            )) : (
              <p className="no-data">Loading team status…</p>
            )}
          </div>
        </section>

      </div>

      <footer className="aria-footer">
        <span>🎵 Aria · Personal Life Assistant · Opus 4.6</span>
        <span>Refreshes every 30s</span>
      </footer>
    </div>
  );
}
