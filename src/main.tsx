import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AuthScreen from './components/AuthScreen.tsx';
import './index.css';

interface AuthState {
  username: string;
  token: string;
}

function Root() {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return token && username ? { token, username } : null;
  });
  const [isGuest, setIsGuest] = useState(false);

  const handleAuth = (username: string, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setAuth({ username, token });
    setIsGuest(false);
  };

  const handleGuest = () => {
    setIsGuest(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setAuth(null);
    setIsGuest(false);
  };

  if (!auth && !isGuest) {
    return <AuthScreen onAuth={handleAuth} onGuest={handleGuest} />;
  }

  return <App currentUser={auth} onSignOut={handleSignOut} />;
}

createRoot(document.getElementById('root')!).render(<Root />);
