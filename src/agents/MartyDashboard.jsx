import { useState, useEffect } from 'react';
import { SignedIn, UserButton } from '@clerk/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './App.css';

const agent = { name: 'Marty', emoji: '⚡', role: 'Team Lead', color: '#3b82f6' };

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

function App() {
  const [tasks, setTasks] = useState(recentTasks);

  return (
    <SignedIn>
    <div className="dashboard">
      <header style={{ '--color': agent.color }}>
        <span className="emoji">{agent.emoji}</span>
        <div>
          <h1>{agent.name}</h1>
          <p>{agent.role}</p>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <div className="stats-grid">
        <div className="stat">
          <span>Active Tasks</span>
          <strong>68</strong>
          <span className="trend">↑ 12</span>
        </div>
        <div className="stat">
          <span>Completed (Week)</span>
          <strong>45</strong>
          <span className="trend positive">↑ 8</span>
        </div>
        <div className="stat">
          <span>Blocked</span>
          <strong>3</strong>
        </div>
        <div className="stat">
          <span>Team Members</span>
          <strong>11</strong>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Task Status</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            {statusData.map(s => (
              <div key={s.name} className="legend-item">
                <span style={{ backgroundColor: s.color }}></span>
                {s.name}: {s.value}
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <h3>Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} />
              <Bar dataKey="tasks" fill={agent.color} radius={[4, 4, 0, 0]} />
              <Bar dataKey="commits" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="section">
        <h2>📋 Recent Tasks</h2>
        <div className="task-list">
          {tasks.map(task => (
            <div key={task.id} className={`task-item ${task.status}`}>
              <div className="task-info">
                <span className="task-title">{task.title}</span>
                <span className="task-assignee">{task.assignee}</span>
              </div>
              <span className={`status-badge ${task.status}`}>{task.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </SignedIn>
  );
}

export default App;
