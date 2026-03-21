import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import { getSleepData, getWeeklySleep, getWeeklySteps } from '../services/ouraApi';
import './css/ariaDashboard.css';

const agent = { name: 'Aria', emoji: '🎵', role: 'Personal Life Assistant', color: '#a855f7', telegram: 'AriaFlowBot' };

const FAMILY_COLORS = {
  michael: { bg: '#a855f7', emoji: '👨' },
  melissa: { bg: '#e91e8c', emoji: '👩' },
  elora:   { bg: '#7c3aed', emoji: '👧' },
  iris:    { bg: '#3b82f6', emoji: '👶' },
  lola:    { bg: '#f97316', emoji: '🐾' },
};

const REAL_OURA = {
  date: '2026-03-16 sleep live · 2026-03-11 activity sync',
  scores: { sleep: 89, readiness: 95, activity: 69 },
  details: {
    sleep: { deep: 70, hrv: 34, restingHR: 42, total: 8.3 },
    activity: { steps: 4302, calories: 2199 },
  },
};

const REAL_FAMILY = {
  family: {
    michael: { birthday: 'Jun 20', lastActivity: 'Sleep score 89 logged on Mar 16', mood: 'focused' },
    melissa: { birthday: 'Sep 1', lastActivity: 'No family issues flagged in Mar 8 digest', mood: 'relaxed' },
    elora:   { birthday: 'Aug 27', lastActivity: 'Bedtime routine went smoothly on Mar 12', mood: 'happy' },
    iris:    { birthday: 'Jan 30', lastActivity: 'Fell asleep by 8:30 during the Mar 12 bedtime win', mood: 'playful' },
    lola:    { birthday: 'Jan 1', lastActivity: 'No mentions in the last 14 days of family memory', mood: 'unknown' },
  },
};

const REAL_CONTEXT = {
  source: 'morning-context.json',
  metrics: { activeTasks: 0, todoTasks: 0, backlogTasks: 6, completedToday: 1 },
  topTasks: [
    { title: 'Trash day before 8 AM', state: 'High' },
    { title: 'Family groceries on Tuesday', state: 'Medium' },
    { title: 'Late night wind-down nudge', state: 'Medium' },
    { title: 'Elora school prep on Sunday', state: 'Medium' },
    { title: 'Midday hydration check', state: 'Low' },
  ],
  notes: '0 priority alerts · 0 upcoming events · latest family win: Elora bedtime routine went smoothly',
};

const REAL_AGENTS = [
  { name: 'Aria', status: 'active', lastSeen: '52 sessions on Mar 16', role: 'Personal Assistant' },
  { name: 'Main', status: 'active', lastSeen: '52 sessions on Mar 16', role: 'Primary Session' },
  { name: 'Renzo', status: 'active', lastSeen: '14 sessions on Mar 16', role: 'Writer' },
  { name: 'Freq', status: 'active', lastSeen: '11 sessions on Mar 16', role: 'Audio Engineer' },
  { name: 'Reno', status: 'active', lastSeen: '9 sessions on Mar 16', role: 'Trading Analyst' },
  { name: 'Maverick', status: 'active', lastSeen: '7 sessions on Mar 16', role: 'Operations Guard' },
  { name: 'Thea', status: 'active', lastSeen: '7 sessions on Mar 16', role: 'Reviewer' },
  { name: 'Kaia', status: 'active', lastSeen: '6 sessions on Mar 16', role: 'Trend Analyst' },
  { name: 'Quanta', status: 'active', lastSeen: '6 sessions on Mar 16', role: 'Analytics' },
  { name: 'Badger', status: 'recent', lastSeen: '5 sessions on Mar 16', role: 'QA Enforcer' },
  { name: 'Greta', status: 'recent', lastSeen: '4 sessions on Mar 16', role: 'Research Analyst' },
  { name: 'Rocio', status: 'recent', lastSeen: '4 sessions on Mar 16', role: 'Comms' },
];

const SLEEP_WEEK = [
  { day: 'Feb 11', hours: 5.2, score: 65 },
  { day: 'Feb 12', hours: 5.6, score: 61 },
  { day: 'Feb 13', hours: 3.6, score: 45 },
  { day: 'Feb 14', hours: 10.0, score: 93 },
  { day: 'Feb 15', hours: 8.7, score: 92 },
  { day: 'Feb 16', hours: 3.3, score: 44 },
  { day: 'Feb 17', hours: 10.8, score: 94 },
];

const STEPS_WEEK = [
  { day: 'Mar 7', steps: 2261 },
  { day: 'Mar 11', steps: 4302 },
];

const MOOD_MAP = {
  focused: { color: '#a855f7', icon: '🎯' },
  relaxed: { color: '#22c55e', icon: '🧘' },
  creative: { color: '#f59e0b', icon: '🎨' },
  playful: { color: '#3b82f6', icon: '😄' },
  happy: { color: '#f97316', icon: '🐕' },
  unknown: { color: '#888', icon: '—' },
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
  const [now, setNow]                 = useState(new Date());
  const [ouraData, setOuraData]       = useState(REAL_OURA);
  const [sleepWeek, setSleepWeek]     = useState(SLEEP_WEEK);
  const [stepsWeek, setStepsWeek]     = useState(STEPS_WEEK);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  // Fetch real Oura data on mount
  useEffect(() => {
    async function loadOuraData() {
      try {
        const sleep = await getSleepData();
        if (sleep) setOuraData(sleep);
        
        const weekly = await getWeeklySleep();
        if (weekly?.length) setSleepWeek(weekly);
        
        const steps = await getWeeklySteps();
        if (steps?.length) setStepsWeek(steps);
      } catch (err) {
        console.error('Failed to load Oura data:', err);
      }
    }
    loadOuraData();
  }, []);

  const oura = ouraData;
  const family = REAL_FAMILY;
  const biz = REAL_CONTEXT;
  const agents = REAL_AGENTS;

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
                  <XAxis dataKey="day" tick={{ fill: '#aaa', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[5, 9]} />
                  <Tooltip {...chartTooltipStyle} formatter={(v) => [`${v}h`, 'Sleep']} />
                  <Legend wrapperStyle={{ fontSize: 13, color: '#ccc', paddingTop: 4 }} formatter={() => 'Hours Slept'} />
                  <Area type="monotone" dataKey="hours" stroke="#a855f7" fill="url(#sleepGrad)" strokeWidth={2} dot={{ r: 3, fill: '#a855f7' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="health-row">
            <div className="health-pill">
              <span>❤️ Resting HR</span>
              <strong>{oura.details.sleep.restingHR}<span className="health-unit">bpm</span></strong>
            </div>
            <div className="health-pill">
              <span>🧠 HRV</span>
              <strong>{oura.details.sleep.hrv}<span className="health-unit">ms</span></strong>
            </div>
            <div className="health-pill">
              <span>😴 Total Sleep</span>
              <strong>{oura.details.sleep.total}<span className="health-unit">hrs</span></strong>
            </div>
            <div className="health-pill">
              <span>🔥 Calories</span>
              <strong>{oura.details.activity.calories.toLocaleString()}<span className="health-unit">kcal</span></strong>
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
              <Legend wrapperStyle={{ fontSize: 13, color: '#ccc', paddingTop: 4 }} formatter={() => 'Daily Steps'} />
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
        <span>🎵 Aria · Cori voice · Fish Speech @ 1.25x</span>
        <span>Workspace-backed family + Oura context</span>
      </footer>
    </div>
  );
}
