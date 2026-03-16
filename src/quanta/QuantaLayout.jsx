import { Link, useLocation } from 'react-router-dom';
import './QuantaLayout.css';

function QuantaLayout({ children }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/quanta', label: 'Overview', icon: '◉' },
    { path: '/quanta/now', label: 'Now', icon: '◐' },
    { path: '/quanta/tokens', label: 'Tokens', icon: '◈' },
    { path: '/quanta/costs', label: 'Costs', icon: '$' },
    { path: '/quanta/models', label: 'Models', icon: '◉' },
    { path: '/quanta/gpu', label: 'GPU', icon: '⚡' },
    { path: '/quanta/analytics', label: 'Analytics', icon: '◈' },
    { path: '/quanta/system', label: 'System', icon: '◉' },
    { path: '/quanta/alerts', label: 'Alerts', icon: '◈' },
  ];

  return (
    <div className="quanta-layout">
      <aside className="quanta-sidebar">
        <div className="quanta-sidebar-header">
          <a href="/" className="quanta-back-link">← kaiw.io</a>
          <div className="quanta-logo">
            <span className="quanta-logo-icon">⏱</span>
            <span className="quanta-logo-text">QUANTA</span>
          </div>
          <span className="quanta-logo-subtitle">Metrics Engine</span>
        </div>
        
        <nav className="quanta-nav-menu">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`quanta-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="quanta-nav-icon">{item.icon}</span>
              <span className="quanta-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="quanta-sidebar-footer">
          <div className="quanta-status-indicator">
            <span className="quanta-status-dot"></span>
            <span>Live</span>
          </div>
        </div>
      </aside>

      <main className="quanta-main-content">
        {children}
      </main>
    </div>
  );
}

export default QuantaLayout;
