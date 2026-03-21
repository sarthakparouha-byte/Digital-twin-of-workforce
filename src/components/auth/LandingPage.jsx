import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, GitMerge } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', color: 'white', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: '800px', width: '100%' }}>
        <h1 className="font-mono text-cyan" style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '2px' }}>TWINFORGE AI</h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--ink-2)', marginBottom: '3rem' }}>Simulate Before You Implement</p>
        
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <button className="btn btn-primary" onClick={() => onNavigate('login')} style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>Get Started</button>
          <button className="btn btn-secondary" onClick={() => onNavigate('login')} style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>Sign In</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <Cpu size={32} color="var(--accent)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Digital Twin</h3>
            <p style={{ color: 'var(--ink-3)', fontSize: '0.9rem' }}>Clone your entire organization's capabilities into a responsive model.</p>
          </div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <Activity size={32} color="var(--warn)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Scenario Planning</h3>
            <p style={{ color: 'var(--ink-3)', fontSize: '0.9rem' }}>Test thousands of scenarios locally before a single physical deployment.</p>
          </div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <GitMerge size={32} color="var(--accent3)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>AI Copilot</h3>
            <p style={{ color: 'var(--ink-3)', fontSize: '0.9rem' }}>Let Gemini flash pinpoint operational thresholds and automatically generate solutions.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default LandingPage;
