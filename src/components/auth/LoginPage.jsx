import React, { useState } from 'react';
import { motion } from 'framer-motion';

const inputStyle = {
  width: '100%',
  padding: '12px',
  background: '#ffffff',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  color: '#0a0a0a',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  fontWeight: 600,
  color: '#6b7280',
  marginBottom: '8px'
};

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');

  const handleDemo = () => {
    setEmail('demo@twinforge.ai');
    setPassword('simulate2026');
    setRole('Admin');
    setTimeout(() => {
      onLogin({ name: 'Demo User', email: 'demo@twinforge.ai', company: 'Acme Corp', role: 'Admin' });
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ name: email.split('@')[0], email, company: 'Enterprise Admin', role });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '3rem', width: '100%', maxWidth: '420px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-sora)', fontWeight: 700, color: '#0a0a0a', marginBottom: '6px' }}>Sign In</div>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Access your TwinForge dashboard.</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@company.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Role Access</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
              <option value="Admin">Admin (Full Access)</option>
              <option value="Viewer">Viewer (Read-Only)</option>
            </select>
          </div>
          <button type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem', background: '#2563eb', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 700, fontSize: '15px', cursor: 'pointer', width: '100%' }}>
            Sign In
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
        </div>

        <button style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google
        </button>
        
        <button onClick={handleDemo} style={{ width: '100%', padding: '0.75rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
          Try Demo (Auto-fill)
        </button>
      </motion.div>
    </div>
  );
};
export default LoginPage;
