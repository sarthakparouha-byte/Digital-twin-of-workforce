import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { marketplaceTools } from '../core/engine';
import { ShoppingBag, Sparkles, Monitor, Shield, HeadphonesIcon, Video, Cpu, GraduationCap, GitMerge, Check, Plus } from 'lucide-react';

const iconMap = {
  Sparkles, Monitor, Shield, HeadphonesIcon, Video, Cpu, GraduationCap, GitMerge
};

const Marketplace = ({ purchasedTools, onToggleTool, currentMetrics, baseMetrics }) => {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...Array.from(new Set(marketplaceTools.map(t => t.category)))];

  const filteredTools = filter === 'All' ? marketplaceTools : marketplaceTools.filter(t => t.category === filter);

  const totalCost = purchasedTools.reduce((acc, id) => {
    const tool = marketplaceTools.find(t => t.id === id);
    return acc + (tool ? tool.price : 0);
  }, 0);

  const deltaEX = currentMetrics.exScore - baseMetrics.exScore;
  const deltaROI = currentMetrics.roi - baseMetrics.roi;

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
      {/* Header & Filters */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="font-mono text-cyan" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Technology Investment Catalog</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Select interventions to model their impact on your workforce twin.</p>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className="btn font-mono"
              style={{ 
                padding: '4px 12px', 
                fontSize: '0.85rem', 
                borderRadius: '16px',
                background: filter === cat ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                color: filter === cat ? '#000' : 'var(--muted)',
                border: `1px solid ${filter === cat ? 'transparent' : 'var(--border)'}`
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: 0 }}>
        {/* Catalog Grid */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <AnimatePresence>
              {filteredTools.map(tool => {
                const isSelected = purchasedTools.includes(tool.id);
                const Icon = iconMap[tool.icon] || ShoppingBag;
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={tool.id}
                    className="glass-card"
                    style={{ 
                      padding: '1.5rem', 
                      display: 'flex', 
                      flexDirection: 'column',
                      border: isSelected ? '1px solid var(--accent3)' : undefined,
                      boxShadow: isSelected ? '0 0 20px rgba(16, 185, 129, 0.1)' : undefined,
                      position: 'relative'
                    }}
                  >
                    {tool.tag && (
                      <span className="font-mono" style={{ position: 'absolute', top: '-10px', right: '16px', background: 'var(--accent2)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {tool.tag}
                      </span>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                       <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', height: 'fit-content' }}>
                         <Icon size={24} className="text-cyan" />
                       </div>
                       <div>
                         <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px 0' }}>{tool.name}</h3>
                         <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{tool.vendor}</div>
                         <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', marginTop: '4px', color: 'var(--text)' }}>
                           {tool.category}
                         </div>
                       </div>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--muted)', flex: 1, marginBottom: '1.5rem' }}>
                      {tool.description}
                    </p>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem' }}>
                       <div className="font-mono text-cyan" style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '8px' }}>
                         {tool.priceLabel}
                       </div>
                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {Object.entries(tool.effects).map(([key, val]) => (
                            <span key={key} className="font-mono" style={{ fontSize: '0.75rem', color: val > 0 ? 'var(--accent3)' : 'var(--danger)' }}>
                              {val > 0 ? '+' : ''}{val} {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          ))}
                       </div>
                    </div>

                    <button 
                      className={`btn ${isSelected ? '' : 'btn-primary'}`}
                      style={{ 
                        width: '100%', 
                        justifyContent: 'center', 
                        background: isSelected ? 'rgba(16, 185, 129, 0.2)' : undefined,
                        border: isSelected ? '1px solid var(--accent3)' : undefined,
                        color: isSelected ? 'var(--accent3)' : undefined
                      }}
                      onClick={() => onToggleTool(tool.id)}
                    >
                      {isSelected ? <><Check size={18} /> Added to Twin</> : <><Plus size={18} /> Add to Simulation</>}
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Investment Summary Panel */}
        <div className="glass-card" style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
           <h3 className="font-mono text-cyan" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <ShoppingBag size={20} /> Investment Summary
           </h3>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
               <span style={{ color: 'var(--muted)' }}>Active Tools</span>
               <span className="font-mono" style={{ fontWeight: 'bold' }}>{purchasedTools.length}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
               <span style={{ color: 'var(--muted)' }}>Annual Cost / User</span>
               <span className="font-mono text-cyan" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>${totalCost}</span>
             </div>
           </div>

           <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Projected Live Impact</div>
             
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span>EX Score Delta</span>
               <span className="font-mono" style={{ color: deltaEX >= 0 ? 'var(--accent3)' : 'var(--danger)' }}>
                 {deltaEX >= 0 ? '+' : ''}{deltaEX} pts
               </span>
             </div>
             
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span>ROI Delta</span>
               <span className="font-mono" style={{ color: deltaROI >= 0 ? 'var(--accent3)' : 'var(--danger)' }}>
                 {deltaROI >= 0 ? '+' : ''}{deltaROI}%
               </span>
             </div>
           </div>

           <button 
             className="btn btn-secondary" 
             style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}
             onClick={() => purchasedTools.forEach(t => onToggleTool(t))}
           >
             Clear All Investments
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Marketplace;
