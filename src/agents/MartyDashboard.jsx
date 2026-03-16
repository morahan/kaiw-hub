import { useState, useEffect } from 'react';
import { useAuth, UserButton } from '@clerk/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { Zap, CheckCircle, Clock, Users, TrendingUp, Activity, MessageSquare, Bot, Send, Play, ClipboardList, Eye, AlertCircle, ArrowRight, Radio, FileText, Calendar, Target } from 'lucide-react';
import './css/martyDashboard.css';

const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true';

const agent = {
  name: 'Marty',
  emoji: '⚡',
  role: 'Team Coordinator & Lead Agent',
  color: '#3b82f6',
  telegram: '@WorkoutMarty',
  avatar: 'https://t.me/i/userpic/320/Marty2126Bot.jpg'
};

// All 12 agents with realistic statuses
const allAgents = [
  { name: 'Marty', role: 'Coordinator', emoji: '⚡', status: 'working', color: '#3b82f6', currentTask: 'Reviewing daily pipeline', lastSeen: 'now' },
  { name: 'Kaia', role: 'Content Creator', emoji: '✨', status: 'working', color: '#ec4899', currentTask: 'Writing "Gut Health 101" article', lastSeen: 'now' },
  { name: 'Renzo', role: 'Writer', emoji: '✍️', status: 'working', color: '#f97316', currentTask: 'Drafting looksmaxxing guide pt.3', lastSeen: 'now' },
  { name: 'Thea', role: 'Editor & Reviewer', emoji: '👁️', status: 'working', color: '#a855f7', currentTask: 'Reviewing Renzo\'s nutrition draft', lastSeen: 'now' },
  { name: 'Aria', role: 'Personal Assistant', emoji: '🎵', status: 'online', color: '#06b6d4', currentTask: 'Awaiting instructions', lastSeen: '2m ago' },
  { name: 'Badger', role: 'Infrastructure & DevOps', emoji: '🔧', status: 'working', color: '#84cc16', currentTask: 'Deploying dashboard updates', lastSeen: 'now' },
  { name: 'Freq', role: 'Audio Engineer', emoji: '🎛️', status: 'online', color: '#14b8a6', currentTask: 'Idle — awaiting podcast edit', lastSeen: '5m ago' },
  { name: 'Greta', role: 'Research Analyst', emoji: '🔬', status: 'idle', color: '#6366f1', currentTask: 'Last: competitor audit', lastSeen: '1h ago' },
  { name: 'Reno', role: 'Trading Analyst', emoji: '📈', status: 'working', color: '#eab308', currentTask: 'Monitoring BTC/SOL positions', lastSeen: 'now' },
  { name: 'Quanta', role: 'Data Analyst', emoji: '📊', status: 'working', color: '#22d3ee', currentTask: 'Crunching engagement metrics', lastSeen: 'now' },
  { name: 'Nova', role: 'Social Media', emoji: '🚀', status: 'online', color: '#f43f5e', currentTask: 'Scheduling IG posts', lastSeen: '3m ago' },
  { name: 'Pixel', role: 'Design & Visual', emoji: '🎨', status: 'idle', color: '#d946ef', currentTask: 'Last: thumbnail batch', lastSeen: '45m ago' },
];

// KPI data
const kpiData = {
  messagesSent: 147,
  tasksDelegated: 23,
  tasksCompleted: 19,
  activeAgents: allAgents.filter(a => a.status === 'working' || a.status === 'online').length,
};

// Pipeline status
const pipelineData = [
  { name: 'Published', value: 42, color: '#22c55e' },
  { name: 'In Review', value: 8, color: '#3b82f6' },
  { name: 'Drafting', value: 5, color: '#f59e0b' },
  { name: 'Blocked', value: 2, color: '#ef4444' },
];

// Weekly coordination volume
const weeklyData = [
  { day: 'Mon', messages: 32, tasks: 8 },
  { day: 'Tue', messages: 28, tasks: 6 },
  { day: 'Wed', messages: 41, tasks: 9 },
  { day: 'Thu', messages: 35, tasks: 7 },
  { day: 'Fri', messages: 38, tasks: 11 },
  { day: 'Sat', messages: 15, tasks: 3 },
  { day: 'Sun', messages: 8, tasks: 2 },
];

// Activity feed
const activityFeed = [
  { id: 1, agent: 'Kaia', emoji: '✨', action: 'Published "Sleep Optimization for Athletes"', time: '12m ago', type: 'success' },
  { id: 2, agent: 'Renzo', emoji: '✍️', action: 'Submitted draft: "Looksmaxxing Guide pt.3"', time: '25m ago', type: 'info' },
  { id: 3, agent: 'Thea', emoji: '👁️', action: 'Approved Kaia\'s gut health outline', time: '38m ago', type: 'success' },
  { id: 4, agent: 'Badger', emoji: '🔧', action: 'Deployed v2.4.1 — dashboard hotfix', time: '1h ago', type: 'info' },
  { id: 5, agent: 'Quanta', emoji: '📊', action: 'Weekly engagement report ready', time: '1h ago', type: 'info' },
  { id: 6, agent: 'Reno', emoji: '📈', action: 'Flagged SOL dip — paused auto-trades', time: '2h ago', type: 'warning' },
  { id: 7, agent: 'Nova', emoji: '🚀', action: 'Scheduled 5 IG posts for this week', time: '2h ago', type: 'success' },
  { id: 8, agent: 'Aria', emoji: '🎵', action: 'Sent Michael\'s daily briefing', time: '3h ago', type: 'info' },
  { id: 9, agent: 'Greta', emoji: '🔬', action: 'Completed competitor content audit', time: '4h ago', type: 'success' },
  { id: 10, agent: 'Pixel', emoji: '🎨', action: 'Delivered 8 article thumbnails', time: '5h ago', type: 'success' },
];

// Pending deliverables
const pendingDeliverables = [
  { id: 1, title: 'Looksmaxxing Guide pt.3', owner: 'Renzo', status: 'review', due: 'Today', priority: 'high' },
  { id: 2, title: 'Weekly Engagement Report', owner: 'Quanta', status: 'ready', due: 'Today', priority: 'high' },
  { id: 3, title: 'Gut Health 101 Article', owner: 'Kaia', status: 'drafting', due: 'Mar 17', priority: 'medium' },
  { id: 4, title: 'Podcast Ep. 14 Edit', owner: 'Freq', status: 'queued', due: 'Mar 18', priority: 'medium' },
  { id: 5, title: 'Trading Week Summary', owner: 'Reno', status: 'drafting', due: 'Mar 17', priority: 'low' },
  { id: 6, title: 'Brand Style Guide v2', owner: 'Pixel', status: 'review', due: 'Mar 19', priority: 'low' },
];

function App() {
  const { isSignedIn: clerkSignedIn } = useAuth();
  const isSignedIn = SKIP_AUTH || clerkSignedIn;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!isSignedIn) {
    return (
      <div className="dashboard">
        <div className="not-signed-in">
          <h2>Please sign in to view this dashboard</h2>
        </div>
      </div>
    );
  }

  const workingCount = allAgents.filter(a => a.status === 'working').length;
  const onlineCount = allAgents.filter(a => a.status === 'online').length;
  const idleCount = allAgents.filter(a => a.status === 'idle').length;

  const statusLabel = (s) => {
    if (s === 'working') return 'Working';
    if (s === 'online') return 'Online';
    if (s === 'error') return 'Error';
    return 'Idle';
  };

  const statusColor = (s) => {
    if (s === 'working') return '#22c55e';
    if (s === 'online') return '#3b82f6';
    if (s === 'error') return '#ef4444';
    return '#555568';
  };

  const priorityColor = (p) => {
    if (p === 'high') return '#ef4444';
    if (p === 'medium') return '#f59e0b';
    return '#555568';
  };

  const deliverableStatusLabel = (s) => {
    if (s === 'review') return 'In Review';
    if (s === 'ready') return 'Ready';
    if (s === 'drafting') return 'Drafting';
    return 'Queued';
  };

  return (
    <div className="marty-dashboard">
      {/* Hero Header */}
      <header className="marty-hero">
        <div className="marty-hero-bg"></div>
        <div className="marty-hero-content">
          <div className="marty-profile">
            <div className="marty-avatar-wrap">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="marty-avatar-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="marty-avatar-fallback">
                <span>{agent.emoji}</span>
              </div>
              <div className="marty-status-dot"></div>
            </div>
            <div className="marty-profile-text">
              <h1>{agent.emoji} {agent.name}</h1>
              <p className="marty-role">{agent.role}</p>
              <p className="marty-telegram">{agent.telegram}</p>
            </div>
          </div>
          <div className="marty-hero-right">
            <div className="marty-team-summary">
              <div className="marty-summary-item">
                <span className="marty-summary-num working">{workingCount}</span>
                <span className="marty-summary-label">Working</span>
              </div>
              <div className="marty-summary-divider"></div>
              <div className="marty-summary-item">
                <span className="marty-summary-num online">{onlineCount}</span>
                <span className="marty-summary-label">Online</span>
              </div>
              <div className="marty-summary-divider"></div>
              <div className="marty-summary-item">
                <span className="marty-summary-num idle">{idleCount}</span>
                <span className="marty-summary-label">Idle</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* KPI Row */}
      <div className="marty-kpi-row">
        <div className="marty-kpi">
          <div className="marty-kpi-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Send size={20} />
          </div>
          <div className="marty-kpi-data">
            <span className="marty-kpi-label">Messages Today</span>
            <strong className="marty-kpi-value">{kpiData.messagesSent}</strong>
            <span className="marty-kpi-trend up">+12% vs avg</span>
          </div>
        </div>
        <div className="marty-kpi">
          <div className="marty-kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Target size={20} />
          </div>
          <div className="marty-kpi-data">
            <span className="marty-kpi-label">Tasks Delegated</span>
            <strong className="marty-kpi-value">{kpiData.tasksDelegated}</strong>
            <span className="marty-kpi-trend">This week</span>
          </div>
        </div>
        <div className="marty-kpi">
          <div className="marty-kpi-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
            <CheckCircle size={20} />
          </div>
          <div className="marty-kpi-data">
            <span className="marty-kpi-label">Tasks Completed</span>
            <strong className="marty-kpi-value">{kpiData.tasksCompleted}</strong>
            <span className="marty-kpi-trend up">83% completion</span>
          </div>
        </div>
        <div className="marty-kpi">
          <div className="marty-kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Radio size={20} />
          </div>
          <div className="marty-kpi-data">
            <span className="marty-kpi-label">Active Agents</span>
            <strong className="marty-kpi-value">{kpiData.activeAgents}<span className="marty-kpi-of">/12</span></strong>
            <span className="marty-kpi-trend">Sub-agents online</span>
          </div>
        </div>
      </div>

      {/* Team Status Grid — all 12 agents */}
      <div className="marty-section">
        <div className="marty-section-header">
          <h2><Users size={18} /> Team Status Overview</h2>
          <span className="marty-badge green">{workingCount + onlineCount} active</span>
        </div>
        <div className="marty-agents-grid">
          {allAgents.map(a => (
            <div key={a.name} className={`marty-agent-card ${a.status}`}>
              <div className="marty-agent-top">
                <span className="marty-agent-emoji">{a.emoji}</span>
                <div className="marty-agent-id">
                  <span className="marty-agent-name">{a.name}</span>
                  <span className="marty-agent-role">{a.role}</span>
                </div>
                <span className={`marty-agent-status ${a.status}`}>{statusLabel(a.status)}</span>
              </div>
              <div className="marty-agent-task">
                <Clock size={11} />
                <span>{a.currentTask}</span>
              </div>
              <div className="marty-agent-seen">Last active: {a.lastSeen}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts + Activity Row */}
      <div className="marty-mid-row">
        {/* Pipeline chart */}
        <div className="marty-card">
          <div className="marty-card-header">
            <h3><FileText size={16} /> Content Pipeline</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pipelineData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: '#aaa' }}>
                {pipelineData.map(entry => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="marty-legend">
            {pipelineData.map(s => (
              <div key={s.name} className="marty-legend-item">
                <span className="marty-legend-dot" style={{ backgroundColor: s.color }}></span>
                <span className="marty-legend-label">{s.name}</span>
                <span className="marty-legend-value">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly coordination chart */}
        <div className="marty-card">
          <div className="marty-card-header">
            <h3><Activity size={16} /> Weekly Coordination</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="day" stroke="#666" tick={{ fill: '#aaa', fontSize: 12 }} axisLine={{ stroke: '#333' }} label={{ value: 'Day', position: 'insideBottom', offset: -2, fill: '#aaa', fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fill: '#aaa', fontSize: 12 }} axisLine={{ stroke: '#333' }} label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 10, fill: '#aaa', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#aaa', paddingTop: '8px' }} iconType="circle" />
              <Bar dataKey="messages" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Messages" />
              <Bar dataKey="tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Feed + Pending Deliverables */}
      <div className="marty-bottom-row">
        {/* Activity Feed */}
        <div className="marty-section">
          <div className="marty-section-header">
            <h2><MessageSquare size={18} /> Recent Activity</h2>
            <span className="marty-badge blue">{activityFeed.length} events</span>
          </div>
          <div className="marty-feed">
            {activityFeed.map(item => (
              <div key={item.id} className={`marty-feed-item ${item.type}`}>
                <span className="marty-feed-emoji">{item.emoji}</span>
                <div className="marty-feed-content">
                  <span className="marty-feed-agent">{item.agent}</span>
                  <span className="marty-feed-action">{item.action}</span>
                </div>
                <span className="marty-feed-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Deliverables */}
        <div className="marty-section">
          <div className="marty-section-header">
            <h2><ClipboardList size={18} /> Pending Deliverables</h2>
            <span className="marty-badge orange">{pendingDeliverables.length} items</span>
          </div>
          <div className="marty-deliverables">
            {pendingDeliverables.map(d => (
              <div key={d.id} className={`marty-deliverable ${d.status}`}>
                <div className="marty-deliverable-main">
                  <span className="marty-deliverable-title">{d.title}</span>
                  <span className="marty-deliverable-owner"><Bot size={11} /> {d.owner}</span>
                </div>
                <div className="marty-deliverable-meta">
                  <span className={`marty-deliverable-status ${d.status}`}>{deliverableStatusLabel(d.status)}</span>
                  <span className="marty-deliverable-due">
                    <Calendar size={11} /> {d.due}
                  </span>
                  <span className="marty-deliverable-priority" style={{ color: priorityColor(d.priority) }}>
                    {d.priority === 'high' ? '!!!' : d.priority === 'medium' ? '!!' : '!'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="marty-actions-row">
        <div className="marty-section-header" style={{ marginBottom: '1rem' }}>
          <h2><Zap size={18} /> Quick Actions</h2>
        </div>
        <div className="marty-actions-grid">
          <button className="marty-action-btn blue">
            <Send size={18} />
            <span>Message Michael</span>
          </button>
          <button className="marty-action-btn purple">
            <Bot size={18} />
            <span>Spawn Agent</span>
          </button>
          <button className="marty-action-btn green">
            <ClipboardList size={18} />
            <span>Check Linear</span>
          </button>
          <button className="marty-action-btn orange">
            <Eye size={18} />
            <span>Review Queue</span>
          </button>
          <button className="marty-action-btn cyan">
            <TrendingUp size={18} />
            <span>View Analytics</span>
          </button>
          <button className="marty-action-btn red">
            <AlertCircle size={18} />
            <span>Escalate Issue</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="marty-footer">
        <span>Last synced: {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>•</span>
        <span>Marty Coordinator Dashboard</span>
        <span>•</span>
        <span>Built with Claude Opus 4.6</span>
      </footer>
    </div>
  );
}

export default App;
