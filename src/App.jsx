import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/react';
import Login from './pages/Login';
import Hub from './pages/Hub';
import AgentDashboard from './pages/AgentDashboard';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  return (
    <SignedIn>
      {children}
    </SignedIn>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <SignedOut>
            <Login />
          </SignedOut>
        } />
        <Route path="/" element={
          <SignedIn>
            <Layout />
          </SignedIn>
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
