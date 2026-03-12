import { Link } from 'react-router-dom';
import './Hub.css';

const agents = [
  { id: 'marty', name: 'Marty', emoji: '⚡', role: 'Team Lead', color: '#3b82f6' },
  { id: 'thea', name: 'Thea', emoji: '🏛️', role: 'Brand Strategist', color: '#8b5cf6' },
  { id: 'renzo', name: 'Renzo', emoji: '🔥', role: 'Content Engine', color: '#ef4444' },
  { id: 'kaia', name: 'Kaia', emoji: '🌊', role: 'Trend Hunter', color: '#06b6d4' },
  { id: 'badger', name: 'Badger', emoji: '🦡', role: 'Coding Agent', color: '#22c55e' },
  { id: 'greta', name: 'Greta', emoji: '📚', role: 'Task Master', color: '#f59e0b' },
  { id: 'freq', name: 'Freq', emoji: '🎛️', role: 'Audio Engineer', color: '#ec4899' },
  { id: 'quanta', name: 'Quanta', emoji: '⏱️', role: 'Data Analyst', color: '#14b8a6' },
  { id: 'maverick', name: 'Maverick', emoji: '🚦', role: 'Resource Gatekeeper', color: '#f97316' },
  { id: 'reno', name: 'Reno', emoji: '📈', role: 'Investment Strategist', color: '#10b981' },
  { id: 'aria', name: 'Aria', emoji: '🎵', role: 'Personal Assistant', color: '#a855f7' },
  { id: 'buddy', name: 'Buddy', emoji: '🐕', role: 'Beta Agent', color: '#6366f1' },
];

function Hub() {
  return (
    <div className="hub">
      <header className="hub-header">
        <h1>⚡ kaiw.io</h1>
        <p>Agent Dashboard Hub</p>
      </header>

      <div className="agents-grid">
        {agents.map(agent => (
          <Link key={agent.id} to={`/${agent.id}`} className="agent-card" style={{ '--agent-color': agent.color }}>
            <div className="agent-emoji">{agent.emoji}</div>
            <div className="agent-name">{agent.name}</div>
            <div className="agent-role">{agent.role}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hub;
