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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 5 }}>
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f7cff" stopOpacity={1}/>
                <stop offset="100%" stopColor="#4f7cff" stopOpacity={0.4}/>
              </linearGradient>
              <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={1}/>
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.4}/>
              </linearGradient>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3ecf8e" stopOpacity={1}/>
                <stop offset="100%" stopColor="#3ecf8e" stopOpacity={0.35}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="var(--ink-3)" 
              tick={{ fill: 'var(--ink-3)', fontSize: 12, fontFamily: 'var(--font-body)' }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="var(--ink-3)" 
              tick={{ fill: 'var(--ink-3)', fontSize: 10, fontFamily: 'var(--font-body)' }}
              axisLine={false}
              tickLine={false}
              hide
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--ink-1)', fontFamily: 'var(--font-body)' }}
            />
            <ReferenceLine 
              y={globalExScore} 
              stroke="var(--amber)" 
              strokeDasharray="4 4" 
              strokeOpacity={0.5}
              label={{ position: 'top', value: `— Avg ${globalExScore}`, fill: 'var(--amber)', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-body)', textAnchor: 'end', offset: 10 }} 
            />
            
            <Bar dataKey="score" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={800}>
              {data.map((entry, index) => {
                let gradId = "blueGradient";
                if(entry.name === "Sales") gradId = "violetGradient";
                if(entry.name === "Operations" || entry.name === "Operations Team") gradId = "greenGradient";
                return <Cell key={`cell-${index}`} fill={`url(#${gradId})`} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PersonaBarChart;
