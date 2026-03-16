import React from 'react';
import { LayoutDashboard, Bot, ShoppingBag, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ activeView, onViewChange, exScore, roi }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'copilot', label: 'AI Copilot', icon: Bot },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'history', label: 'History', icon: Clock },
  ];

  return (
    <aside style={{
      width: '220px',
      height: '100vh',
      backgroundColor: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="font-mono text-cyan" style={{ fontSize: '1.5rem', margin: 0, letterSpacing: '1px' }}>TWINFORGE</h1>
        <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          AI Digital Twin
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {navItems.map(item => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: isActive ? 'var(--text)' : 'var(--muted)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'all 0.2s',
              }}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '15%',
                    bottom: '15%',
                    width: '3px',
                    backgroundColor: 'var(--accent)',
                    borderRadius: '0 4px 4px 0',
                    boxShadow: '0 0 8px var(--accent)'
                  }}
                />
              )}
              <Icon size={18} color={isActive ? 'var(--accent)' : 'currentColor'} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Live Snapshot */}
      <div style={{
        marginTop: 'auto',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid var(--border)'
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
          Live Snapshot
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <span style={{ fontSize: '0.85rem' }}>Employees</span>
             <span className="font-mono text-cyan">2,400</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <span style={{ fontSize: '0.85rem' }}>Avg EX Score</span>
             <span className="font-mono text-cyan">{exScore}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <span style={{ fontSize: '0.85rem' }}>Projected ROI</span>
             <span className="font-mono text-cyan">{roi}%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
