import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, SignIn } from '@clerk/react';
import Hub from './pages/Hub';
import AgentDashboard from './pages/AgentDashboard';
import Layout from './components/Layout';
import QuantaLayout from './quanta/QuantaLayout';
import MainDashboard from './quanta/MainDashboard';
import NowDashboard from './quanta/NowDashboard';
import TokensDashboard from './quanta/TokensDashboard';
import CostsDashboard from './quanta/CostsDashboard';
import ModelsDashboard from './quanta/ModelsDashboard';
import GPUDashboard from './quanta/GPUDashboard';
import AnalyticsDashboard from './quanta/AnalyticsDashboard';
import SystemDashboard from './quanta/SystemDashboard';
import AlertsDashboard from './quanta/AlertsDashboard';
import './App.css';

const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true';

function AuthRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  
  // Dev bypass for screenshots/local testing
  if (SKIP_AUTH) return children;
  
  if (!isLoaded) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function LoginPage() {
  return (
    <div className="login-container">
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <div className="login-content">
        <h1 className="login-title">⚡ kaiw.io</h1>
        <p className="login-subtitle">Enter the hub</p>
        <SignIn 
          appearance={{
            elements: {
              rootBox: 'signin-box',
              card: 'signin-card',
              headerTitle: 'signin-header-title',
              headerSubtitle: 'signin-header-subtitle',
              socialButtonsBlockButton: 'social-button',
              formFieldInput: 'signin-input',
              formButtonPrimary: 'signin-button',
              footerActionLink: 'signin-link'
            }
          }}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <AuthRoute>
            <Layout />
          </AuthRoute>
        }>
          <Route index element={<Hub />} />
          <Route path=":agent" element={<AgentDashboard />} />
        </Route>
        {/* Quanta Analytics at /quanta/* */}
        <Route path="/quanta" element={
          <AuthRoute>
            <QuantaLayout>
              <Outlet />
            </QuantaLayout>
          </AuthRoute>
        }>
          <Route index element={<MainDashboard />} />
          <Route path="now" element={<NowDashboard />} />
          <Route path="tokens" element={<TokensDashboard />} />
          <Route path="costs" element={<CostsDashboard />} />
          <Route path="models" element={<ModelsDashboard />} />
          <Route path="gpu" element={<GPUDashboard />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="system" element={<SystemDashboard />} />
          <Route path="alerts" element={<AlertsDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
