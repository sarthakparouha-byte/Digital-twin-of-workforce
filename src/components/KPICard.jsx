import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const AnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 500; // ms
    const startValue = displayValue;
    const endValue = value;

    if (startValue === endValue) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = startValue + (endValue - startValue) * easeProgress;
      
      setDisplayValue(Number(currentVal.toFixed(1))); // handle decimals correctly
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  // Format to 1 decimal place max
  const formatted = displayValue % 1 === 0 ? displayValue : displayValue.toFixed(1);

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  );
};

const KPICard = ({ title, value, previousValue = null, suffix = "", prefix = "" }) => {
  const delta = previousValue !== null ? value - previousValue : 0;
  const isPositive = delta >= 0;
  
  return (
    <motion.div 
      className="glass-card"
      style={{ display: 'flex', flexDirection: 'column', padding: '24px 22px' }}
      whileHover={{ y: -4 }}
    >
      <h3 style={{ 
        fontSize: '11px', 
        fontWeight: 600, 
        letterSpacing: '1.3px', 
        textTransform: 'uppercase', 
        color: 'var(--ink-3)',
        marginBottom: '16px',
        margin: 0
      }}>{title}</h3>
      
      <div style={{
        fontFamily: 'var(--font-sora)',
        fontSize: '38px',
        fontWeight: 700,
        lineHeight: 1,
        color: 'var(--ink-1)',
        marginBottom: '10px'
      }}>
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      </div>
      
      {previousValue !== null && delta !== 0 && (
        <div style={{ display: 'flex' }}>
          <span style={{
             display: 'inline-flex',
             alignItems: 'center',
             gap: '4px',
             fontSize: '12px',
             fontWeight: 600,
             color: isPositive ? 'var(--green)' : '#ef4444',
             background: isPositive ? 'var(--green-dim)' : 'rgba(239, 68, 68, 0.12)',
             padding: '3px 8px',
             borderRadius: '100px',
          }}>
            {isPositive ? '↑' : '↓'} {Math.abs(delta).toFixed(1) % 1 === 0 ? Math.abs(delta) : Math.abs(delta).toFixed(1)}{suffix}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default KPICard;
