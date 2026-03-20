import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Download, ArrowRightLeft, CheckSquare, Square } from 'lucide-react';

const History = ({ scenarios, onRestore }) => {
  const [selected, setSelected] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const handleToggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      if (selected.length < 2) {
        setSelected([...selected, id]);
      }
    }
  };

  const selectedScenarios = scenarios.filter(s => selected.includes(s.id));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        padding: '2rem',
        marginLeft: '220px',
        maxWidth: 'calc(100vw - 220px)',
        overflowY: 'auto'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="font-mono text-cyan" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Scenario History</h2>
          <p style={{ color: 'var(--muted)' }}>Review localized snapshots of the digital twin simulation.</p>
        </div>
        
        {scenarios.length > 0 && (
          <button 
            className="btn btn-primary"
            disabled={selected.length !== 2}
            onClick={() => setShowCompare(true)}
            style={{ opacity: selected.length === 2 ? 1 : 0.5 }}
          >
            <ArrowRightLeft size={18} />
            Compare Selected ({selected.length}/2)
          </button>
        )}
      </div>

      {scenarios.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
           <Clock size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
           <h3>No saved scenarios</h3>
           <p>Save scenarios from the Dashboard to compare strategies.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: 0 }}>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '1rem' }}>
            <AnimatePresence>
              {scenarios.map(s => {
                 const isChecked = selected.includes(s.id);
                 return (
                   <motion.div 
                     layout
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     key={s.id}
                     className="glass-card"
                     style={{ 
                       padding: '1.5rem', 
                       border: isChecked ? '1px solid var(--accent)' : '1px solid var(--border)',
                       background: isChecked ? 'rgba(0, 212, 255, 0.05)' : undefined
                     }}
                   >
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                           <div onClick={() => handleToggleSelect(s.id)} style={{ cursor: 'pointer', color: isChecked ? 'var(--accent)' : 'var(--muted)' }}>
                             {isChecked ? <CheckSquare size={24} /> : <Square size={24} />}
                           </div>
                           <div>
                             <h3 style={{ margin: 0, fontSize: '1.2rem', color: isChecked ? 'var(--accent)' : 'var(--text)' }}>{s.name}</h3>
                             <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{new Date(s.timestamp).toLocaleString()}</div>
                           </div>
                        </div>
                        <button className="btn btn-secondary" onClick={() => onRestore(s.state, s.tools)}>
                          <Download size={16} /> Restore state
                        </button>
                     </div>

                     <div style={{ display: 'flex', gap: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>EX Score</div>
                          <div className="font-mono text-cyan" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{s.metrics.exScore}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>ROI</div>
                          <div className="font-mono text-cyan" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{s.metrics.roi}%</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Active Tools</div>
                          <div className="font-mono" style={{ fontSize: '1.25rem' }}>{s.tools.length}</div>
                        </div>
                     </div>
                   </motion.div>
                 )
              })}
            </AnimatePresence>
          </div>

          {/* Comparison Panel */}
          {showCompare && selectedScenarios.length === 2 && (
            <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
               className="glass-card" 
               style={{ width: '450px', flexShrink: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
            >
               <h3 className="font-mono text-cyan" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <ArrowRightLeft size={20} /> Side-by-Side Comparison
               </h3>

               <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 2fr) 1fr 1fr', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--muted)' }}>Metric</div>
                  <div style={{ fontWeight: 'bold' }}>{selectedScenarios[0].name.split(' - ')[0]}</div>
                  <div style={{ fontWeight: 'bold' }}>{selectedScenarios[1].name.split(' - ')[0]}</div>
               </div>

               {/* Top KPIs */}
               {[
                 { label: 'EX Score', key: 'exScore' },
                 { label: 'ROI %', key: 'roi' }
               ].map(kpi => {
                  const val1 = selectedScenarios[0].metrics[kpi.key];
                  const val2 = selectedScenarios[1].metrics[kpi.key];
                  const diff = val2 - val1;
                  return (
                    <div key={kpi.label} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 2fr) 1fr 1fr', gap: '1rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                      <div className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{kpi.label}</div>
                      <div className="font-mono" style={{ fontSize: '1.1rem' }}>{val1}</div>
                      <div className="font-mono" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {val2}
                        {diff !== 0 && (
                          <span style={{ fontSize: '0.8rem', color: diff > 0 ? 'var(--accent3)' : 'var(--danger)' }}>
                            {diff > 0 ? '+' : ''}{diff}
                          </span>
                        )}
                      </div>
                    </div>
                  )
               })}

               <div style={{ margin: '1rem 0', borderBottom: '1px solid var(--border)' }}></div>

               {/* 8 Simulation Dimensions */}
               {Object.keys(selectedScenarios[0].state).map(dim => {
                  const val1 = selectedScenarios[0].state[dim];
                  const val2 = selectedScenarios[1].state[dim];
                  const diff = val2 - val1;
                  const isInverted = dim === 'shadowItRisk' || dim === 'itSupportMTTR';
                  const isPositiveDelta = isInverted ? diff < 0 : diff > 0;

                  return (
                    <div key={dim} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 2fr) 1fr 1fr', gap: '1rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{dim.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}</div>
                      <div className="font-mono" style={{ fontSize: '1rem' }}>{val1}</div>
                      <div className="font-mono" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {val2}
                        {diff !== 0 && (
                          <span style={{ fontSize: '0.8rem', color: isPositiveDelta ? 'var(--accent3)' : 'var(--danger)' }}>
                            {diff > 0 ? '+' : ''}{diff}
                          </span>
                        )}
                      </div>
                    </div>
                  )
               })}

               <button className="btn btn-secondary" style={{ marginTop: 'auto', justifyContent: 'center' }} onClick={() => setShowCompare(false)}>Close Comparison</button>
            </motion.div>
          )}

        </div>
      )}
    </motion.div>
  );
};

export default History;
