import { useState, useEffect } from 'react';
import './AriaDashboard.css';

function AriaDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from the personal dashboard API
    fetch('http://localhost:3001/api/health')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="aria-dashboard">
        <div className="aria-loading">
          <div className="loading-spinner"></div>
          <p>Loading Aria's dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aria-dashboard">
      <header className="aria-header">
        <h1>🎵 Aria's Dashboard</h1>
        <p className="aria-subtitle">Michael's personal life assistant</p>
      </header>

      <div className="aria-grid">
        {/* Health Section */}
        <div className="aria-card health-card">
          <div className="card-header">
            <span className="card-icon">🫀</span>
            <h2>Health</h2>
          </div>
          {data?.oura ? (
            <div className="stat-row">
              <div className="stat">
                <span className="stat-value">{data.oura.sleepScore}</span>
                <span className="stat-label">Sleep Score</span>
              </div>
              <div className="stat">
                <span className="stat-value">{data.oura.readiness}</span>
                <span className="stat-label">Readiness</span>
              </div>
              <div className="stat">
                <span className="stat-value">{data.oura.hrv}</span>
                <span className="stat-label">HRV</span>
              </div>
            </div>
          ) : (
            <p className="no-data">Oura not connected</p>
          )}
        </div>

        {/* Family Section */}
        <div className="aria-card family-card">
          <div className="card-header">
            <span className="card-icon">👨‍👩‍👧‍👦</span>
            <h2>Family</h2>
          </div>
          {data?.family ? (
            <div className="family-list">
              {data.family.map(member => (
                <div key={member.name} className="family-member">
                  <span className="member-emoji">{member.emoji}</span>
                  <span className="member-name">{member.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No family data</p>
          )}
        </div>

        {/* Weather Section */}
        <div className="aria-card weather-card">
          <div className="card-header">
            <span className="card-icon">🌤️</span>
            <h2>Weather</h2>
          </div>
          {data?.weather ? (
            <div className="weather-info">
              <span className="temp">{data.weather.temperature}°F</span>
              <span className="condition">{data.weather.condition}</span>
            </div>
          ) : (
            <p className="no-data">Weather unavailable</p>
          )}
        </div>

        {/* Business Section */}
        <div className="aria-card business-card">
          <div className="card-header">
            <span className="card-icon">📊</span>
            <h2>Business</h2>
          </div>
          {data?.business ? (
            <div className="business-info">
              <span className="task-count">{data.business.activeTasks} active</span>
              <span className="project-name">{data.business.project}</span>
            </div>
          ) : (
            <p className="no-data">Business data unavailable</p>
          )}
        </div>

        {/* Agents Section */}
        <div className="aria-card agents-card">
          <div className="card-header">
            <span className="card-icon">🤖</span>
            <h2>Agents</h2>
          </div>
          {data?.agents ? (
            <div className="agents-info">
              <span className="agent-count">{data.agents.total} total</span>
              <span className="active-agents">{data.agents.active} active</span>
            </div>
          ) : (
            <p className="no-data">Agents unavailable</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="aria-card actions-card">
          <div className="card-header">
            <span className="card-icon">⚡</span>
            <h2>Quick Actions</h2>
          </div>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => window.open('https://t.me/AriaFlowBot', '_blank')}>
              💬 Chat with Aria
            </button>
            <button className="action-btn" onClick={() => window.open('https://kaiw.io', '_blank')}>
              �Dashboard
            </button>
          </div>
        </div>
      </div>

      <footer className="aria-footer">
        <p>Powered by Aria • Michael's personal AI assistant</p>
      </footer>
    </div>
  );
}

export default AriaDashboard;
