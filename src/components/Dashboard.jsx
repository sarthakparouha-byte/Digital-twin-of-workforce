import React from 'react';
import KPICard from './KPICard';
import SliderPanel from './SliderPanel';
import PersonaRadarChart from './RadarChart';
import PersonaBarChart from './PersonaBarChart';
import { Bot, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = ({ state, baselineMetrics, currentMetrics, personaMetrics, onStateChange, onReset, onOptimize, onRunAI, onSaveScenario }) => {

  return (
    <motion.div 
      className="dashboard-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem', gap: '2rem', overflowY: 'auto' }}
    >
      {/* Topbar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
         <div>
            <h2 className="font-mono text-cyan" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Digital Workforce Twin</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)' }}>
               <span style={{
                 width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent3)',
                 boxShadow: '0 0 8px var(--accent3)', animation: 'pulse 2s infinite'
               }}></span>
               <span className="font-mono" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>SIMULATION ACTIVE</span>
            </div>
         </div>

         <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn btn-secondary" onClick={onSaveScenario}>
             <Save size={18} />
             Save Scenario
           </button>
           <button className="btn btn-primary" onClick={onRunAI}>
             <Bot size={18} />
             Run AI Optimizer
           </button>
         </div>
      </header>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
         <KPICard 
           title="Employee EX Score" 
           value={currentMetrics.exScore} 
           previousValue={baselineMetrics.exScore} 
         />
         <KPICard 
           title="Projected ROI" 
           value={currentMetrics.roi} 
           previousValue={baselineMetrics.roi} 
           suffix="%"
         />
         <KPICard 
           title="Productivity Index" 
           value={currentMetrics.scores.productivity} 
           previousValue={baselineMetrics.scores.productivity} 
         />
         <KPICard 
           title="Adoption Rate" 
           value={currentMetrics.scores.adoption} 
           previousValue={baselineMetrics.scores.adoption} 
         />
      </div>

      {/* Main Content Areas */}
      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>
         {/* Left Column */}
         <div style={{ flex: '6', minWidth: 0, height: '100%' }}>
           <SliderPanel 
              state={state} 
              onChange={onStateChange} 
              onReset={onReset} 
              onOptimize={onOptimize} 
           />
         </div>

         {/* Right Column */}
         <div style={{ flex: '4', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
            <div style={{ flex: 1, minHeight: 0 }}>
               <PersonaRadarChart personaMetrics={personaMetrics} />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
               <PersonaBarChart personaMetrics={personaMetrics} globalExScore={currentMetrics.exScore} />
            </div>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}} />
    </motion.div>
  );
};

export default Dashboard;
