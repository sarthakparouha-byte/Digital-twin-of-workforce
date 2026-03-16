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
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '16px 20px' }}
      whileHover={{ y: -4 }}
    >
      <h3 className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', margin: 0 }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
        <span className="font-mono text-cyan" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
          <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
        </span>
        
        {previousValue !== null && delta !== 0 && (
          <span style={{
             fontSize: '0.9rem', 
             fontWeight: 'bold',
             color: isPositive ? 'var(--accent3)' : 'var(--danger)',
             display: 'flex',
             alignItems: 'center',
             gap: '0.2rem'
          }}>
            {isPositive ? '↑' : '↓'} {Math.abs(delta).toFixed(1) % 1 === 0 ? Math.abs(delta) : Math.abs(delta).toFixed(1)}{suffix}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default KPICard;
