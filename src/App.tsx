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
    if (!token) {
      setIsCheckingAuth(false);
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.ME, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } catch (e) {
      console.error('Auth check failed', e);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f2f3', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ color: '#0b5e46', fontWeight: 600 }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => {
      setIsCheckingAuth(true); // Re-run auth check to fetch user profile properly
      checkAuth();
    }} />;
  }

  const token = localStorage.getItem('accessToken');

  return (
    <AuthProvider initialUser={user} token={token}>
      <ChatPage />
    </AuthProvider>
  );
}