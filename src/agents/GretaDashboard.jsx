import { useState } from 'react';
import './css/gretaDashboard.css';

const agent = { name: 'Greta', emoji: '📚', role: 'Task Master / Librarian & Router', color: '#8b5cf6' };

function GretaDashboard() {
  const [metrics] = useState({
    tasksRouted: 147,
    taskSuccess: 94,
    filesManaged: 2341,
    agentsActive: 8,
    avgRoutingTime: 2.3,
    failureRate: 6,
  });

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

  return (
    <div className="dashboard greta-dashboard">
      <header style={{ '--color': agent.color }}>
        <span className="emoji">{agent.emoji}</span>
        <div>
          <h1>{agent.name}</h1>
          <p>{agent.role}</p>
        </div>
      </header>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Tasks Routed</div>
          <div className="metric-value">{metrics.tasksRouted}</div>
          <div className="metric-subtext">{metrics.taskSuccess} successful</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Success Rate</div>
          <div className="metric-value">{Math.round((metrics.taskSuccess / metrics.tasksRouted) * 100)}%</div>
          <div className="metric-subtext">{metrics.failureRate}% failed</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Files Managed</div>
          <div className="metric-value">{metrics.filesManaged}</div>
          <div className="metric-subtext">Across 5 categories</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Routing Time</div>
          <div className="metric-value">{metrics.avgRoutingTime}s</div>
          <div className="metric-subtext">{metrics.agentsActive} agents active</div>
        </div>
      </div>

      {/* Task Routing */}
      <div className="section">
        <div className="section-header">
          <h2>Task Routing (Recent)</h2>
          <span className="count">{taskRouting.length}</span>
        </div>
        <div className="routing-table">
          {taskRouting.map(item => (
            <div key={item.id} className="routing-row">
              <div className="routing-from">{item.from}</div>
              <div className="routing-arrow">→</div>
              <div className="routing-task">{item.task}</div>
              <div className="routing-arrow">→</div>
              <div className="routing-to">{item.to}</div>
              <div className={`routing-badge ${item.status}`}>{item.status}</div>
              <div className="routing-time">{item.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Routing Decisions */}
      <div className="section">
        <h2>Agent Routing Decisions</h2>
        <div className="agent-grid">
          {agentRouting.map(agent => (
            <div key={agent.agent} className="agent-card">
              <div className="agent-header">
                <div className="agent-name">{agent.agent}</div>
                <div className="agent-health" style={{ color: getHealthColor(agent.health) }}>●</div>
              </div>
              <div className="agent-stats">
                <div className="agent-stat">
                  <span className="stat-label">Tasks</span>
                  <span className="stat-value">{agent.tasks}</span>
                </div>
                <div className="agent-stat">
                  <span className="stat-label">Success</span>
                  <span className="stat-value" style={{ color: '#22c55e' }}>
                    {agent.success}/{agent.tasks}
                  </span>
                </div>
                <div className="agent-stat">
                  <span className="stat-label">Avg Time</span>
                  <span className="stat-value">{agent.avgTime}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Library */}
      <div className="section">
        <h2>File Library</h2>
        <div className="file-library">
          {fileLibrary.map((file, idx) => (
            <div key={idx} className="file-row">
              <div className="file-category">{file.category}</div>
              <div className="file-count">{file.count} files</div>
              <div className="file-size">{file.size}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GretaDashboard;

