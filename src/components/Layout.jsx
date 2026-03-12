import { Outlet, useNavigate } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('kaiw_auth');
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="topbar">
        <div className="topbar-brand" onClick={() => navigate('/')}>
          ⚡ kaiw.io
        </div>
        <div className="topbar-links">
          <a href="https://github.com/morahan" target="_blank" rel="noopener">GitHub</a>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
