import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignIn, UserButton } from '@clerk/react';
import Hub from './pages/Hub';
import AgentDashboard from './pages/AgentDashboard';
import Layout from './components/Layout';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder';

function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
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
    </ClerkProvider>
  );
}

export default App;
