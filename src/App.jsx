import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, UserButton } from '@clerk/react';
import Hub from './pages/Hub';
import AgentDashboard from './pages/AgentDashboard';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0f' }}>
              <SignIn />
            </div>
          } />
          <Route path="/" element={<Layout />}>
            <Route index element={<Hub />} />
            <Route path=":agent" element={<AgentDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
