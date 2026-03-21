import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDemo = () => {
    setEmail('demo@twinforge.ai');
    setPassword('simulate2026');
    // auto trigger login
    setTimeout(() => {
      onLogin({ name: 'Demo User', email: 'demo@twinforge.ai', company: 'Acme Corp' });
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ name: email.split('@')[0], email, company: 'Unknown' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', color: 'white', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <h2 className="font-mono text-cyan" style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Sign In</h2>
        <p style={{ color: 'var(--ink-3)', textAlign: 'center', marginBottom: '2rem' }}>Access your TwinForge dashboard.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-field">
            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '8px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
          </div>
          <div className="input-field">
            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '8px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem' }}>Sign In</button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        <button className="btn btn-secondary" style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <svg style={{width:'18px',height:'18px'}} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google
        </button>
        
        <button className="btn btn-secondary" onClick={handleDemo} style={{ width: '100%', padding: '0.75rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
          Try Demo (Auto-fill)
        </button>
      </motion.div>
    </div>
  );
};
export default LoginPage;
