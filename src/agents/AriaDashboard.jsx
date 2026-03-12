import { SignedIn, UserButton } from '@clerk/react';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

const agent = { name: 'Aria', emoji: '🎵', role: 'Personal Assistant', color: '#a855f7' };

const activityData = [
  { time: '00:00', messages: 0 },
  { time: '04:00', messages: 0 },
  { time: '08:00', messages: 12 },
  { time: '10:00', messages: 28 },
  { time: '12:00', messages: 45 },
  { time: '14:00', messages: 32 },
  { time: '16:00', messages: 55 },
  { time: '18:00', messages: 48 },
  { time: '20:00', messages: 22 },
  { time: '22:00', messages: 8 },
];

const recentActions = [
  { id: 1, action: 'Scheduled meeting with Renzo', time: '5m ago', type: 'schedule' },
  { id: 2, action: 'Sent reminder to Badger', time: '12m ago', type: 'reminder' },
  { id: 3, action: 'Created task for Thea', time: '25m ago', type: 'task' },
  { id: 4, action: 'Answered user query about Workout Flow', time: '32m ago', type: 'query' },
  { id: 5, action: 'Updated calendar for Marty', time: '1h ago', type: 'schedule' },
];

function App() {
  const [messages, setMessages] = useState([]);
  const [stats] = useState({ today: 254, week: 1820, pending: 5 });
  const [agentStatus, setAgentStatus] = useState([]);
  const [statusLoading, setStatusLoading] = useState(true);
  const [ouraData, setOuraData] = useState(null);
  const [ouraLoading, setOuraLoading] = useState(true);
  const [familyData, setFamilyData] = useState(null);
  const [familyLoading, setFamilyLoading] = useState(true);
  const [businessData, setBusinessData] = useState(null);
  const [businessLoading, setBusinessLoading] = useState(true);

  // Fetch Oura health data
  useEffect(() => {
    fetch('http://localhost:3001/api/oura')
      .then(res => res.json())
      .then(data => {
        setOuraData(data);
        setOuraLoading(false);
      })
      .catch(() => setOuraLoading(false));
  }, []);

  // Fetch real agent status
  useEffect(() => {
    fetch('http://localhost:3001/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgentStatus(data.agents || []);
        setStatusLoading(false);
      })
      .catch(() => setStatusLoading(false));
  }, []);

  // Fetch family data
  useEffect(() => {
    fetch('http://localhost:3001/api/family')
      .then(res => res.json())
      .then(data => {
        setFamilyData(data);
        setFamilyLoading(false);
      })
      .catch(() => setFamilyLoading(false));
  }, []);

  // Fetch business data
  useEffect(() => {
    fetch('http://localhost:3001/api/business')
      .then(res => res.json())
      .then(data => {
        setBusinessData(data);
        setBusinessLoading(false);
      })
      .catch(() => setBusinessLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prev => {
        const now = new Date();
        return [...prev.slice(-10), {
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          messages: Math.floor(Math.random() * 10),
        }];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <header style={{ '--color': agent.color }}>
        <span className="emoji">{agent.emoji}</span>
        <div>
          <h1>{agent.name}</h1>
          <p>{agent.role}</p>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat">
          <span>Messages Today</span>
          <strong>{stats.today}</strong>
          <span className="trend">↑ 12%</span>
        </div>
        <div className="stat">
          <span>This Week</span>
          <strong>{stats.week}</strong>
          <span className="trend positive">↑ 18%</span>
        </div>
        <div className="stat">
          <span>Pending Tasks</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className="stat">
          <span>Avg Response</span>
          <strong>1.2s</strong>
        </div>
      </div>

      {/* Oura Health Section */}
      <div className="section">
        <h2>💪 Health (Oura)</h2>
        {ouraLoading ? (
          <p style={{ color: '#666' }}>Loading health data...</p>
        ) : ouraData?.scores ? (
          <div className="stats-grid">
            <div className="stat" style={{ borderLeft: '3px solid #8b5cf6' }}>
              <span>Sleep Score</span>
              <strong style={{ color: ouraData.scores.sleep < 60 ? '#ef4444' : ouraData.scores.sleep < 80 ? '#eab308' : '#22c55e' }}>
                {ouraData.scores.sleep}
              </strong>
              <span className="trend">Deep: {ouraData.details.sleep.deep}m</span>
            </div>
            <div className="stat" style={{ borderLeft: '3px solid #10b981' }}>
              <span>Readiness</span>
              <strong style={{ color: ouraData.scores.readiness < 60 ? '#ef4444' : ouraData.scores.readiness < 80 ? '#eab308' : '#22c55e' }}>
                {ouraData.scores.readiness}
              </strong>
              <span className="trend">HRV: {ouraData.details.sleep.hrv}</span>
            </div>
            <div className="stat" style={{ borderLeft: '3px solid #f59e0b' }}>
              <span>Activity</span>
              <strong>{ouraData.scores.activity}</strong>
              <span className="trend">{ouraData.details.activity.steps.toLocaleString()} steps</span>
            </div>
            <div className="stat" style={{ borderLeft: '3px solid #ec4899' }}>
              <span>Resting HR</span>
              <strong>{ouraData.details.sleep.restingHR}</strong>
              <span className="trend">{ouraData.date}</span>
            </div>
          </div>
        ) : (
          <p style={{ color: '#666' }}>No health data available</p>
        )}
      </div>

      <div className="chart-card full-width">
        <h3>Message Activity (Today)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={messages.length ? messages : activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} />
            <Line type="monotone" dataKey="messages" stroke={agent.color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="section">
        <h2>📝 Recent Actions</h2>
        <div className="action-list">
          {recentActions.map(action => (
            <div key={action.id} className="action-item">
              <span className="action-text">{action.action}</span>
              <span className="action-time">{action.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Family Section */}
      <div className="section">
        <h2>👨‍👩‍👧‍👦 Family</h2>
        {familyLoading ? (
          <p style={{ color: '#666' }}>Loading family data...</p>
        ) : familyData?.family ? (
          <div className="family-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
            {Object.entries(familyData.family).map(([key, data]) => (
              <div key={key} className="family-card" style={{ 
                background: '#1a1a1a', 
                borderRadius: '12px', 
                padding: '12px',
                border: '1px solid #333'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ 
                    fontSize: '20px',
                    background: key === 'michael' ? '#a855f7' : key === 'melissa' ? '#e91e63' : key === 'elora' ? '#9c27b0' : key === 'iris' ? '#2196f3' : '#ff9800',
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#fff'
                  }}>
                    {key.charAt(0).toUpperCase()}
                  </span>
                  <strong style={{ textTransform: 'capitalize' }}>{key}</strong>
                </div>
                {data.birthday && (
                  <div style={{ fontSize: '12px', color: '#888' }}>🎂 {data.birthday}</div>
                )}
                {data.lastActivity && data.lastActivity !== 'unknown' && (
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                    Last: {data.lastActivity}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No family data available</p>
        )}
      </div>

      {/* Business Section */}
      <div className="section">
        <h2>💼 Business (Marty)</h2>
        {businessLoading ? (
          <p style={{ color: '#666' }}>Loading business data...</p>
        ) : businessData ? (
          <div>
            <div className="stats-grid">
              <div className="stat" style={{ borderLeft: '3px solid #f59e0b' }}>
                <span>Active Tasks</span>
                <strong>{businessData.metrics?.activeTasks || 0}</strong>
              </div>
              <div className="stat" style={{ borderLeft: '3px solid #3b82f6' }}>
                <span>Data Source</span>
                <strong style={{ fontSize: '14px' }}>{businessData.source || 'memory'}</strong>
              </div>
            </div>
            {businessData.topTasks?.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <h4 style={{ color: '#888', marginBottom: '8px' }}>Top Tasks</h4>
                {businessData.topTasks.map((task, i) => (
                  <div key={i} style={{ 
                    padding: '8px 12px', 
                    background: '#1a1a1a', 
                    borderRadius: '8px', 
                    marginBottom: '6px',
                    fontSize: '13px'
                  }}>
                    {task.title} <span style={{ color: '#666' }}>• {task.state}</span>
                  </div>
                ))}
              </div>
            )}
            {businessData.notes && (
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                {businessData.notes}
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No business data available</p>
        )}
      </div>

      <div className="section">
        <h2>🤖 Agent Status</h2>
        {statusLoading ? (
          <p style={{ color: '#666' }}>Loading agent status...</p>
        ) : (
          <div className="agent-grid">
            {agentStatus.map((a, i) => (
              <div key={i} className={`agent-card ${a.status}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: a.status === 'active' ? '#22c55e' : a.status === 'recent' ? '#3b82f6' : '#666',
                    display: 'inline-block'
                  }} />
                  <strong>{a.name}</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                  <span>{a.channel || 'unknown'}</span> • <span>{a.lastSeen}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="action-buttons">
          <button>New Task</button>
          <button>Send Reminder</button>
          <button>Schedule Meeting</button>
        </div>
      </div>
    </div>
  );
}

export default App;
