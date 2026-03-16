import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

const PersonaBarChart = ({ personaMetrics, globalExScore }) => {
  const data = Object.keys(personaMetrics).map(pKey => {
    return {
      name: personaMetrics[pKey].persona,
      score: personaMetrics[pKey].exScore,
      color: personaMetrics[pKey].color
    };
  });

  return (
    <div className="glass-card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 className="font-mono text-cyan" style={{ fontSize: '1rem', marginBottom: '1rem' }}>EX Score by Persona</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="var(--muted)" 
              tick={{ fill: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="var(--muted)" 
              tick={{ fill: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: 'var(--surface2)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}
            />
            <ReferenceLine y={globalExScore} stroke="var(--text)" strokeDasharray="3 3" label={{ position: 'top', value: `Avg ${globalExScore}`, fill: 'var(--text)', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
            
            <Bar dataKey="score" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PersonaBarChart;
