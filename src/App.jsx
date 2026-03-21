import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AICopilot from './components/AICopilot';
import Marketplace from './components/Marketplace';
import History from './components/History';
import WorkforceSettingsModal from './components/WorkforceSettingsModal';
import LandingPage from './components/auth/LandingPage';
import LoginPage from './components/auth/LoginPage';
import OnboardingWizard from './components/auth/OnboardingWizard';
import IntegrationsPanel from './components/IntegrationsPanel';
import ROITrendChart from './components/ROITrendChart';
import NetworkGraph from './components/NetworkGraph';
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
    industry: 'Technology',
    totalEmployees: 2400,
    avgSalary: 85000,
    personas: {
      engineering: { headcount: 480 },
      sales: { headcount: 620 },
      operations: { headcount: 1300 }
    }
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [authRoute, setAuthRoute] = useState('loading'); // 'loading', 'landing', 'login', 'onboarding', 'dashboard'

  // App Initialization
  useEffect(() => {
    const initApp = async () => {
      setTimeout(async () => {
        const userStr = localStorage.getItem('user');
        const firstLoginStr = localStorage.getItem('firstLogin');

        if (!userStr) {
          setAuthRoute('landing');
        } else if (firstLoginStr !== 'false') {
          setAuthRoute('onboarding');
        } else {
          // Fully onboarded user, load baseline & org info
          try {
            const cachedBaseline = localStorage.getItem('baseline');
            if (cachedBaseline) setSimState(JSON.parse(cachedBaseline));
            
            const cachedOrg = localStorage.getItem('organization');
            if (cachedOrg) {
              const org = JSON.parse(cachedOrg);
              setWorkforceSettings(prev => ({
                ...prev,
                orgName: org.name || prev.orgName,
                industry: org.industry || prev.industry,
                totalEmployees: org.employeeCount || prev.totalEmployees
              }));
            }
          } catch(e) {}
          setAuthRoute('dashboard');
        }

        // Fetch history silently
        try {
          const scRes = await fetch('/api/scenarios');
          if (scRes.ok) {
             const scData = await scRes.json();
             setScenarios(scData.map(d => ({ ...d, id: d._id })));
          }
        } catch(err) {
          console.error("Failed to fetch scenes:", err);
        }
        setLoading(false);
      }, 1500);
    };
    
    initApp();
  }, []);

  const baselineMetrics = useMemo(() => computeMetrics(baselineState), []);
  const currentMetrics = useMemo(() => computeMetrics(simState), [simState]);
  const personaMetrics = useMemo(() => computePersonaMetrics(simState, workforceSettings.personas), [simState, workforceSettings]);

  // Handlers
  const handleStateChange = (key, value) => {
    setSimState(prev => ({ ...prev, [key]: value }));
  };

  const handleLogin = (userObj) => {
    localStorage.setItem('user', JSON.stringify(userObj));
    setAuthRoute('onboarding');
  };

  const handleCompleteOnboarding = (orgData, baselineData) => {
    localStorage.setItem('organization', JSON.stringify(orgData));
    localStorage.setItem('baseline', JSON.stringify(baselineData));
    localStorage.setItem('firstLogin', 'false');
    
    setSimState(baselineData);
    setWorkforceSettings(prev => ({
       ...prev,
       orgName: orgData.name,
       industry: orgData.industry,
       totalEmployees: orgData.employeeCount || prev.totalEmployees
    }));
    setAuthRoute('dashboard');
  };

  const handleSignOut = () => {
    localStorage.clear();
    setSimState(baselineState);
    setScenarios([]);
    setPurchasedTools([]);
    setAuthRoute('landing');
  };

  const handleReset = () => {
    setSimState(baselineState);
    setPurchasedTools([]);
  };

  const handleOptimize = (recToolIds = []) => {
    if (recToolIds.length > 0) {
      // Apply recommended tools math into raw simState
      setSimState(prev => {
        let newState = { ...prev };
        const toolsToApply = recToolIds.filter(id => !purchasedTools.includes(id)).map(id => marketplaceTools.find(t => t.id === id));
        toolsToApply.forEach(tool => {
           if (tool) {
             Object.entries(tool.effects).forEach(([key, val]) => {
               if (newState[key] !== undefined) newState[key] = Math.min(100, Math.max(0, newState[key] + val));
             });
           }
        });
        return newState;
      });
      // Deduplicate additions
      setPurchasedTools(prev => Array.from(new Set([...prev, ...recToolIds])));
    } else {
      setSimState(optimalState);
      setPurchasedTools([]); 
    }
    setActiveView('dashboard');
  };

  const handleToggleTool = (id) => {
    const isPurchased = purchasedTools.includes(id);
    const tool = marketplaceTools.find(t => t.id === id);
    if (tool) {
      setSimState(prev => {
        let newState = { ...prev };
        Object.entries(tool.effects).forEach(([key, val]) => {
          const delta = isPurchased ? -val : val;
          if (newState[key] !== undefined) {
             newState[key] = Math.min(100, Math.max(0, newState[key] + delta));
          }
        });
        return newState;
      });
    }
    setPurchasedTools(prev => isPurchased ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleSaveScenario = async () => {
    const scenarioPayload = {
      name: `Scenario ${scenarios.length + 1} - ${purchasedTools.length > 0 ? 'AI Tool Investment' : 'Base Config'}`,
      state: simState,
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

  const handleDeleteScenario = async (id) => {
    try {
      const res = await fetch(`/api/scenarios/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setScenarios(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete scenario", err);
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

  // Splash Screen & Auth Routes
  if (loading || authRoute === 'loading') {
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

  if (authRoute === 'landing') return <LandingPage onNavigate={setAuthRoute} />;
  if (authRoute === 'login') return <LoginPage onLogin={handleLogin} />;
  if (authRoute === 'onboarding') return <OnboardingWizard onComplete={handleCompleteOnboarding} />;

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        exScore={currentMetrics.exScore} 
        roi={currentMetrics.roi} 
        totalEmployees={workforceSettings.totalEmployees}
        onOpenSettings={() => setIsSettingsOpen(true)}
        user={currentUser}
        onSignOut={handleSignOut}
      />
      <main style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <Dashboard 
              key="dashboard"
              state={simState} 
              baselineMetrics={baselineMetrics} 
              currentMetrics={currentMetrics}
              personaMetrics={personaMetrics} 
              workforceSettings={workforceSettings}
              userRole={currentUser?.role}
              onStateChange={handleStateChange} 
              onReset={handleReset}
              onOptimize={handleOptimize} 
              onRunAI={() => setActiveView('copilot')} 
              onSaveScenario={handleSaveScenario}
            />
          )}

          {activeView === 'copilot' && (
             <AICopilot 
               key="copilot" currentState={simState} onOptimize={handleOptimize} onViewChange={setActiveView}
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
               key="history" scenarios={scenarios} onRestore={handleRestoreScenario} onDelete={handleDeleteScenario}
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
