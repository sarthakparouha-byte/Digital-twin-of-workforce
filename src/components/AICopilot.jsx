import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, CheckCircle2, ChevronRight, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { optimalState, marketplaceTools } from '../core/engine';

const AICopilot = ({ currentState, onOptimize, onViewChange }) => {
  const [phase, setPhase] = useState('ANALYZING'); // ANALYZING, COMPLETE, ERROR
  const [analysisText, setAnalysisText] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  // Prevent React 18 Strict Mode from double-executing the API request
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    const fetchAnalysis = async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentState)
        });
        
        if (!response.ok) throw new Error("Backend AI connection failed.");
        const data = await response.json();

        setAnalysisText(data.analysisText || "Analysis complete. Optimization recommended.");
        
        const recTools = (data.recommendedToolIds || [])
          .map(id => marketplaceTools.find(t => t.id === id))
          .filter(Boolean);
        
        setRecommendations(recTools);
        setPhase('COMPLETE');
      } catch (error) {
         setErrorMsg(error.message);
         setPhase('ERROR');
      }
    };
    
    fetchAnalysis();
  }, [currentState]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '2rem', 
        height: '100vh', 
        padding: '3.5rem 4rem',
        marginLeft: '260px', /* Account for sidebar */
        maxWidth: '1200px',
        fontFamily: 'var(--font-body)',
        color: 'var(--ink-1)'
      }}
    >
      {/* Premium Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <div style={{ background: 'var(--accent)', padding: '0.85rem', borderRadius: '12px', display: 'flex' }}>
           <Sparkles size={24} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff', margin: 0, letterSpacing: '-0.3px', fontFamily: 'var(--font-sora)' }}>
            TwinForge Executive AI Analysis
          </h2>
          <p style={{ color: 'var(--ink-3)', margin: '6px 0 0 0', fontSize: '0.9rem' }}>
            Powered by Generative AI • Scanning enterprise telemetry
          </p>
        </div>
      </div>

      {phase === 'ANALYZING' && (
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--ink-2)', gap: '1.5rem', marginTop: '4rem' }}>
            <Loader2 className="animate-spin" size={44} color="var(--accent)" />
            <div style={{ fontSize: '1.1rem', fontWeight: 500, letterSpacing: '-0.2px' }}>Correlating telemetry data & pinpointing friction...</div>
         </div>
      )}

      {phase === 'ERROR' && (
         <div className="card" style={{ padding: '2rem', border: '1px solid var(--warn)', background: 'rgba(239, 68, 68, 0.05)', color: 'var(--warn)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem', borderRadius: '16px' }}>
            <AlertTriangle size={32} />
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Analysis Failed</div>
            <div style={{ color: 'var(--warn)', opacity: 0.8 }}>{errorMsg || "Unable to reach the Gemini API. Please check your network connection and backend configuration."}</div>
         </div>
      )}

      {phase === 'COMPLETE' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ display: 'flex', gap: '2.5rem', marginTop: '1rem' }}>
          
          <div style={{ flex: 1.8, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* The Analysis Context */}
            <div className="card" style={{ padding: '2.5rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--ink-1)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-sora)' }}>
                 <Bot size={22} color="var(--accent)" /> Strategic Insights
              </h3>
              <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--ink-2)', letterSpacing: '0.1px' }}>
                {analysisText}
              </div>
            </div>

            {/* Action Logic */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn-apply" 
                  onClick={() => onOptimize(recommendations.map(r => r.id))}
                  style={{ background: 'var(--accent)', color: '#fff', padding: '1rem 1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, borderRadius: '12px', border: 'none', cursor: 'pointer', flex: 1, justifyContent: 'center' }}
                >
                  <CheckCircle2 size={18} />
                  Authorize Interventions
                </button>
                <button 
                  className="btn-ghost" 
                  onClick={() => onViewChange('dashboard')}
                  style={{ padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: 600, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1, justifyContent: 'center', background: 'var(--surface-2)', color: 'var(--ink-1)', border: '1px solid var(--border-2)' }}
                >
                  Return to Dashboard
                </button>
            </div>
          </div>

          {/* Sidebar Tools Grid */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--ink-3)', marginBottom: '0.5rem' }}>
               Recommended Tooling
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendations.length > 0 ? recommendations.map((tool, idx) => (
                 <motion.div 
                   key={tool.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                   className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '12px' }}
                 >
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink-1)', marginBottom: '6px', fontFamily: 'var(--font-sora)' }}>{tool.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-3)', marginBottom: '1.25rem' }}>{tool.vendor}</div>
                    <div style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', background: 'rgba(79, 124, 255, 0.1)', padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                      {tool.priceLabel}
                    </div>
                 </motion.div>
              )) : (
                 <div style={{ color: 'var(--ink-3)', fontSize: '0.9rem', padding: '1rem' }}>No specific tools identified.</div>
              )}
            </div>
          </div>

        </motion.div>
      )}
    </motion.div>
  );
};

export default AICopilot;
