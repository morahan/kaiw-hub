import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const API_BASE = '/api/quanta';

const LEVEL_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#3b82f6',
  info: '#06b6d4'
};

function AlertsDashboard() {
  const [summary, setSummary] = useState({ total: 0, critical: 0, high: 0, medium: 0, low: 0 });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set loading to true within 1 second of mount
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      if (loading) setLoading(true);
    }, 100);
    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    Promise.all([
      fetch(`${API_BASE}/alerts/summary`, { signal: controller.signal }).then(r => r.json()),
      fetch(`${API_BASE}/alerts/recent`, { signal: controller.signal }).then(r => r.json())
    ]).then(([summaryData, alertsData]) => {
      clearTimeout(timeoutId);
      
      // Handle the new schema: level instead of severity, detected_at instead of timestamp
      // Summary counts by level field
      const alerts = alertsData || [];
      
      // Calculate summary from alerts using level field
      const counts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
      alerts.forEach(alert => {
        const level = alert.level || 'info';
        if (counts.hasOwnProperty(level)) {
          counts[level]++;
        }
      });
      
      const processedSummary = {
        total: alerts.length,
        critical: counts.critical,
        high: counts.high,
        medium: counts.medium,
        low: counts.low
      };
      
      // Use existing summaryData if available, otherwise use calculated
      setSummary(summaryData || processedSummary);
      setAlerts(alerts);
      setLoading(false);
    }).catch(err => {
      clearTimeout(timeoutId);
      console.error('Failed to fetch:', err);
      setError(err.name === 'AbortError' ? 'Request timed out after 5 seconds' : 'Failed to load data');
      setLoading(false);
    });
    
    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return <div className="dashboard"><p>Loading alerts...</p></div>;
  }

  if (error && !alerts.length) {
    return (
      <div className="dashboard">
        <p className="error">Error: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  const pieData = [
    { name: 'Critical', count: summary.critical, color: LEVEL_COLORS.critical },
    { name: 'High', count: summary.high, color: LEVEL_COLORS.high },
    { name: 'Medium', count: summary.medium, color: LEVEL_COLORS.medium },
    { name: 'Low', count: summary.low, color: LEVEL_COLORS.low },
  ].filter(d => d.count > 0);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🚨 Alerts Dashboard</h1>
        <p>System anomalies and notifications</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card critical">
          <span className="stat-label">Critical</span>
          <span className="stat-value">{summary.critical}</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-label">High</span>
          <span className="stat-value">{summary.high}</span>
        </div>
        <div className="stat-card info">
          <span className="stat-label">Medium</span>
          <span className="stat-value">{summary.medium}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total</span>
          <span className="stat-value">{summary.total}</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Alerts by Level</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="count"
                nameKey="name"
                label={({name, count}) => `${name}: ${count}`}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pieData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis type="category" dataKey="name" stroke="#9ca3af" width={60} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-width">
          <h3>Recent Anomalies</h3>
          <div className="alerts-list">
            {alerts.length === 0 ? (
              <div className="alert-item info">
                <span className="alert-message">No recent anomalies</span>
              </div>
            ) : (
              alerts.slice(0, 15).map((alert, idx) => (
                <div key={alert.id || idx} className={`alert-item ${alert.level || 'info'}`}>
                  <span className={`severity-badge ${alert.level || 'info'}`}>
                    {alert.level || 'info'}
                  </span>
                  <span className="alert-message">
                    {alert.rule_name || alert.anomaly_type || alert.message || 'Unknown anomaly'}
                  </span>
                  <span className="alert-time">
                    {alert.detected_at?.slice(0, 16) || alert.timestamp?.slice(0, 16) || alert.date || ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertsDashboard;
