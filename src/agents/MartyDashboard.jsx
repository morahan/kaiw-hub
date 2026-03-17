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
  { name: 'Marty', role: 'Coordinator', emoji: '⚡', status: 'working', color: '#3b82f6', currentTask: 'Heartbeat updated Mar 16 · 4:21 PM', lastSeen: 'Mar 16 4:21 PM' },
  { name: 'Main', role: 'Primary Session', emoji: '🧠', status: 'working', color: '#2563eb', currentTask: '52 sessions logged on Mar 16', lastSeen: 'Mar 16' },
  { name: 'Aria', role: 'Personal Assistant', emoji: '🎵', status: 'working', color: '#06b6d4', currentTask: '52 sessions logged on Mar 16', lastSeen: 'Mar 16' },
  { name: 'Renzo', role: 'Writer', emoji: '✍️', status: 'working', color: '#f97316', currentTask: '14 sessions logged on Mar 16', lastSeen: 'Mar 16' },
  { name: 'Freq', role: 'Audio Engineer', emoji: '🎛️', status: 'working', color: '#14b8a6', currentTask: '11 sessions logged on Mar 16', lastSeen: 'Mar 16' },
  { name: 'Reno', role: 'Trading Analyst', emoji: '📈', status: 'working', color: '#eab308', currentTask: '9 sessions logged on Mar 16', lastSeen: 'Mar 16' },
  { name: 'Maverick', role: 'Resource Guard', emoji: '🛡️', status: 'working', color: '#10b981', currentTask: '7 sessions logged on Mar 16', lastSeen: 'Mar 16' },
  { name: 'Thea', role: 'Reviewer', emoji: '👁️', status: 'working', color: '#a855f7', currentTask: '7 sessions logged on Mar 16', lastSeen: 'Mar 16' },
  { name: 'Kaia', role: 'Trend Analyst', emoji: '✨', status: 'working', color: '#ec4899', currentTask: '6 sessions logged on Mar 16', lastSeen: 'Mar 16' },
  { name: 'Quanta', role: 'Data Analyst', emoji: '📊', status: 'working', color: '#22d3ee', currentTask: '6 sessions logged on Mar 16', lastSeen: 'Mar 16' },
  { name: 'Badger', role: 'Infrastructure & DevOps', emoji: '🔧', status: 'online', color: '#84cc16', currentTask: '5 sessions logged on Mar 16', lastSeen: 'Mar 16' },
  { name: 'Greta', role: 'Research Analyst', emoji: '🔬', status: 'online', color: '#6366f1', currentTask: '4 sessions logged on Mar 16', lastSeen: 'Mar 16' },
  { name: 'Rocio', role: 'Comms', emoji: '📣', status: 'online', color: '#f43f5e', currentTask: '4 sessions logged on Mar 16', lastSeen: 'Mar 16' },
];

// KPI data
const kpiData = {
  messagesSent: 586,
  tasksDelegated: 19,
  tasksCompleted: 18,
  activeAgents: allAgents.filter(a => a.status === 'working' || a.status === 'online').length,
};

// Pipeline status
const pipelineData = [
  { name: 'Done', value: 18, color: '#22c55e' },
  { name: 'In Progress', value: 1, color: '#3b82f6' },
];

// Weekly coordination volume
const weeklyData = [
  { day: 'Feb 26', messages: 85, tasks: 0 },
  { day: 'Feb 27', messages: 82, tasks: 0 },
  { day: 'Feb 28', messages: 83, tasks: 4 },
  { day: 'Mar 1', messages: 94, tasks: 4 },
  { day: 'Mar 2', messages: 75, tasks: 2 },
  { day: 'Mar 3', messages: 80, tasks: 1 },
  { day: 'Mar 4', messages: 25, tasks: 0 },
];

// Activity feed
const activityFeed = [
  { id: 1, agent: 'Marty', emoji: '⚡', action: 'Heartbeat note logged: BTC exit signal fired (+1.6%) and 6 unpublished Notion articles flagged', time: 'Mar 16', type: 'info' },
  { id: 2, agent: 'Quanta', emoji: '📊', action: '18 of 19 task-registry items marked done; 1 remains in progress', time: 'Mar 3', type: 'success' },
  { id: 3, agent: 'Quanta', emoji: '📊', action: '201 delivered messages sent to Marty in the coordination graph', time: 'Feb 26-Mar 4', type: 'success' },
  { id: 4, agent: 'Reno', emoji: '📈', action: 'Handled 175 Marty coordination messages round-trip', time: 'Feb 26-Mar 4', type: 'info' },
  { id: 5, agent: 'Marty', emoji: '⚡', action: '11 heartbeat cycles tracked with 7 successful completions', time: 'Feb 28-Mar 3', type: 'warning' },
  { id: 6, agent: 'Aria', emoji: '🎵', action: '899 total sessions tracked; 52 sessions on Mar 16', time: 'Mar 16', type: 'info' },
];

// Pending deliverables
const pendingDeliverables = [
  { id: 1, title: 'Real-time Cost Attribution by Task', owner: 'Quanta', status: 'in_progress', due: '—', priority: null },
  { id: 2, title: 'Dashboard v2', owner: 'Quanta', status: 'done', due: '—', priority: null },
  { id: 3, title: 'Anomaly Detection', owner: 'Quanta', status: 'done', due: '—', priority: null },
  { id: 4, title: 'Agent Scorecard v2', owner: 'Quanta', status: 'done', due: '—', priority: null },
  { id: 5, title: 'Performance Profiler', owner: 'Quanta', status: 'done', due: '—', priority: null },
  { id: 6, title: 'Daily Briefing', owner: 'Quanta', status: 'done', due: '—', priority: null },
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
    if (!p) return '#555568';
    if (p === 'high') return '#ef4444';
    if (p === 'medium') return '#f59e0b';
    return '#555568';
  };

  const deliverableStatusLabel = (s) => {
    if (s === 'done') return 'Done';
    if (s === 'in_progress') return 'In Progress';
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
            <span className="marty-kpi-label">Messages Routed</span>
            <strong className="marty-kpi-value">{kpiData.messagesSent}</strong>
            <span className="marty-kpi-trend up">586 tracked deliveries</span>
          </div>
        </div>
        <div className="marty-kpi">
          <div className="marty-kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Target size={20} />
          </div>
          <div className="marty-kpi-data">
            <span className="marty-kpi-label">Tracked Tasks</span>
            <strong className="marty-kpi-value">{kpiData.tasksDelegated}</strong>
            <span className="marty-kpi-trend">Task registry total</span>
          </div>
        </div>
        <div className="marty-kpi">
          <div className="marty-kpi-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
            <CheckCircle size={20} />
          </div>
          <div className="marty-kpi-data">
            <span className="marty-kpi-label">Tasks Completed</span>
            <strong className="marty-kpi-value">{kpiData.tasksCompleted}</strong>
            <span className="marty-kpi-trend up">18/19 complete</span>
          </div>
        </div>
        <div className="marty-kpi">
          <div className="marty-kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Radio size={20} />
          </div>
          <div className="marty-kpi-data">
            <span className="marty-kpi-label">Active Agents</span>
            <strong className="marty-kpi-value">{kpiData.activeAgents}<span className="marty-kpi-of">/{allAgents.length}</span></strong>
            <span className="marty-kpi-trend">Latest Mar 16 activity</span>
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
              <Bar dataKey="tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Heartbeats" />
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
                    {d.priority === 'high' ? '!!!' : d.priority === 'medium' ? '!!' : d.priority === 'low' ? '!' : '—'}
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
