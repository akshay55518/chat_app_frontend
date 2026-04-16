import React, { useState } from 'react';
import styles from './LoginPage.module.css';

import { API_ENDPOINTS } from '../config/api';

export default function LoginPage({ onLogin }: { onLogin?: (user: any, token: string) => void }) {

  const [activeTab, setActiveTab] = useState<'login' | 'create'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await fetch(API_ENDPOINTS.LOGIN, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        if (!res.ok) {
          let errorMsg = 'Failed to login';
          try {
            const data = await res.json();
            errorMsg = data.error || data.detail || errorMsg;
          } catch(e) {}
          throw new Error(errorMsg);
        }

        const data = await res.json();
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        
        if (onLogin) onLogin(data.user, data.access);

        
      } else {
        const res = await fetch(API_ENDPOINTS.REGISTER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: fullName }),
        });
        
        if (!res.ok) {
          let errorMsg = 'Failed to create account';
          try {
            const data = await res.json();
            errorMsg = data.email ? data.email[0] : (data.error || errorMsg);
          } catch(e) {}
          throw new Error(errorMsg);
        }

        // On successful registration, switch back to login tab
        setActiveTab('login');
        setPassword('');
        setError('Account created successfully! Please log in.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      <main className={styles.mainContent}>
        <div className={styles.loginCard}>
          {/* Left Panel */}
          {/* <div className={styles.leftPanel}>
            <div className={styles.leftPanelContent}>
              <h1 className={styles.title}>The Pristine<br />Workspace for<br />Global Discourse.</h1>
              <p className={styles.subtitle}>
                Experience an editorial-grade messaging environment designed for high-stakes clarity and professional connection.
              </p>
            </div>
            
            <ul className={styles.featuresList}>
              <li className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                Encrypted Editorial Channels
              </li>
              <li className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                Tonal Architecture Interface
              </li>
            </ul>
          </div> */}

          {/* Right Panel */}
          <div className={styles.rightPanel}>
            <div className={styles.rightHeader}>
              <h2 className={styles.welcomeText}>Welcome Back</h2>
              <p className={styles.welcomeSubtext}>Select your preferred access method below.</p>
            </div>

            <div className={styles.tabs}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'login' ? styles.active : ''}`}
                onClick={() => { setActiveTab('login'); setError(''); }}
              >
                Login
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'create' ? styles.active : ''}`}
                onClick={() => { setActiveTab('create'); setError(''); }}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleLogin}>
              {error && (
                <div style={{ color: error.includes('successfully') ? '#0d8b67' : '#d32f2f', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  {error}
                </div>
              )}

              {activeTab === 'create' && (
                <div className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>FULL NAME</label>
                  </div>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      className={styles.input} 
                      placeholder="John Doe" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={activeTab === 'create'}
                    />
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>EMAIL ADDRESS</label>
                </div>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    className={styles.input} 
                    placeholder="editor@messenger.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>PASSWORD</label>
                  {/* {activeTab === 'login' && (
                    <a href="#" className={styles.forgotLink}>Forgot Password?</a>
                  )} */}
                </div>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <input 
                    type="password" 
                    className={styles.input} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* {activeTab === 'login' && (
                <label className={styles.checkboxGroup}>
                  <input type="checkbox" className={styles.checkbox} />
                  <span className={styles.checkboxLabel}>Keep me signed in for 30 days</span>
                </label>
              )} */}

              <button type="submit" className={styles.submitBtn} style={{ marginTop: activeTab === 'create' ? '2.3rem' : '0' }} disabled={isLoading}>
                {isLoading ? 'Processing...' : (activeTab === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {/* <div className={styles.divider}>
              <span className={styles.dividerText}>OR CONTINUE WITH</span>
            </div> */}

            {/* <div className={styles.socialAuth}>
              <button type="button" className={styles.socialBtn}>
                <div className={styles.socialIcon}>
                  <svg viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                Google
              </button>
              <button type="button" className={styles.socialBtn}>
                <div className={styles.socialIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-0.87 1.5.02 2.76.65 3.54 1.76-3.13 1.95-2.63 5.43.34 6.64-.67 1.77-1.5 3.55-2.46 4.64zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.3-1.88 4.21-3.74 4.25z" />
                  </svg>
                </div>
                Apple
              </button>
            </div> */}
          </div>
        </div>
      </main>

      {/* <footer className={styles.footer}>
        <div className={styles.footerNav}>
          <a href="#" className={styles.footerLink}>PRIVACY POLICY</a>
          <a href="#" className={styles.footerLink}>TERMS OF SERVICE</a>
        </div>
        <p className={styles.copyright}>© 2024 THE EDITORIAL MESSENGER. PROFESSIONAL EDITORIAL CANVAS.</p>
      </footer> */}
    </div>
  );
}
