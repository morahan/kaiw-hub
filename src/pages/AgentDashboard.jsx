import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MartyDashboard from '../agents/MartyDashboard';
import TheaDashboard from '../agents/TheaDashboard';
import RenzoDashboard from '../agents/RenzoDashboard';
import KaiaDashboard from '../agents/KaiaDashboard';
import BadgerDashboard from '../agents/BadgerDashboard';
import GretaDashboard from '../agents/GretaDashboard';
import FreqDashboard from '../agents/FreqDashboard';
import QuantaDashboard from '../agents/QuantaDashboard';
import MaverickDashboard from '../agents/MaverickDashboard';
import RenoDashboard from '../agents/RenoDashboard';
import AriaDashboard from '../agents/AriaDashboard';
import BuddyDashboard from '../agents/BuddyDashboard';
import './AgentDashboard.css';

const agentMeta = {
  marty: { name: 'Marty', emoji: '⚡', role: 'Team Lead', color: '#3b82f6' },
  thea: { name: 'Thea', emoji: '🏛️', role: 'Brand Strategist', color: '#8b5cf6' },
  renzo: { name: 'Renzo', emoji: '🔥', role: 'Content Engine', color: '#ef4444' },
  kaia: { name: 'Kaia', emoji: '🌊', role: 'Trend Hunter', color: '#06b6d4' },
  badger: { name: 'Badger', emoji: '🦡', role: 'Coding Agent', color: '#22c55e' },
  greta: { name: 'Greta', emoji: '📚', role: 'Task Master', color: '#f59e0b' },
  freq: { name: 'Freq', emoji: '🎛️', role: 'Audio Engineer', color: '#ec4899' },
  quanta: { name: 'Quanta', emoji: '⏱️', role: 'Data Analyst', color: '#14b8a6' },
  maverick: { name: 'Maverick', emoji: '🚦', role: 'Resource Gatekeeper', color: '#f97316' },
  reno: { name: 'Reno', emoji: '📈', role: 'Investment Strategist', color: '#10b981' },
  aria: { name: 'Aria', emoji: '🎵', role: 'Personal Assistant', color: '#a855f7' },
  buddy: { name: 'Buddy', emoji: '🐕', role: 'Beta Agent', color: '#6366f1' },
};

const dashboards = {
  marty: MartyDashboard,
  thea: TheaDashboard,
  renzo: RenzoDashboard,
  kaia: KaiaDashboard,
  badger: BadgerDashboard,
  greta: GretaDashboard,
  freq: FreqDashboard,
  quanta: QuantaDashboard,
  maverick: MaverickDashboard,
  reno: RenoDashboard,
  aria: AriaDashboard,
  buddy: BuddyDashboard,
};

function AgentDashboard() {
  const { agent } = useParams();
  const navigate = useNavigate();
  const meta = agentMeta[agent];
  const DashboardComponent = dashboards[agent];

  if (!meta) {
    return (
      <div className="agent-dashboard">
        <div className="not-found">
          <h2>Agent not found</h2>
          <button onClick={() => navigate('/')}>Back to Hub</button>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-dashboard">
      <header className="agent-header" style={{ '--agent-color': meta.color }}>
        <button className="back-btn" onClick={() => navigate('/')}>← Hub</button>
        <div className="agent-info">
          <span className="agent-emoji">{meta.emoji}</span>
          <div>
            <h1>{meta.name}</h1>
            <p>{meta.role}</p>
          </div>
        </div>
      </header>
      <div className="agent-content">
        {DashboardComponent ? <DashboardComponent /> : <ComingSoon agent={meta.name} />}
      </div>
    </div>
  );
}

function ComingSoon({ agent }) {
  return (
    <div className="coming-soon">
      <h2>🚧 {agent}'s Dashboard</h2>
      <p>Coming soon! This agent's custom dashboard is under construction.</p>
    </div>
  );
}

export default AgentDashboard;
