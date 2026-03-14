import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, SignIn } from '@clerk/react';
import Hub from './pages/Hub';
import AgentDashboard from './pages/AgentDashboard';
import Layout from './components/Layout';
import './App.css';

function AuthRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
