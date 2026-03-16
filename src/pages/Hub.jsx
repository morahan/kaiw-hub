import { Link } from 'react-router-dom';
import './Hub.css';

const agents = [
  { id: 'marty', name: 'Marty', emoji: '⚡', role: 'Team Lead', color: '#3b82f6', telegram: 'MartyFlowBot' },
  { id: 'thea', name: 'Thea', emoji: '🏛️', role: 'Brand Strategist', color: '#8b5cf6', telegram: 'TheaFlowBot' },
  { id: 'renzo', name: 'Renzo', emoji: '🔥', role: 'Content Engine', color: '#ef4444', telegram: 'RenzoFlowBot' },
  { id: 'kaia', name: 'Kaia', emoji: '🌊', role: 'Trend Hunter', color: '#06b6d4', telegram: 'KaiaFlowBot' },
  { id: 'badger', name: 'Badger', emoji: '🦡', role: 'Coding Agent', color: '#22c55e', telegram: 'BadgerFlowBot' },
  { id: 'greta', name: 'Greta', emoji: '📚', role: 'Task Master', color: '#f59e0b', telegram: 'GretaFlowBot' },
  { id: 'freq', name: 'Freq', emoji: '🎛️', role: 'Audio Engineer', color: '#ec4899', telegram: 'FreqFlowBot' },
  { id: 'quanta', name: 'Quanta', emoji: '⏱️', role: 'Data Analyst', color: '#14b8a6', telegram: 'QuantaWFBot' },
  { id: 'maverick', name: 'Maverick', emoji: '🚦', role: 'Resource Gatekeeper', color: '#f97316', telegram: 'MaverickFlowBot' },
  { id: 'reno', name: 'Reno', emoji: '📈', role: 'Investment Strategist', color: '#10b981', telegram: 'RenoFlowBot' },
  { id: 'aria', name: 'Aria', emoji: '🎵', role: 'Personal Assistant', color: '#a855f7', telegram: 'AriaFlowBot' },
  { id: 'buddy', name: 'Buddy', emoji: '🐕', role: 'Beta Agent', color: '#6366f1', telegram: 'BuddyFlowBot' },
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
            <div className="agent-avatar">
              <img 
                src={`https://t.me/i/userpic/120/${agent.telegram}.jpg`} 
                alt={agent.name}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              <div className="agent-emoji-fallback" style={{ display: 'none' }}>{agent.emoji}</div>
            </div>
            <div className="agent-name">{agent.name}</div>
            <div className="agent-role">{agent.role}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hub;
