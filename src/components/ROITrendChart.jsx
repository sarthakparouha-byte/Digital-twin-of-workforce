import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ROITrendChart = ({ currentROI }) => {
  const data = useMemo(() => {
    // Generate a 6-month projection
    // Month 1 starts near baseline (38), Month 6 hits the currentROI curve
    const curve = [];
    let start = 38; 
    const target = currentROI;
    const diff = target - start;
    
    for(let i=1; i<=6; i++) {
       // simple ease-out curve mapping
       const progress = 1 - Math.pow(1 - (i/6), 2);
       curve.push({
         month: `M${i}`,
         roi: Math.round(start + (diff * progress))
       });
    }
    return curve;
  }, [currentROI]);

  return (
    <div className="card" style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink-1)', marginBottom: '8px', letterSpacing: '-0.2px' }}>6-Month ROI Projection</h3>
      <p style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '20px' }}>Simulated tracking based on active parameters</p>
      
      <div style={{ width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="month" stroke="var(--ink-3)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--ink-3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={val => `${val}%`} />
            <Tooltip 
              contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#2563eb' }}
              formatter={(value) => [`${value}%`, 'Projected ROI']}
            />
            <Line type="monotone" dataKey="roi" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg)', stroke: 'var(--accent)', strokeWidth: 2 }} activeDot={{ r: 6 }} animationDuration={300} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ROITrendChart;
