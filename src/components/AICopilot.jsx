import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, CheckCircle2, ChevronRight } from 'lucide-react';
import { optimalState, marketplaceTools } from '../core/engine';

const AICopilot = ({ currentState, onOptimize, onViewChange }) => {
  const [phase, setPhase] = useState('IDLE'); // IDLE, SCANNING, CONNECTING, ANALYZING, RECOMMENDING, OPTIMIZING, COMPLETE
  const [lines, setLines] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines]);

  const addLine = (text, delay = 0) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setLines(prev => [...prev, text]);
        resolve();
      }, delay);
    });
  };

  const startAnalysis = async () => {
    setPhase('SCANNING');
    setLines([]);
    setRecommendations([]);

    await addLine("> Initializing TwinForge Analysis Engine v3.0...", 300);
    await addLine("> Packaging current telemetry state parameters...", 400);

    setPhase('CONNECTING');
    await addLine("> Opening connection to Google Gemini AI API...", 600);
    
    setPhase('ANALYZING');
    await addLine("> Transmitting data payload... awaiting generative analysis...", 200);

    try {
      // Hitching to the new Express Backend
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentState)
      });
      
      if (!response.ok) throw new Error("API returned an error");
      const data = await response.json();

      setPhase('RECOMMENDING');
      await addLine("> LIVE ANALYSIS RECEIVED FROM GEMINI:", 400);
      
      // Stream the LLM text output
      const aiText = data.analysisText || "Analysis complete.";
      const chars = aiText.split('');
      let currentString = "> ";
      
      // Simulate real-time streaming of the response
      for (let i = 0; i < chars.length; i++) {
        currentString += chars[i];
        setLines(prev => {
          const newLines = [...prev];
          newLines[newLines.length - 1] = currentString;
          return newLines;
        });
        await new Promise(r => setTimeout(r, 20)); // Fast typing effect
      }

      await addLine("> IDENTIFYING INTERVENTION PATHS...", 600);

      // Map the recommended tool IDs back to our objects
      const recTools = data.recommendedToolIds
        .map(id => marketplaceTools.find(t => t.id === id))
        .filter(Boolean);
      
      for (const tool of recTools) {
        await addLine(`> PREPARING DEPLOYMENT: ${tool.name}`, 300);
        setRecommendations(prev => [...prev, tool]);
      }

    } catch (error) {
       await addLine(`> ERROR: Failed to reach Gemini API. Ensure backend is running and API key is set.`, 0);
       await addLine(`> ${error.message}`, 0);
       setPhase('IDLE');
       return;
    }

    setPhase('OPTIMIZING');
    await new Promise(r => setTimeout(r, 1000));
    await addLine("> Calculating optimal intervention stack...", 600);
    
    const dimensions = Object.keys(optimalState);
    for (let dim of dimensions) {
      if (currentState[dim] !== optimalState[dim]) {
        await addLine(`> OPTIMIZING: ${dim} [${currentState[dim]} → ${optimalState[dim]}] ████████████`, 150);
      }
    }

    setPhase('COMPLETE');
    await addLine("> ✓ OPTIMIZATION COMPLETE", 500);
    // Pass back the recommended tools to automatically activate them in the simulation
    const toolIds = recommendations.map(r => r.id);
    onOptimize(toolIds); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      style={{ 
        display: 'flex', 
        gap: '2rem', 
        height: '100vh', 
        padding: '2rem',
        marginLeft: '220px',
        maxWidth: 'calc(100vw - 220px)',
        overflowY: 'auto'
      }}
    >
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
           <div>
             <h2 className="font-mono text-cyan" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
               <Bot size={28} className={phase !== 'IDLE' && phase !== 'COMPLETE' ? 'animate-pulse' : ''} />
               TwinForge Live AI Copilot
             </h2>
           </div>
           <div>
             {phase === 'IDLE' && <span className="font-mono text-muted">READY</span>}
             {phase !== 'IDLE' && phase !== 'COMPLETE' && <span className="font-mono text-amber animate-pulse">ANALYZING...</span>}
             {phase === 'COMPLETE' && <span className="font-mono text-green">COMPLETE</span>}
           </div>
        </div>

        {/* Terminal */}
        <div style={{
           flex: 1, background: '#040b16', borderRadius: '8px', padding: '1.5rem', 
           fontFamily: 'var(--font-mono)', color: 'var(--accent3)', overflowY: 'auto',
           fontSize: '0.9rem', lineHeight: '1.6', border: '1px solid rgba(16, 185, 129, 0.2)',
           boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
        }}>
          {lines.map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{line}</motion.div>
          ))}
          {phase !== 'IDLE' && phase !== 'COMPLETE' && (
            <div className="cursor-blink" style={{ color: 'var(--accent3)' }}>_</div>
          )}
          {phase === 'IDLE' && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <button 
                className="btn btn-primary" 
                style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--accent2), var(--accent))' }}
                onClick={startAnalysis}
              >
                <Bot size={24} />
                Connect to Gemini API
              </button>
            </div>
          )}
          {phase === 'COMPLETE' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => onViewChange('dashboard')}
                  style={{ background: 'var(--accent3)', color: '#000' }}
                >
                  View Results on Dashboard
                  <ChevronRight size={18} />
                </button>
             </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Recommended Tools Panel */}
      <AnimatePresence>
         {recommendations.length > 0 && (
            <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
               className="glass-card" style={{ width: '350px', display: 'flex', flexDirection: 'column' }}
            >
               <h3 className="font-mono text-cyan" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} /> AI Prescribed Interventions
               </h3>
               <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
                  {recommendations.map(tool => (
                    <motion.div 
                      key={tool.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px' }}
                    >
                       <div style={{ fontWeight: 'bold', color: 'var(--text)', marginBottom: '4px' }}>{tool.name}</div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{tool.vendor}</div>
                       <div className="font-mono text-cyan" style={{ fontSize: '0.8rem' }}>{tool.priceLabel}</div>
                    </motion.div>
                  ))}
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AICopilot;
