import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './css/ariaDashboard.css';

const agent = { name: 'Aria', emoji: '🎵', role: 'Personal Life Assistant', color: '#a855f7', telegram: 'AriaFlowBot' };

const FAMILY_COLORS = {
  michael: { bg: '#a855f7', emoji: '👨' },
  melissa: { bg: '#e91e8c', emoji: '👩' },
  elora:   { bg: '#7c3aed', emoji: '👧' },
  iris:    { bg: '#3b82f6', emoji: '👶' },
  lola:    { bg: '#f97316', emoji: '🐾' },
};

/* ── Fallback data ── */
const FALLBACK_OURA = {
  date: '2026-03-16',
  scores: { sleep: 82, readiness: 76, activity: 68 },
  details: {
    sleep: { deep: 54, hrv: 38, restingHR: 58, total: 7.2 },
    activity: { steps: 8432, calories: 2180 },
  },
};

const FALLBACK_FAMILY = {
  family: {
    michael: { birthday: 'Jun 12', lastActivity: 'Dashboard session — 2m ago', mood: 'focused' },
    melissa: { birthday: 'Sep 3', lastActivity: 'Yoga class check-in — 1h ago', mood: 'relaxed' },
    elora:   { birthday: 'Mar 28', lastActivity: 'Piano practice logged — 3h ago', mood: 'creative' },
    iris:    { birthday: 'Nov 15', lastActivity: 'Nap ended — 45m ago', mood: 'playful' },
    lola:    { birthday: 'Dec 1', lastActivity: 'Walk completed — 2h ago', mood: 'happy' },
  },
};

const FALLBACK_BUSINESS = {
  source: 'Linear',
  metrics: { activeTasks: 7, todoTasks: 12, backlogTasks: 23, completedToday: 3 },
  topTasks: [
    { title: 'Finalize Q1 investor deck copy', state: 'In Progress' },
    { title: 'Review mobile onboarding flow', state: 'In Progress' },
    { title: 'Ship notification preferences API', state: 'Todo' },
    { title: 'Update brand guidelines PDF', state: 'Done' },
    { title: 'Prep sprint retro agenda', state: 'Todo' },
  ],
  notes: 'Sprint ends Friday — 3 items at risk',
};

const FALLBACK_AGENTS = [
  { name: 'Aria', status: 'active', lastSeen: 'now', role: 'Personal Assistant' },
  { name: 'Kaia', status: 'active', lastSeen: '12s ago', role: 'Trend Analyst' },
  { name: 'Thea', status: 'active', lastSeen: '1m ago', role: 'Content Editor' },
  { name: 'Renzo', status: 'active', lastSeen: '3m ago', role: 'Home Architect' },
  { name: 'Maverick', status: 'recent', lastSeen: '18m ago', role: 'Resource Guard' },
  { name: 'Quanta', status: 'recent', lastSeen: '25m ago', role: 'Data Analyst' },
  { name: 'Freq', status: 'idle', lastSeen: '2h ago', role: 'Music Curator' },
  { name: 'Badger', status: 'idle', lastSeen: '4h ago', role: 'QA Enforcer' },
];

const SLEEP_WEEK = [
  { day: 'Mon', hours: 6.8, score: 71 },
  { day: 'Tue', hours: 7.5, score: 84 },
  { day: 'Wed', hours: 6.2, score: 62 },
  { day: 'Thu', hours: 7.8, score: 88 },
  { day: 'Fri', hours: 7.0, score: 78 },
  { day: 'Sat', hours: 8.1, score: 91 },
  { day: 'Sun', hours: 7.2, score: 82 },
];

const STEPS_WEEK = [
  { day: 'Mon', steps: 9200 },
  { day: 'Tue', steps: 6100 },
  { day: 'Wed', steps: 11400 },
  { day: 'Thu', steps: 7800 },
  { day: 'Fri', steps: 5300 },
  { day: 'Sat', steps: 12600 },
  { day: 'Sun', steps: 8432 },
];

const MOOD_MAP = {
  focused: { color: '#a855f7', icon: '🎯' },
  relaxed: { color: '#22c55e', icon: '🧘' },
  creative: { color: '#f59e0b', icon: '🎨' },
  playful: { color: '#3b82f6', icon: '😄' },
  happy: { color: '#f97316', icon: '🐕' },
};

function ScoreRing({ value, max = 100, color, label, sub, size = 80 }) {
  const r = size * 0.39, circ = 2 * Math.PI * r;
  const pct = value != null ? Math.min(value / max, 1) : 0;
  const dash = pct * circ;
  const scoreColor = value == null ? '#444'
    : value < 60 ? '#ef4444'
    : value < 80 ? '#eab308'
    : '#22c55e';

  return (
    <div className="score-ring-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e1e2e" strokeWidth="5" />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color || scoreColor} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x={size/2} y={size/2 + 5} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700">
          {value ?? '—'}
        </text>
      </svg>
      <div className="score-ring-label">{label}</div>
      {sub && <div className="score-ring-sub">{sub}</div>}
    </div>
  );
}

function ProgressBar({ value, max = 100, color = '#a855f7', height = 6 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="progress-bar-track" style={{ height }}>
      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color, height }} />
    </div>
  );
}

function StatusDot({ status }) {
  const color = status === 'active' ? '#22c55e' : status === 'recent' ? '#3b82f6' : '#555';
  return <span className="status-dot" style={{ background: color, boxShadow: status === 'active' ? `0 0 6px ${color}` : 'none' }} />;
}

const chartTooltipStyle = {
  contentStyle: { background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 8, fontSize: 12, color: '#e2e2f0' },
  itemStyle: { color: '#e2e2f0' },
};

export default function AriaDashboard() {
  const [ouraData, setOuraData]       = useState(null);
  const [familyData, setFamilyData]   = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [agentStatus, setAgentStatus] = useState([]);
  const [now, setNow]                 = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/oura').then(r => r.json()).then(setOuraData).catch(() => setOuraData(FALLBACK_OURA));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/family').then(r => r.json()).then(setFamilyData).catch(() => setFamilyData(FALLBACK_FAMILY));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/business').then(r => r.json()).then(setBusinessData).catch(() => setBusinessData(FALLBACK_BUSINESS));
  }, []);

  useEffect(() => {
    const load = () =>
      fetch('http://localhost:3001/api/agents').then(r => r.json())
        .then(d => setAgentStatus(d.agents?.length ? d.agents : FALLBACK_AGENTS)).catch(() => setAgentStatus(FALLBACK_AGENTS));
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const oura = (ouraData?.scores) ? ouraData : FALLBACK_OURA;
  const family = (familyData?.family) ? familyData : FALLBACK_FAMILY;
  const biz = (businessData?.metrics) ? businessData : FALLBACK_BUSINESS;
  const agents = agentStatus.length ? agentStatus : FALLBACK_AGENTS;

  const greeting = () => {
    const h = now.getHours();
    if (h < 5)  return 'Burning the midnight oil';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Winding down';
  };

  const lateNightWarning = now.getHours() >= 23 || now.getHours() < 4;
  const activeCount = agents.filter(a => a.status === 'active').length;
  const tasksDone = biz.metrics?.completedToday ?? 3;

  return (
    <div className="aria-dashboard">

      {/* ── COMPACT HEADER ── */}
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
            <p className="aria-greeting">
              {greeting()} · {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              {' · '}
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          {lateNightWarning && (
            <div className="aria-late-banner">
              🌙 It's late — Michael should probably be sleeping
            </div>
          )}
        </div>
      </header>

      {/* ── KPI STRIP — large, high contrast ── */}
      <section className="aria-kpi-strip">
        <div className="kpi-item">
          <span className="kpi-value" style={{ color: oura.scores.sleep >= 80 ? '#22c55e' : oura.scores.sleep >= 60 ? '#eab308' : '#ef4444' }}>
            {oura.scores.sleep}
          </span>
          <span className="kpi-label">Sleep Score</span>
          <ProgressBar value={oura.scores.sleep} color={oura.scores.sleep >= 80 ? '#22c55e' : '#eab308'} />
        </div>
        <div className="kpi-item">
          <span className="kpi-value" style={{ color: '#a855f7' }}>{oura.scores.readiness}</span>
          <span className="kpi-label">Readiness</span>
          <ProgressBar value={oura.scores.readiness} color="#a855f7" />
        </div>
        <div className="kpi-item">
          <span className="kpi-value" style={{ color: '#06b6d4' }}>{(oura.details.activity.steps).toLocaleString()}</span>
          <span className="kpi-label">Steps Today</span>
          <ProgressBar value={oura.details.activity.steps} max={10000} color="#06b6d4" />
        </div>
        <div className="kpi-item">
          <span className="kpi-value" style={{ color: '#f59e0b' }}>{biz.metrics.activeTasks}</span>
          <span className="kpi-label">Active Tasks</span>
          <ProgressBar value={biz.metrics.activeTasks} max={20} color="#f59e0b" />
        </div>
        <div className="kpi-item">
          <span className="kpi-value" style={{ color: '#22c55e' }}>{activeCount}/{agents.length}</span>
          <span className="kpi-label">Agents Online</span>
          <ProgressBar value={activeCount} max={agents.length} color="#22c55e" />
        </div>
        <div className="kpi-item">
          <span className="kpi-value" style={{ color: '#3b82f6' }}>{tasksDone}</span>
          <span className="kpi-label">Done Today</span>
          <ProgressBar value={tasksDone} max={10} color="#3b82f6" />
        </div>
      </section>

      <div className="aria-body">

        {/* ── HEALTH ── */}
        <section className="aria-card aria-health">
          <div className="card-header">
            <span className="card-icon">💜</span>
            <h2>Michael's Health</h2>
            <span className="card-meta">{oura.date}</span>
          </div>

          <div className="health-top-row">
            <div className="score-rings">
              <ScoreRing value={oura.scores.sleep}     label="Sleep"     sub={`${oura.details.sleep.deep}m deep`} />
              <ScoreRing value={oura.scores.readiness} label="Readiness" sub={`HRV ${oura.details.sleep.hrv}`} color="#a855f7" />
              <ScoreRing value={oura.scores.activity}  label="Activity"  sub={`${oura.details.activity.steps.toLocaleString()} steps`} color="#06b6d4" />
            </div>
            <div className="health-chart">
              <div className="mini-chart-title">Sleep This Week</div>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={SLEEP_WEEK}>
                  <defs>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[5, 9]} />
                  <Tooltip {...chartTooltipStyle} formatter={(v) => [`${v}h`, 'Sleep']} />
                  <Area type="monotone" dataKey="hours" stroke="#a855f7" fill="url(#sleepGrad)" strokeWidth={2} dot={{ r: 3, fill: '#a855f7' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="health-row">
            <div className="health-pill">
              <span>❤️ Resting HR</span>
              <strong>{oura.details.sleep.restingHR} bpm</strong>
            </div>
            <div className="health-pill">
              <span>🧠 HRV</span>
              <strong>{oura.details.sleep.hrv} ms</strong>
            </div>
            <div className="health-pill">
              <span>😴 Total Sleep</span>
              <strong>{oura.details.sleep.total}h</strong>
            </div>
            <div className="health-pill">
              <span>🔥 Calories</span>
              <strong>{oura.details.activity.calories.toLocaleString()}</strong>
            </div>
          </div>
        </section>

        {/* ── FAMILY ── */}
        <section className="aria-card aria-family">
          <div className="card-header">
            <span className="card-icon">🏠</span>
            <h2>Family</h2>
            <span className="card-meta">{Object.keys(family.family).length} members</span>
          </div>

          <div className="family-grid">
            {Object.entries(family.family).map(([key, data]) => {
              const meta = FAMILY_COLORS[key] || { bg: '#666', emoji: '👤' };
              const mood = MOOD_MAP[data.mood] || { color: '#888', icon: '😊' };
              return (
                <div key={key} className="family-member">
                  <div className="family-avatar" style={{ background: meta.bg }}>
                    {meta.emoji}
                  </div>
                  <div className="family-info">
                    <div className="family-name-row">
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                      <span className="family-mood" style={{ color: mood.color }}>{mood.icon} {data.mood}</span>
                    </div>
                    {data.lastActivity && data.lastActivity !== 'unknown' &&
                      <span className="family-last">{data.lastActivity}</span>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── STEPS CHART ── */}
        <section className="aria-card aria-steps">
          <div className="card-header">
            <span className="card-icon">🚶</span>
            <h2>Steps This Week</h2>
            <span className="card-meta">Goal: 10,000</span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={STEPS_WEEK}>
              <XAxis dataKey="day" tick={{ fill: '#aaa', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip {...chartTooltipStyle} formatter={(v) => [v.toLocaleString(), 'Steps']} />
              <Bar dataKey="steps" radius={[4, 4, 0, 0]} fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* ── BUSINESS PULSE ── */}
        <section className="aria-card aria-business">
          <div className="card-header">
            <span className="card-icon">⚡</span>
            <h2>Workout Flow Pulse</h2>
            <span className="card-meta">via {biz.source}</span>
          </div>

          <div className="biz-stats">
            <div className="biz-stat">
              <strong>{biz.metrics.activeTasks}</strong>
              <span>Active</span>
            </div>
            <div className="biz-stat">
              <strong>{biz.metrics.todoTasks}</strong>
              <span>To Do</span>
            </div>
            <div className="biz-stat">
              <strong>{biz.metrics.backlogTasks}</strong>
              <span>Backlog</span>
            </div>
            <div className="biz-stat biz-stat-done">
              <strong>{tasksDone}</strong>
              <span>Done Today</span>
            </div>
          </div>
          <ul className="task-list">
            {(biz.topTasks || []).slice(0, 5).map((t, i) => (
              <li key={i} className="task-item">
                <span className={`task-dot ${t.state?.toLowerCase().replace(' ', '-')}`} />
                <span className="task-title">{t.title}</span>
                <span className={`task-state task-state-${t.state?.toLowerCase().replace(' ', '-')}`}>{t.state}</span>
              </li>
            ))}
          </ul>
          {biz?.notes && <p className="biz-note">⚠️ {biz.notes}</p>}
        </section>

        {/* ── TEAM STATUS ── */}
        <section className="aria-card aria-team">
          <div className="card-header">
            <span className="card-icon">🤖</span>
            <h2>Agent Team</h2>
            <span className="card-meta">{activeCount} active</span>
          </div>

          <div className="team-grid">
            {agents.map((a, i) => (
              <div key={i} className="team-member">
                <StatusDot status={a.status} />
                <span className="team-name">{a.name}</span>
                {a.role && <span className="team-role">{a.role}</span>}
                <span className="team-last">{a.lastSeen}</span>
              </div>
            ))}
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
