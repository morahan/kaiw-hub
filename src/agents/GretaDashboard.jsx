import { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import './css/gretaDashboard.css';

const agent = { name: 'Greta', emoji: '📚', role: 'Task Master / Librarian & Router', color: '#8b5cf6' };

const sparkData = {
  tasksRouted: [
    { v: 18 }, { v: 22 }, { v: 19 }, { v: 25 }, { v: 28 }, { v: 24 }, { v: 31 },
  ],
  successRate: [
    { v: 88 }, { v: 91 }, { v: 89 }, { v: 93 }, { v: 92 }, { v: 95 }, { v: 94 },
  ],
  filesManaged: [
    { v: 2100 }, { v: 2140 }, { v: 2190 }, { v: 2220 }, { v: 2270 }, { v: 2310 }, { v: 2341 },
  ],
  routingTime: [
    { v: 3.1 }, { v: 2.8 }, { v: 2.9 }, { v: 2.6 }, { v: 2.5 }, { v: 2.4 }, { v: 2.3 },
  ],
};

function MiniSparkline({ data, color }) {
  return (
    <div className="sparkline-wrap">
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${color.replace('#', '')})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function GretaDashboard() {
  const [metrics] = useState({
    tasksRouted: 147,
    taskSuccess: 94,
    filesManaged: 2341,
    agentsActive: 8,
    avgRoutingTime: 2.3,
    failureRate: 6,
  });

  const [filter, setFilter] = useState('all');

  const [taskRouting] = useState([
    { id: 1, from: 'Michael', task: 'Article Review', to: 'Thea', status: 'completed', time: '2m ago' },
    { id: 2, from: 'Aria', task: 'Trend Analysis', to: 'Reno', status: 'in-progress', time: '5m ago' },
    { id: 3, from: 'Michael', task: 'Dashboard Sprint', to: 'Subagent', status: 'in-progress', time: 'now' },
    { id: 4, from: 'Kaia', task: 'Content Creation', to: 'Multi-queue', status: 'completed', time: '1h ago' },
    { id: 5, from: 'Renzo', task: 'Asset Review', to: 'Thea', status: 'pending', time: '30m ago' },
  ]);

  const [agentRouting] = useState([
    { agent: 'Thea', tasks: 23, success: 22, avgTime: 4.2, health: 'healthy' },
    { agent: 'Reno', tasks: 19, success: 19, avgTime: 3.1, health: 'healthy' },
    { agent: 'Renzo', tasks: 18, success: 17, avgTime: 5.8, health: 'healthy' },
    { agent: 'Kaia', tasks: 22, success: 20, avgTime: 6.5, health: 'busy' },
    { agent: 'Aria', tasks: 25, success: 25, avgTime: 2.9, health: 'healthy' },
    { agent: 'Marty', tasks: 40, success: 39, avgTime: 2.4, health: 'healthy' },
  ]);

  const [fileLibrary] = useState([
    { category: 'Articles', count: 456, size: '234 MB' },
    { category: 'Media', count: 1203, size: '8.4 GB' },
    { category: 'Scripts', count: 287, size: '12 MB' },
    { category: 'Config', count: 156, size: '2.3 MB' },
    { category: 'Memory', count: 312, size: '45 MB' },
  ]);

  const getHealthColor = (health) => {
    return health === 'healthy' ? '#22c55e' : health === 'busy' ? '#f59e0b' : '#ef4444';
  };

  const getHealthLabel = (health) => {
    return health === 'healthy' ? 'Healthy' : health === 'busy' ? 'Busy' : 'Error';
  };

  const filteredTasks = filter === 'all'
    ? taskRouting
    : taskRouting.filter(t => t.status === filter);

  const successRate = Math.round((metrics.taskSuccess / metrics.tasksRouted) * 100);

  return (
    <div className="dashboard greta-dashboard">
      <header style={{ '--color': agent.color }}>
        <span className="emoji">{agent.emoji}</span>
        <div>
          <h1>{agent.name}</h1>
          <p>{agent.role}</p>
        </div>
      </header>

      {/* KPI Tiles — prominent */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Tasks Routed</span>
            <span className="kpi-trend up">+12%</span>
          </div>
          <div className="kpi-number">{metrics.tasksRouted}</div>
          <MiniSparkline data={sparkData.tasksRouted} color="#8b5cf6" />
          <div className="kpi-sub">{metrics.taskSuccess} successful</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Success Rate</span>
            <span className="kpi-trend up">+2.1%</span>
          </div>
          <div className="kpi-number" style={{ color: '#22c55e' }}>{successRate}%</div>
          <MiniSparkline data={sparkData.successRate} color="#22c55e" />
          <div className="kpi-sub">{metrics.failureRate}% failure rate</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Files Managed</span>
            <span className="kpi-trend up">+3.2%</span>
          </div>
          <div className="kpi-number">{metrics.filesManaged.toLocaleString()}</div>
          <MiniSparkline data={sparkData.filesManaged} color="#06b6d4" />
          <div className="kpi-sub">Across 5 categories</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Avg Routing Time</span>
            <span className="kpi-trend down">-0.3s</span>
          </div>
          <div className="kpi-number">{metrics.avgRoutingTime}s</div>
          <MiniSparkline data={sparkData.routingTime} color="#f59e0b" />
          <div className="kpi-sub">{metrics.agentsActive} agents active</div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="two-col">
        {/* Task Routing */}
        <div className="section task-section">
          <div className="section-header">
            <h2>Task Routing</h2>
            <div className="filter-tabs">
              {['all', 'completed', 'in-progress', 'pending'].map(f => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : f === 'in-progress' ? 'Active' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="routing-table">
            <div className="routing-header-row">
              <div className="routing-from">From</div>
              <div className="routing-task">Task</div>
              <div className="routing-to">To</div>
              <div className="routing-status-col">Status</div>
              <div className="routing-time">Time</div>
            </div>
            {filteredTasks.map(item => (
              <div key={item.id} className="routing-row">
                <div className="routing-from">{item.from}</div>
                <div className="routing-task">{item.task}</div>
                <div className="routing-to">{item.to}</div>
                <div className="routing-status-col">
                  <span className={`routing-badge ${item.status}`}>{item.status.replace('-', ' ')}</span>
                </div>
                <div className="routing-time">{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* File Library */}
        <div className="section file-section">
          <h2>File Library</h2>
          <div className="file-library">
            {fileLibrary.map((file, idx) => {
              const pct = Math.round((file.count / 2414) * 100);
              return (
                <div key={idx} className="file-row">
                  <div className="file-top">
                    <span className="file-category">{file.category}</span>
                    <span className="file-size">{file.size}</span>
                  </div>
                  <div className="file-bar-bg">
                    <div className="file-bar" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="file-count">{file.count.toLocaleString()} files</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agent Routing Decisions — full width */}
      <div className="section">
        <h2>Agent Routing Decisions</h2>
        <div className="agent-grid">
          {agentRouting.map(a => {
            const rate = Math.round((a.success / a.tasks) * 100);
            return (
              <div key={a.agent} className="agent-card">
                <div className="agent-header">
                  <div className="agent-name">{a.agent}</div>
                  <div className="agent-health-badge" style={{ background: getHealthColor(a.health) + '22', color: getHealthColor(a.health) }}>
                    <span className="health-dot" style={{ background: getHealthColor(a.health) }} />
                    {getHealthLabel(a.health)}
                  </div>
                </div>
                <div className="agent-kpi-row">
                  <div className="agent-kpi">
                    <span className="agent-kpi-val">{a.tasks}</span>
                    <span className="agent-kpi-label">Tasks</span>
                  </div>
                  <div className="agent-kpi">
                    <span className="agent-kpi-val" style={{ color: '#22c55e' }}>{rate}%</span>
                    <span className="agent-kpi-label">Success</span>
                  </div>
                  <div className="agent-kpi">
                    <span className="agent-kpi-val">{a.avgTime}s</span>
                    <span className="agent-kpi-label">Avg Time</span>
                  </div>
                </div>
                <div className="agent-bar-bg">
                  <div className="agent-bar" style={{ width: `${rate}%`, background: getHealthColor(a.health) }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="greta-footer">
        Built with Claude Opus 4.6
      </footer>
    </div>
  );
}

export default GretaDashboard;
