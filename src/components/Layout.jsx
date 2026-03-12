import { Outlet, useNavigate } from 'react-router-dom';
import { UserButton, SignOutButton } from '@clerk/react';
import './Layout.css';

function Layout() {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <header className="topbar">
        <div className="topbar-brand" onClick={() => navigate('/')}>
          ⚡ kaiw.io
        </div>
        <div className="topbar-links">
          <a href="https://github.com/morahan" target="_blank" rel="noopener">GitHub</a>
          <UserButton afterSignOutUrl="/login" />
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
