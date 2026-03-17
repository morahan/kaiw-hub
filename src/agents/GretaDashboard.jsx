import { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import './css/gretaDashboard.css';

const agent = { name: 'Greta', emoji: '📚', role: 'Task Master / Librarian & Router', color: '#8b5cf6' };

const sparkData = {
  completedTasks: [{ v: 2 }, { v: 3 }],
  completionRate: [{ v: 100 }, { v: 100 }],
  filesManaged: [{ v: 11 }, { v: 4 }, { v: 10 }, { v: 185 }, { v: 3 }, { v: 13 }, { v: 15 }, { v: 132 }],
  cycleTime: [{ v: 5 }, { v: 4 }],
};

const metrics = {
  completedTasks: 5,
  completionRate: 100,
  filesManaged: 373,
  categoriesTracked: 8,
  avgCycleTime: 4.5,
  heartbeatsCompleted: 2,
  agentsTracked: 10,
};

const taskRouting = [
  { id: 1, from: 'HB-62', task: 'Linear query caching', to: 'cache', status: 'completed', time: '2026-03-09' },
  { id: 2, from: 'HB-62', task: 'Clarity fixer analyzer', to: 'reports', status: 'completed', time: '2026-03-09' },
  { id: 3, from: 'HB-63', task: 'Heartbeat state dashboard', to: 'state', status: 'completed', time: '2026-03-09' },
  { id: 4, from: 'HB-63', task: 'Task deduplication system', to: 'memory', status: 'completed', time: '2026-03-09' },
  { id: 5, from: 'HB-63', task: 'Capability matcher', to: 'scripts', status: 'completed', time: '2026-03-09' },
  { id: 6, from: 'Health report', task: 'Remove stale EXP-101 heartbeat entry', to: 'heartbeat-state-v2.md', status: 'pending', time: '2026-03-09' },
  { id: 7, from: 'Task master', task: 'Re-enable triage cron with v2 prompt + haiku model', to: 'Marty', status: 'pending', time: '2026-03-01' },
];

const agentRouting = [
  { agent: 'Marty', tasks: 18, share: 18, avgTime: '—', health: 'recorded' },
  { agent: 'Renzo', tasks: 15, share: 15, avgTime: '—', health: 'recorded' },
  { agent: 'Badger', tasks: 12, share: 12, avgTime: '—', health: 'recorded' },
  { agent: 'Aria', tasks: 11, share: 11, avgTime: '—', health: 'recorded' },
  { agent: 'Kaia', tasks: 10, share: 10, avgTime: '—', health: 'recorded' },
  { agent: 'Thea', tasks: 9, share: 9, avgTime: '—', health: 'recorded' },
  { agent: 'Reno', tasks: 8, share: 8, avgTime: '—', health: 'recorded' },
  { agent: 'Freq', tasks: 7, share: 7, avgTime: '—', health: 'recorded' },
  { agent: 'Quanta', tasks: 6, share: 6, avgTime: '—', health: 'recorded' },
  { agent: 'Maverick', tasks: 5, share: 5, avgTime: '—', health: 'recorded' },
];

const fileLibrary = [
  { category: 'Memory', count: 185, size: '3.57 MB' },
  { category: 'Scripts', count: 132, size: '1.37 MB' },
  { category: 'Cache', count: 11, size: '59.34 MB' },
  { category: 'Reports', count: 10, size: '153.62 KB' },
  { category: 'Docs', count: 15, size: '91.54 KB' },
  { category: 'Logs', count: 13, size: '275.30 KB' },
  { category: 'Health Reports', count: 4, size: '3.29 KB' },
  { category: 'State', count: 3, size: '30.19 KB' },
];

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
  const [filter, setFilter] = useState('all');

  const getHealthColor = (health) => {
    return health === 'recorded' ? '#64748b' : '#64748b';
  };

  const getHealthLabel = () => 'Recorded';

  const filteredTasks = filter === 'all'
    ? taskRouting
    : taskRouting.filter((task) => task.status === filter);

  return (
    <div className="dashboard greta-dashboard">
      <header style={{ '--color': agent.color }}>
        <span className="emoji">{agent.emoji}</span>
        <div>
          <h1>{agent.name}</h1>
          <p>{agent.role}</p>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Completed Tasks</span>
            <span className="kpi-trend up">HB-62/63</span>
          </div>
          <div className="kpi-number">{metrics.completedTasks}</div>
          <MiniSparkline data={sparkData.completedTasks} color="#8b5cf6" />
          <div className="kpi-sub">{metrics.heartbeatsCompleted} heartbeats completed</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Completion Rate</span>
            <span className="kpi-trend up">0 stale</span>
          </div>
          <div className="kpi-number" style={{ color: '#22c55e' }}>{metrics.completionRate}%</div>
          <MiniSparkline data={sparkData.completionRate} color="#22c55e" />
          <div className="kpi-sub">5 of 5 tracked tasks completed</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Files Managed</span>
            <span className="kpi-trend up">8 categories</span>
          </div>
          <div className="kpi-number">{metrics.filesManaged.toLocaleString()}</div>
          <MiniSparkline data={sparkData.filesManaged} color="#06b6d4" />
          <div className="kpi-sub">Cache, reports, memory, state, logs, docs, scripts</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Avg Cycle Time</span>
            <span className="kpi-trend down">HB summary</span>
          </div>
          <div className="kpi-number">{metrics.avgCycleTime}m</div>
          <MiniSparkline data={sparkData.cycleTime} color="#f59e0b" />
          <div className="kpi-sub">{metrics.agentsTracked} agents tracked in workspace summary</div>
        </div>
      </div>

      <div className="two-col">
        <div className="section task-section">
          <div className="section-header">
            <h2>Task Routing</h2>
            <div className="filter-tabs">
              {['all', 'completed', 'in-progress', 'pending'].map((status) => (
                <button
                  key={status}
                  className={`filter-btn ${filter === status ? 'active' : ''}`}
                  onClick={() => setFilter(status)}
                >
                  {status === 'all' ? 'All' : status === 'in-progress' ? 'Active' : status.charAt(0).toUpperCase() + status.slice(1)}
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
            {filteredTasks.map((item) => (
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

        <div className="section file-section">
          <h2>File Library</h2>
          <div className="file-library">
            {fileLibrary.map((file, idx) => {
              const pct = Math.round((file.count / metrics.filesManaged) * 100);
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

      <div className="section">
        <h2>Agent Work Distribution</h2>
        <div className="agent-grid">
          {agentRouting.map((item) => (
            <div key={item.agent} className="agent-card">
              <div className="agent-header">
                <div className="agent-name">{item.agent}</div>
                <div
                  className="agent-health-badge"
                  style={{ background: `${getHealthColor(item.health)}22`, color: getHealthColor(item.health) }}
                >
                  <span className="health-dot" style={{ background: getHealthColor(item.health) }} />
                  {getHealthLabel(item.health)}
                </div>
              </div>
              <div className="agent-kpi-row">
                <div className="agent-kpi">
                  <span className="agent-kpi-val">{item.tasks}</span>
                  <span className="agent-kpi-label">Entries</span>
                </div>
                <div className="agent-kpi">
                  <span className="agent-kpi-val" style={{ color: '#22c55e' }}>{item.share}%</span>
                  <span className="agent-kpi-label">Share</span>
                </div>
                <div className="agent-kpi">
                  <span className="agent-kpi-val">{item.avgTime}</span>
                  <span className="agent-kpi-label">Avg Time</span>
                </div>
              </div>
              <div className="agent-bar-bg">
                <div className="agent-bar" style={{ width: `${item.share}%`, background: getHealthColor(item.health) }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="greta-footer">
        Built from workspace-greta reports, state metrics, and file inventory
      </footer>
    </div>
  );
}

export default GretaDashboard;
