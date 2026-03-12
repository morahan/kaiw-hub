import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'team') {
      localStorage.setItem('kaiw_auth', 'true');
      navigate('/');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">⚡ kaiw.io</div>
        <p>Enter your password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
          />
          {error && <span className="error">{error}</span>}
          <button type="submit">Enter Hub</button>
        </form>
        <p className="hint">Hint: team</p>
      </div>
    </div>
  );
}

export default Login;
