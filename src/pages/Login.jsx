import { SignIn } from '@clerk/react';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">⚡ kaiw.io</div>
        <p>Sign in to access the hub</p>
        <div className="signin-wrapper">
          <SignIn 
            appearance={{
              elements: {
                rootBox: 'signin-root',
                card: 'signin-card',
              }
            }}
            routing="hash"
            signUpUrl="/login"
            forceRedirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
