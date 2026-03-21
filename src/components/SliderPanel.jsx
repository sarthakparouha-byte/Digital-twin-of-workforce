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

const SliderPanel = ({ state, onChange, onReset, onOptimize, userRole }) => {
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
    let effective = invert ? 100 - val : val;
    if (effective < 45) return { text: "CRITICAL", badgeClass: "badge-critical" };
    if (effective < 60) return { text: "AT RISK",  badgeClass: "badge-risk" };
    return { text: "STABLE", badgeClass: "badge-stable" };
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px' }}>
      <div style={{
        fontFamily: 'var(--font-sora)',
        fontSize: '15px',
        fontWeight: 600,
        color: 'var(--ink-1)',
        marginBottom: '24px',
        letterSpacing: '-0.1px'
      }}>Simulation Control Panel</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', flex: 1, overflowY: 'auto', paddingRight: '12px' }}>
        {configs.map(conf => {
          const val = state[conf.key];
          const status = getStatus(val, conf.invertStatus);
          const isOptimized = status.text === "Optimized";
          
          return (
            <div key={conf.key} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-1)' }}>{conf.label}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isOptimized && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: 'var(--green)',
                      background: 'var(--green-dim)',
                      border: '1px solid rgba(62,207,142,0.2)',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}>Optimized</span>
                  )}
                  {!isOptimized && (
                    <span className={status.badgeClass}>{status.text}</span>
                  )}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: 'var(--ink-1)',
                    minWidth: '26px',
                    textAlign: 'right'
                  }}><AnimatedMiniCounter value={val} /></span>
                </div>
              </div>
              
              <div style={{ position: 'relative', padding: '4px 0' }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0, right: 0,
                  height: '4px',
                  background: '#e5e7eb',
                  borderRadius: '2px',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  height: '4px',
                  background: '#2563eb',
                  borderRadius: '2px',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  width: `${val}%`,
                  transition: 'width 0.2s'
                }}></div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => onChange(conf.key, parseInt(e.target.value))}
                  style={{ position: 'relative', zIndex: 2, cursor: userRole === 'Viewer' ? 'not-allowed' : 'pointer', opacity: userRole === 'Viewer' ? 0.6 : 1 }}
                  disabled={userRole === 'Viewer'}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '28px' }}>
        <button className="btn-ghost" onClick={userRole === 'Viewer' ? null : onReset} disabled={userRole === 'Viewer'} style={{ 
          background: 'var(--surface-2)',
          border: '1px solid var(--border-2)',
          color: 'var(--ink-2)',
          padding: '12px',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 600,
          cursor: userRole === 'Viewer' ? 'not-allowed' : 'pointer',
          opacity: userRole === 'Viewer' ? 0.4 : 1,
          transition: 'all 0.15s'
        }}>
          Reset to Baseline
        </button>
        <button className="btn-apply" onClick={userRole === 'Viewer' ? null : onOptimize} disabled={userRole === 'Viewer'} style={{ 
          background: '#2563eb',
          color: '#fff',
          padding: '12px',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 600,
          border: 'none',
          cursor: userRole === 'Viewer' ? 'not-allowed' : 'pointer',
          opacity: userRole === 'Viewer' ? 0.4 : 1,
          transition: 'opacity 0.15s',
          boxShadow: userRole === 'Viewer' ? 'none' : '0 4px 16px rgba(79,124,255,0.35)'
        }}>
          Apply Optimal State
        </button>
      </div>
    </div>
  );
};

export default SliderPanel;
