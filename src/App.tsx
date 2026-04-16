import { useState, useEffect } from 'react';
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from './context/AuthContext';
import { API_ENDPOINTS } from './config/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      setIsCheckingAuth(false);
      return;
    }

    // If we have a stored user, show the app immediately while validating
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        // Stored user was malformed, ignore
      }
    }

    // Validate token with the server
    try {
      const res = await fetch(API_ENDPOINTS.ME, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
      } else {
        // Token is invalid — clear everything
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error('Auth check failed', e);
      // Keep the user logged in if it's a network error
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogin = (userData: any, token: string) => {
    // Store everything in localStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  if (isCheckingAuth) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f2f3', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ color: '#0b5e46', fontWeight: 600 }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const token = localStorage.getItem('accessToken');

  return (
    <AuthProvider initialUser={user} token={token}>
      <ChatPage />
    </AuthProvider>
  );
}