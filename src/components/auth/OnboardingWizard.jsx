import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { baselineState as baseStatic } from '../../core/engine';

const industries = ["Technology", "Finance", "Healthcare", "Manufacturing"];

const inputStyle = {
  width: '100%',
  padding: '12px',
  background: '#ffffff',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  color: '#0a0a0a',
  fontSize: '14px',
  outline: 'none'
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

const OnboardingWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [org, setOrg] = useState({ name: '', industry: 'Technology', employees: 2098 });
  const [depts, setDepts] = useState({ 
    Engineering: 480, Sales: 620, Operations: 600, HR: 98, Finance: 300 
  });
  const [baseline, setBaseline] = useState({ ...baseStatic });

  const totalCalculated = Object.values(depts).reduce((a, b) => a + (parseInt(b) || 0), 0);

  const handleApplyBenchmark = () => {
    let adjustment = 0;
    if (org.industry === 'Technology') adjustment = 15;
    if (org.industry === 'Healthcare') adjustment = -10;
    if (org.industry === 'Manufacturing') adjustment = -5;
    if (org.industry === 'Finance') adjustment = 5;
    setBaseline(prev => {
      const b = { ...prev };
      Object.keys(b).forEach(k => {
        b[k] = Math.max(10, Math.min(90, baseStatic[k] + adjustment + Math.floor(Math.random()*10 - 5)));
      });
      return b;
    });
  };

  const submitWizard = () => {
    const orgData = { name: org.name, industry: org.industry, employeeCount: totalCalculated, departments: depts };
    onComplete(orgData, baseline);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '3rem', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
        
        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
           {[1, 2, 3].map(s => (
              <div key={s} style={{ flex: 1, height: '4px', background: s <= step ? '#2563eb' : '#e5e7eb', borderRadius: '2px', transition: 'background 0.3s' }} />
           ))}
        </div>

        <h2 style={{ fontSize: '1.6rem', marginBottom: '2rem', fontFamily: 'var(--font-sora)', fontWeight: 700, color: '#0a0a0a' }}>
          {step === 1 && "1. Organization Setup"}
          {step === 2 && "2. Department Details"}
          {step === 3 && "3. Baseline Assessment"}
        </h2>

        <div style={{ flex: 1, minHeight: '340px' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Company Name</label>
                  <input type="text" value={org.name} onChange={e => setOrg({...org, name: e.target.value})} placeholder="e.g. Acme Corp" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Industry</label>
                  <select value={org.industry} onChange={e => setOrg({...org, industry: e.target.value})} style={inputStyle}>
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Total Employees Target</label>
                  <input type="number" value={org.employees} readOnly style={{ ...inputStyle, background: '#f9fafb', color: '#6b7280' }} />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.keys(depts).map(d => (
                  <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#374151', fontWeight: 500, fontSize: '14px' }}>{d}</span>
                    <input type="number" value={depts[d]} onChange={e => setDepts({...depts, [d]: e.target.value})} style={{ width: '120px', padding: '8px 12px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', color: '#0a0a0a', textAlign: 'right', fontSize: '14px' }} />
                  </div>
                ))}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0a0a0a' }}>
                   <span>Total Headcount</span>
                   <span style={{ color: '#2563eb', fontFamily: 'var(--font-mono)' }}>{totalCalculated.toLocaleString()}</span>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <button onClick={handleApplyBenchmark} style={{ padding: '0.75rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                  Use Industry Benchmark ({org.industry})
                </button>
                
                <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {Object.keys(baseline).map(k => (
                      <div key={k}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: '#374151' }}>
                          <span>{k.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#2563eb' }}>{baseline[k]}</span>
                        </div>
                        <input type="range" min="0" max="100" value={baseline[k]} onChange={e => setBaseline({...baseline, [k]: parseInt(e.target.value)})} style={{ width: '100%', cursor: 'pointer' }} />
                      </div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
           {step > 1 ? (
              <button onClick={() => setStep(step - 1)} style={{ padding: '0.5rem 1.5rem', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Back</button>
           ) : <div />}
           
           {step < 3 ? (
             <button onClick={() => setStep(step + 1)} style={{ padding: '0.5rem 2rem', background: '#2563eb', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Continue</button>
           ) : (
             <button onClick={submitWizard} style={{ padding: '0.5rem 2rem', background: '#2563eb', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Launch Dashboard</button>
           )}
        </div>

      </motion.div>
    </div>
  );
};
export default OnboardingWizard;
