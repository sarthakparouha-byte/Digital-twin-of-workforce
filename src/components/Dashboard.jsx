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
      style={{
        /* ✅ FIXED: sidebar is 220px fixed. Push content right with marginLeft,
           let flex handle remaining width without using 100vw which includes scrollbar */
        marginLeft: '220px',
        flex: 1,
        minHeight: '100vh',
        padding: '36px 40px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-sora)',
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--ink-1)',
            letterSpacing: '-0.3px'
          }}>Digital Workforce Twin</div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            background: 'var(--green-dim)',
            border: '1px solid rgba(62,207,142,0.25)',
            color: 'var(--green)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            padding: '5px 12px',
            borderRadius: '100px',
            marginTop: '10px'
          }}>
            <span style={{
              width: '6px', height: '6px',
              background: 'var(--green)',
              borderRadius: '50%',
              animation: 'pulse-dot 2s infinite',
              display: 'inline-block',
            }}></span>
            Simulation Active
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
          <button className="btn btn-outline" onClick={onSaveScenario}>
            <Save size={14} /> <span>Save Scenario</span>
          </button>
          <button className="btn btn-primary" onClick={onRunAI}>
            <Bot size={14} /> <span>Run AI Optimizer</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '28px'
      }}>
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

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left Column */}
        <SliderPanel
          state={state}
          onChange={onStateChange}
          onReset={onReset}
          onOptimize={onOptimize}
        />

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '360px' }}>
            <div style={{
              fontFamily: 'var(--font-sora)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--ink-1)',
              marginBottom: '20px',
              letterSpacing: '-0.1px'
            }}>Workforce Impact Radar</div>
            <div style={{ flex: 1, minHeight: 0, height: '280px' }}>
              <PersonaRadarChart personaMetrics={personaMetrics} />
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
            <div style={{
              fontFamily: 'var(--font-sora)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--ink-1)',
              marginBottom: '20px',
              letterSpacing: '-0.1px'
            }}>EX Score by Persona</div>
            <div style={{ flex: 1, minHeight: 0, height: '220px' }}>
              <PersonaBarChart personaMetrics={personaMetrics} globalExScore={currentMetrics.exScore} />
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}} />
    </motion.div>
  );
};

export default Dashboard;