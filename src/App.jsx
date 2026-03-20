import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AICopilot from './components/AICopilot';
import Marketplace from './components/Marketplace';
import History from './components/History';
import WorkforceSettingsModal from './components/WorkforceSettingsModal';
import { baselineState, computeMetrics, computePersonaMetrics, marketplaceTools, optimalState } from './core/engine';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  
  // App State
  const [simState, setSimState] = useState(baselineState);
  const [activeView, setActiveView] = useState('dashboard');
  const [purchasedTools, setPurchasedTools] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [workforceSettings, setWorkforceSettings] = useState({
    orgName: 'TwinForge AI',
    totalEmployees: 2400,
    avgSalary: 85000,
    personas: {
      engineering: { headcount: 480 },
      sales: { headcount: 620 },
      operations: { headcount: 1300 }
    }
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fetch scenarios and settings from MongoDB on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scRes, setRes] = await Promise.all([
          fetch('/api/scenarios'),
          fetch('/api/settings')
        ]);
        
        if (scRes.ok) {
          const scData = await scRes.json();
          setScenarios(scData.map(d => ({ ...d, id: d._id })));
        }
        
        if (setRes.ok) {
          const setData = await setRes.json();
          setWorkforceSettings(setData);
        }
      } catch (err) {
        console.error("Failed to fetch data from backend:", err);
      }
    };
    
    fetchData();
    
    const t = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  // Compute effective state by layering tools on top of base simState
  const effectiveState = useMemo(() => {
    let state = { ...simState };
    const tools = purchasedTools.map(id => marketplaceTools.find(t => t.id === id)).filter(Boolean);
    
    tools.forEach(t => {
      Object.entries(t.effects).forEach(([key, val]) => {
        if (state[key] !== undefined) {
          state[key] = Math.min(100, Math.max(0, state[key] + val));
        }
      });
    });
    return state;
  }, [simState, purchasedTools]);

  const baselineMetrics = useMemo(() => computeMetrics(baselineState), []);
  const currentMetrics = useMemo(() => computeMetrics(effectiveState), [effectiveState]);
  const personaMetrics = useMemo(() => computePersonaMetrics(effectiveState, workforceSettings.personas), [effectiveState, workforceSettings]);

  // Handlers
  const handleStateChange = (key, value) => {
    setSimState(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSimState(baselineState);
    setPurchasedTools([]);
  };

  const handleOptimize = (recToolIds = []) => {
    if (recToolIds.length > 0) {
      // If AI recommended tools, just apply the tools
      setPurchasedTools(recToolIds);
    } else {
      setSimState(optimalState);
      setPurchasedTools([]); 
    }
    setActiveView('dashboard');
  };

  const handleToggleTool = (id) => {
    setPurchasedTools(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleSaveScenario = async () => {
    const scenarioPayload = {
      name: `Scenario ${scenarios.length + 1} - ${purchasedTools.length > 0 ? 'AI Tool Investment' : 'Base Config'}`,
      state: effectiveState,
      tools: purchasedTools,
      metrics: currentMetrics
    };

    try {
      const res = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenarioPayload)
      });
      if (res.ok) {
        const saved = await res.json();
        setScenarios([{ ...saved, id: saved._id }, ...scenarios]);
        setActiveView('history');
      }
    } catch (err) {
      console.error("Failed to save to MongoDB", err);
    }
  };

  const handleRestoreScenario = (savedState, savedTools) => {
    setSimState(savedState);
    setPurchasedTools(savedTools || []);
    setActiveView('dashboard');
  };

  const handleUpdateSettings = async (newSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const saved = await res.json();
        setWorkforceSettings(saved);
        setIsSettingsOpen(false);
      }
    } catch (err) {
      console.error("Failed to save settings", err);
    }
  };

  // Splash Screen
  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg)', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="font-mono text-cyan" 
           style={{ fontSize: '3rem', letterSpacing: '2px', marginBottom: '1rem' }}
        >
          TWINFORGE AI
        </motion.div>
        <motion.div 
           style={{ width: '200px', height: '2px', backgroundColor: 'var(--surface2)', overflow: 'hidden' }}
        >
           <motion.div 
             style={{ width: '100%', height: '100%', backgroundColor: 'var(--accent)' }}
             animate={{ x: ['-100%', '100%'] }}
             transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
           />
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        exScore={currentMetrics.exScore} 
        roi={currentMetrics.roi} 
        totalEmployees={workforceSettings.totalEmployees}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <Dashboard 
              key="dashboard" state={simState} baselineMetrics={baselineMetrics} currentMetrics={currentMetrics}
              personaMetrics={personaMetrics} onStateChange={handleStateChange} onReset={handleReset}
              onOptimize={handleOptimize} onRunAI={() => setActiveView('copilot')} onSaveScenario={handleSaveScenario}
            />
          )}

          {activeView === 'copilot' && (
             <AICopilot 
               key="copilot" currentState={effectiveState} onOptimize={handleOptimize} onViewChange={setActiveView}
             />
          )}

          {activeView === 'marketplace' && (
             <Marketplace 
               key="marketplace" purchasedTools={purchasedTools} onToggleTool={handleToggleTool}
               currentMetrics={currentMetrics} baseMetrics={baselineMetrics}
             />
          )}

          {activeView === 'history' && (
             <History 
               key="history" scenarios={scenarios} onRestore={handleRestoreScenario}
             />
          )}
        </AnimatePresence>

        <WorkforceSettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          settings={workforceSettings} 
          onSave={handleUpdateSettings} 
        />
      </main>
    </div>
  );
}

export default App;
