import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PersonaRadarChart = ({ personaMetrics }) => {
  // Translate personaMetrics object into Recharts uniform data array mapping by dimensions
  // The dimensions are: Productivity, Collaboration, Experience, Security, Adoption, Efficiency
  
  const axes = ['productivity', 'collaboration', 'experience', 'security', 'adoption', 'efficiency'];
  const data = axes.map(axis => {
    const row = { subject: axis.charAt(0).toUpperCase() + axis.slice(1), fullMark: 100 };
    Object.keys(personaMetrics).forEach(pKey => {
      row[personaMetrics[pKey].persona] = personaMetrics[pKey].scores[axis];
    });
    return row;
  });

  const getPersonaColor = (key) => personaMetrics[key]?.color || '#fff';

  return (
    <div className="glass-card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 className="font-mono text-cyan" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Workforce Impact Radar</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--surface2)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}
              itemStyle={{ fontFamily: 'var(--font-mono)' }}
            />
            <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '12px', paddingTop: '10px' }} />
            
            {Object.keys(personaMetrics).map((pKey) => {
              const persona = personaMetrics[pKey];
              return (
                <Radar 
                  key={pKey}
                  name={persona.persona} 
                  dataKey={persona.persona} 
                  stroke={persona.color} 
                  fill={persona.color} 
                  fillOpacity={0.3} 
                  isAnimationActive={true}
                  animationDuration={800}
                />
              )
            })}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PersonaRadarChart;
