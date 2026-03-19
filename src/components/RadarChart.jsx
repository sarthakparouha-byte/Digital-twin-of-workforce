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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="var(--ink-3)" opacity={0.25} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'var(--ink-3)', fontSize: 11, fontFamily: 'var(--font-body)' }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--ink-1)', fontFamily: 'var(--font-body)' }}
              itemStyle={{ fontFamily: 'var(--font-body)' }}
            />
            <Legend 
              iconType="circle" 
              iconSize={8}
              formatter={(value) => <span style={{ color: 'var(--ink-2)', paddingLeft: '6px' }}>{value}</span>}
              wrapperStyle={{ 
                fontFamily: 'var(--font-body)', 
                fontSize: '12px', 
                paddingTop: '20px',
                textAlign: 'center'
              }} 
            />
            
            {Object.keys(personaMetrics).map((pKey) => {
              const persona = personaMetrics[pKey];
              return (
                <Radar 
                  key={pKey}
                  name={persona.persona} 
                  dataKey={persona.persona} 
                  stroke={persona.color} 
                  fill={persona.color} 
                  fillOpacity={0.15} 
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
