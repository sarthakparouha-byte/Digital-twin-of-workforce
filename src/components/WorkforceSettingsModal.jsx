import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Briefcase, TrendingUp } from 'lucide-react';

const WorkforceSettingsModal = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (field, value) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonaChange = (persona, value) => {
    const val = parseInt(value) || 0;
    setLocalSettings(prev => {
      const newPersonas = {
        ...prev.personas,
        [persona]: { ...prev.personas[persona], headcount: val }
      };
      // Auto-update totalEmployees
      const newTotal = Object.values(newPersonas).reduce((acc, p) => acc + (p.headcount || 0), 0);
      return { ...prev, personas: newPersonas, totalEmployees: newTotal };
    });
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 2000, padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-card"
        style={{
          width: '100%', maxWidth: '500px',
          padding: '32px', position: 'relative',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'transparent', border: 'none', color: 'var(--ink-3)',
          cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        <h2 style={{
          fontFamily: 'var(--font-sora)', fontSize: '22px',
          fontWeight: 700, color: 'var(--ink-1)', marginBottom: '8px'
        }}>Organization Setup</h2>
        <p style={{ color: 'var(--ink-3)', fontSize: '14px', marginBottom: '28px' }}>
          Configure your workforce parameters to calibrate the simulation.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Org Name */}
          <div className="input-field">
            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '8px' }}>Organization Name</label>
            <input 
              type="text" 
              value={localSettings.orgName} 
              onChange={(e) => handleChange('orgName', e.target.value)}
              style={{
                width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)', borderRadius: '8px', color: 'white'
              }}
            />
          </div>

          {/* Department Headcounts */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '12px' }}>Department Headcount</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '10px', color: '#00d4ff', marginBottom: '6px' }}>Engineering</div>
                <input 
                  type="number" 
                  value={localSettings.personas.engineering.headcount} 
                  onChange={(e) => handlePersonaChange('engineering', e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', fontWeight: 600, fontSize: '16px' }}
                />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '10px', color: '#7c3aed', marginBottom: '6px' }}>Sales</div>
                <input 
                  type="number" 
                  value={localSettings.personas.sales.headcount} 
                  onChange={(e) => handlePersonaChange('sales', e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', fontWeight: 600, fontSize: '16px' }}
                />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '10px', color: '#10b981', marginBottom: '6px' }}>Operations</div>
                <input 
                  type="number" 
                  value={localSettings.personas.operations.headcount} 
                  onChange={(e) => handlePersonaChange('operations', e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', fontWeight: 600, fontSize: '16px' }}
                />
              </div>
            </div>
          </div>

          {/* total employees read only */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px', background: 'var(--accent-dim)', borderRadius: '12px',
            marginTop: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <Users size={18} color="var(--accent)" />
               <span style={{ fontSize: '14px', fontWeight: 500 }}>Total Employees</span>
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent)' }}>{localSettings.totalEmployees.toLocaleString()}</span>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={() => onSave(localSettings)}
            style={{ width: '100%', marginTop: '12px', height: '48px' }}
          >
            Apply Workforce Data
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkforceSettingsModal;
