import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Quick Animated Counter without prefix/suffix logic for small panels
const AnimatedMiniCounter = ({ value, isPercent }) => {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    let startTimestamp = null;
    const duration = 400;
    const start = display;
    const end = value;
    if (start === end) return;
    const step = (ts) => {
      if (!startTimestamp) startTimestamp = ts;
      const progress = Math.min((ts - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * ease));
      if (progress < 1) window.requestAnimationFrame(step);
      else setDisplay(end);
    };
    window.requestAnimationFrame(step);
  }, [value]);
  return <span>{display}{isPercent ? '%' : ''}</span>;
}

const SliderPanel = ({ state, onChange, onReset, onOptimize }) => {
  const configs = [
    { key: "hardwarePerformance", label: "Hardware Performance" },
    { key: "networkReliability", label: "Network Reliability" },
    { key: "softwareIntegration", label: "Software Integration" },
    { key: "itSupportMTTR", label: "IT Support MTTR" },
    { key: "shadowItRisk", label: "Shadow IT Risk", invertStatus: true },
    { key: "digitalDexterity", label: "Digital Dexterity" },
    { key: "collaborationEffectiveness", label: "Collaboration Effectiveness" },
    { key: "automationCoverage", label: "Automation Coverage" },
  ];

  const getStatus = (val, invert) => {
    // 0-39 Critical, 40-59 At Risk, 60-79 Stable, 80-100 Optimized
    // If inverted (like MTTR or Shadow IT), lower is better! Wait, the prompt says for shadow IT higher is worse
    let effective = invert ? 100 - val : val;
    if (effective < 40) return { text: "Critical", color: "var(--danger)", bg: "rgba(239, 68, 68, 0.15)" };
    if (effective < 60) return { text: "At Risk", color: "var(--warn)", bg: "rgba(245, 158, 11, 0.15)" };
    if (effective < 80) return { text: "Stable", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" };
    return { text: "Optimized", color: "var(--accent3)", bg: "rgba(16, 185, 129, 0.15)" };
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem' }}>
      <h3 className="font-mono text-cyan" style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Simulation Control Panel</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, overflowY: 'auto', paddingRight: '1rem', marginRight: '-1rem' }}>
        {configs.map(conf => {
          const val = state[conf.key];
          const status = getStatus(val, conf.invertStatus);
          return (
            <div key={conf.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>{conf.label}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: status.bg,
                    color: status.color,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {status.text}
                  </span>
                  <span className="font-mono" style={{ width: '28px', textAlign: 'right', fontWeight: 'bold' }}><AnimatedMiniCounter value={val} /></span>
                </div>
              </div>
              <input 
                type="range"
                min="0"
                max="100"
                value={val}
                onChange={(e) => onChange(conf.key, parseInt(e.target.value))}
                style={{ 
                  background: `linear-gradient(to right, var(--accent) ${val}%, var(--surface2) ${val}%)`
                }}
              />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button className="btn btn-secondary" onClick={onReset} style={{ flex: 1, justifyContent: 'center' }}>
          Reset to Baseline
        </button>
        <button className="btn btn-primary" onClick={onOptimize} style={{ flex: 1, justifyContent: 'center' }}>
          Apply Optimal State
        </button>
      </div>
    </div>
  );
};

export default SliderPanel;
