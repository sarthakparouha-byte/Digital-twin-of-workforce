import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { baselineState as baseStatic } from '../../core/engine';

const industries = ["Technology", "Finance", "Healthcare", "Manufacturing"];

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', color: 'white', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
           {[1, 2, 3].map(s => (
              <div key={s} style={{ flex: 1, height: '4px', background: s <= step ? 'var(--accent)' : 'var(--border)', borderRadius: '2px', transition: 'background 0.3s' }} />
           ))}
        </div>

        <h2 className="font-mono text-cyan" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>
          {step === 1 && "1. Organization Setup"}
          {step === 2 && "2. Department Details"}
          {step === 3 && "3. Baseline Assessment"}
        </h2>

        <div style={{ flex: 1, minHeight: '340px' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="input-field">
                  <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '8px' }}>Company Name</label>
                  <input type="text" value={org.name} onChange={e => setOrg({...org, name: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div className="input-field">
                  <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '8px' }}>Industry</label>
                  <select value={org.industry} onChange={e => setOrg({...org, industry: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}>
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="input-field">
                  <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '8px' }}>Total Employees Target</label>
                  <input type="number" value={org.employees} readOnly style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--ink-3)' }} />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.keys(depts).map(d => (
                  <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--ink-2)' }}>{d}</span>
                    <input type="number" value={depts[d]} onChange={e => setDepts({...depts, [d]: e.target.value})} style={{ width: '120px', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', textAlign: 'right' }} />
                  </div>
                ))}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                   <span>Total Headcount</span>
                   <span className="text-cyan font-mono">{totalCalculated.toLocaleString()}</span>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <button className="btn btn-secondary" onClick={handleApplyBenchmark} style={{ padding: '0.75rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                  Use Industry Benchmark ({org.industry})
                </button>
                
                <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {Object.keys(baseline).map(k => (
                      <div key={k}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'var(--ink-2)' }}>
                          <span>{k.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}</span>
                          <span className="font-mono">{baseline[k]}</span>
                        </div>
                        <input type="range" min="0" max="100" value={baseline[k]} onChange={e => setBaseline({...baseline, [k]: parseInt(e.target.value)})} style={{ width: '100%', cursor: 'pointer' }} />
                      </div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
           {step > 1 ? (
              <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button>
           ) : <div />}
           
           {step < 3 ? (
             <button className="btn btn-primary" onClick={() => setStep(step + 1)} style={{ padding: '0.5rem 2rem' }}>Wait & Continue</button>
           ) : (
             <button className="btn btn-primary" onClick={submitWizard} style={{ padding: '0.5rem 2rem' }}>Launch Dashboard</button>
           )}
        </div>

      </motion.div>
    </div>
  );
};
export default OnboardingWizard;
