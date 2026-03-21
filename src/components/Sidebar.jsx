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
      backgroundColor: 'var(--surface)',
      borderRight: '1px solid var(--border)',
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
          color: 'var(--ink-1)'
        }}>TwinForge</div>
        <div style={{
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
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
          color: 'var(--ink-3)',
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
                color: isActive ? 'var(--accent)' : 'var(--ink-2)',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
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
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
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
          color: 'var(--ink-3)',
          marginBottom: '14px'
        }}>
          Live Snapshot
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
             <span style={{ color: 'var(--ink-2)' }}>Employees</span>
             <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{totalEmployees?.toLocaleString() || '2,400'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
             <span style={{ color: 'var(--ink-2)' }}>Avg EX Score</span>
             <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{exScore}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
             <span style={{ color: 'var(--ink-2)' }}>Projected ROI</span>
             <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{roi}%</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent) 0%, #7b5fff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Demo User'}</div>
            <div style={{ fontSize: '11px', color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.company || 'TwinForge'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onOpenSettings} className="btn btn-outline" style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
            <Settings size={14} /> Settings
          </button>
          <button onClick={onSignOut} className="btn btn-outline" style={{ flex: 1, padding: '8px', fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
