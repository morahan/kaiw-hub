import { useState, useEffect } from 'react';
import { useAuth, UserButton } from '@clerk/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Zap, CheckCircle, Clock, Users, TrendingUp, Activity, MessageSquare, Bot } from 'lucide-react';
import './css/martyDashboard.css';

const agent = { 
  name: 'Marty', 
  emoji: '⚡', 
  role: 'Team Lead & Coordinator', 
  color: '#3b82f6',
  telegram: '@WorkoutMarty',
  avatar: 'https://t.me/i/userpic/320/Marty2126Bot.jpg'
};

const statusData = [
  { name: 'Completed', value: 45, color: '#22c55e' },
  { name: 'In Progress', value: 12, color: '#3b82f6' },
  { name: 'Blocked', value: 3, color: '#ef4444' },
  { name: 'Pending', value: 8, color: '#f59e0b' },
];

const weeklyActivity = [
  { day: 'Mon', tasks: 12, commits: 8 },
  { day: 'Tue', tasks: 15, commits: 12 },
  { day: 'Wed', tasks: 8, commits: 5 },
  { day: 'Thu', tasks: 18, commits: 14 },
  { day: 'Fri', tasks: 22, commits: 18 },
  { day: 'Sat', tasks: 5, commits: 3 },
  { day: 'Sun', tasks: 3, commits: 2 },
];

const recentTasks = [
  { id: 1, title: 'Review PR #142 - MediaPipe integration', status: 'done', assignee: 'Badger' },
  { id: 2, title: 'Agent sync - Q1 planning', status: 'done', assignee: 'All' },
  { id: 3, title: 'Deploy quanta-dashboard to Vercel', status: 'in-progress', assignee: 'Badger' },
  { id: 4, title: 'Setup kaiw.io hub', status: 'done', assignee: 'Badger' },
  { id: 5, title: 'Model switch script fix', status: 'blocked', assignee: 'Badger' },
];

const teamMembers = [
  { name: 'Aria', role: 'Personal Assistant', emoji: '🎵', status: 'online' },
  { name: 'Badger', role: 'Infrastructure', emoji: '🔧', status: 'online' },
  { name: 'Freq', role: 'Audio Engineer', emoji: '🎛️', status: 'online' },
  { name: 'Greta', role: 'Research', emoji: '🔬', status: 'away' },
  { name: 'Kaia', role: 'Content Creator', emoji: '✨', status: 'online' },
  { name: 'Reno', role: 'Trading Agent', emoji: '📈', status: 'online' },
  { name: 'Renzo', role: 'Writer', emoji: '✍️', status: 'online' },
  { name: 'Thea', role: 'Reviewer', emoji: '👁️', status: 'online' },
];

function App() {
  const { isSignedIn } = useAuth();
  const [tasks, setTasks] = useState(recentTasks);
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

  return (
    <>
    <div className="dashboard">
      {/* Hero Section with Profile */}
      <header className="hero-header" style={{ '--color': agent.color }}>
        <div className="hero-bg"></div>
        <div className="profile-section">
          <div className="avatar-container">
            <img 
              src={agent.avatar} 
              alt={`${agent.name} profile`} 
              className="profile-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="avatar-fallback">
              <span>{agent.emoji}</span>
            </div>
            <div className="status-indicator online"></div>
          </div>
          <div className="profile-info">
            <h1>{agent.name}</h1>
            <p className="role">{agent.role}</p>
            <p className="telegram">{agent.telegram}</p>
          </div>
        </div>
        <div className="header-actions">
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Zap size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Tasks</span>
            <strong className="stat-value">68</strong>
            <span className="stat-trend up">↑ 12 this week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Completed</span>
            <strong className="stat-value">45</strong>
            <span className="stat-trend up">↑ 8 this week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <Activity size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Blocked</span>
            <strong className="stat-value">3</strong>
            <span className="stat-trend">Needs attention</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Users size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Team Members</span>
            <strong className="stat-value">8</strong>
            <span className="stat-trend">Active agents</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Task Distribution</h3>
            <span className="chart-subtitle">Current sprint status</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a2e', 
                  border: '1px solid #333',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            {statusData.map(s => (
              <div key={s.name} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: s.color }}></span>
                <span className="legend-label">{s.name}</span>
                <span className="legend-value">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h3>Weekly Activity</h3>
            <span className="chart-subtitle">Tasks & commits per day</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyActivity} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#666" 
                tick={{ fill: '#888', fontSize: 12 }}
                axisLine={{ stroke: '#333' }}
              />
              <YAxis 
                stroke="#666" 
                tick={{ fill: '#888', fontSize: 12 }}
                axisLine={{ stroke: '#333' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a2e', 
                  border: '1px solid #333',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar 
                dataKey="tasks" 
                fill={agent.color} 
                radius={[6, 6, 0, 0]} 
                name="Tasks"
              />
              <Bar 
                dataKey="commits" 
                fill="#8b5cf6" 
                radius={[6, 6, 0, 0]}
                name="Commits"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team & Tasks Row */}
      <div className="bottom-row">
        <div className="section team-section">
          <div className="section-header">
            <h2><Users size={18} /> Team Status</h2>
            <span className="online-count">{teamMembers.filter(m => m.status === 'online').length} online</span>
          </div>
          <div className="team-grid">
            {teamMembers.map(member => (
              <div key={member.name} className={`team-member ${member.status}`}>
                <span className="member-avatar">{member.emoji}</span>
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-role">{member.role}</span>
                </div>
                <div className={`status-dot ${member.status}`}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="section tasks-section">
          <div className="section-header">
            <h2><MessageSquare size={18} /> Recent Tasks</h2>
            <span className="task-count}>{tasks.length} tasks</span>
          </div>
          <div className="task-list">
            {tasks.map(task => (
              <div key={task.id} className={`task-item ${task.status}`}>
                <div className="task-info">
                  <span className="task-title">{task.title}</span>
                  <span className="task-meta">
                    <Bot size={12} /> {task.assignee}
                  </span>
                </div>
                <span className={`status-badge ${task.status}`}>
                  {task.status === 'done' && <CheckCircle size={12} />}
                  {task.status === 'in-progress' && <Clock size={12} />}
                  {task.status === 'blocked' && <Activity size={12} />}
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <span>Last updated: {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>•</span>
        <span>Workout Flow Team</span>
      </footer>
    </div>
    </>
  );
}

export default App;
