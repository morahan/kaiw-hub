import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Hub from './pages/Hub';
import AgentDashboard from './pages/AgentDashboard';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('kaiw_auth');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Hub />} />
          <Route path=":agent" element={<AgentDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
