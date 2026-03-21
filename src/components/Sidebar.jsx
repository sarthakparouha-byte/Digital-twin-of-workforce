import React from 'react';
import { LayoutDashboard, Bot, ShoppingBag, Clock, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ activeView, onViewChange, exScore, roi, totalEmployees, onOpenSettings, user, onSignOut }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'copilot', label: 'AI Copilot', icon: Bot },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'history', label: 'History', icon: Clock },
  ];

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      backgroundColor: '#111111',
      borderRight: '1px solid #1f1f1f',
      display: 'flex',
      flexDirection: 'column',
      padding: '28px 16px',
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      zIndex: 100
    }}>
      {/* Brand Header */}
      <div style={{ padding: '0 8px 32px' }}>
        <div style={{
          fontFamily: 'var(--font-sora)',
          fontWeight: 700,
          fontSize: '18px',
          letterSpacing: '0.5px',
          color: '#ffffff'
        }}>TwinForge</div>
        <div style={{
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#9ca3af',
          marginTop: '2px'
        }}>
          AI Digital Twin
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: '#9ca3af',
          padding: '0 10px',
          marginBottom: '6px'
        }}>Workspace</div>
        {navItems.map(item => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={isActive ? 'nav-item active' : 'nav-item'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#2563eb' : '#f9fafb',
                background: isActive ? '#eff6ff' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
                marginBottom: '2px',
              }}
            >
              <Icon size={16} />
              {item.label}
            </div>
          )
        })}
      </nav>

      {/* Live Snapshot */}
      <div style={{
        background: '#1a1a1a',
        border: '1px solid #1f1f1f',
        borderRadius: 'var(--radius)',
        padding: '16px',
        marginTop: 'auto',
        marginBottom: '16px'
      }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: '#9ca3af',
          marginBottom: '14px'
        }}>
          Live Snapshot
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
             <span style={{ color: '#9ca3af' }}>Employees</span>
             <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#2563eb' }}>{totalEmployees?.toLocaleString() || '2,400'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
             <span style={{ color: '#9ca3af' }}>Avg EX Score</span>
             <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#2563eb' }}>{exScore}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
             <span style={{ color: '#9ca3af' }}>Projected ROI</span>
             <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#22c55e' }}>{roi}%</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', background: '#1a1a1a', border: '1px solid #1f1f1f', borderRadius: 'var(--radius)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Demo User'}</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.company || 'Enterprise Admin'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onOpenSettings} className="btn btn-outline" style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid #333', color: '#d1d5db' }}>
            <Settings size={14} /> Settings
          </button>
          <button onClick={onSignOut} className="btn btn-outline" style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
