import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'
import './index.css'

// Replace with your Clerk publishable key from https://clerk.com
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_your_key_here'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
