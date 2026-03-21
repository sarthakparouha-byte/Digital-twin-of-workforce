import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const NetworkGraph = ({ departments }) => {
  const data = useMemo(() => {
    const defaultDepts = { engineering: 480, sales: 620, operations: 1300 };
    const safeDepts = departments && Object.keys(departments).length > 0 ? departments : defaultDepts;
    const totalHeadcount = Object.values(safeDepts).reduce((a, b) => a + Number(b), 0);
    const nodeCount = 90; // Optimized for performance 
    
    const colors = {
      engineering: '#00d4ff',
      sales: '#7c3aed',
      operations: '#10b981',
      hr: '#f59e0b',
      finance: '#ec4899'
    };

    let nodes = [];
    const deptList = Object.keys(safeDepts);
    
    // Generate nodes spread across a scalable 100x100 percentage grid
    deptList.forEach(dept => {
      const share = (Number(safeDepts[dept]) || 0) / totalHeadcount;
      const amount = Math.max(1, Math.round(nodeCount * share));
      
      // Scatter clusters natively based on department
      const centerX = 20 + Math.random() * 60;
      const centerY = 20 + Math.random() * 60;

      for (let i=0; i<amount; i++) {
        nodes.push({ 
          id: `${dept}-${i}`, 
          group: dept, 
          color: colors[dept.toLowerCase()] || colors[dept] || '#888',
          x: Math.max(5, Math.min(95, centerX + (Math.random() - 0.5) * 50)),
          y: Math.max(5, Math.min(95, centerY + (Math.random() - 0.5) * 50)),
          size: 2 + Math.random() * 3
        });
      }
    });

    let links = [];
    // Link nodes that are spatially proximate to build the "web" effect
    for(let i=0; i<nodes.length; i++) {
        let n1 = nodes[i];
        let connections = 0;
        let maxConnections = Math.floor(Math.random() * 3) + 1;
        
        for(let j=i+1; j<nodes.length; j++) {
            let n2 = nodes[j];
            let dist = Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));
            if (dist < 18 && connections < maxConnections) {
                links.push({
                    id: `link-${n1.id}-${n2.id}`,
                    x1: n1.x, y1: n1.y,
                    x2: n2.x, y2: n2.y,
                    color: n1.group === n2.group ? n1.color : 'rgba(255,255,255,0.05)',
                    opacity: n1.group === n2.group ? 0.35 : 0.1
                });
                connections++;
            }
        }
    }

    return { nodes, links };
  }, [departments]);

  return (
    <div className="card" style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink-1)', marginBottom: '8px', letterSpacing: '-0.2px' }}>Collaboration Topography</h3>
      <p style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '16px' }}>Network clusters representing {Object.keys(departments || {}).length || 3} connected organizational departments.</p>
      
      <div style={{ width: '100%', height: '300px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.02)', position: 'relative' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Render connecting vectors */}
          {data.links.map(link => (
            <motion.line
              key={link.id}
              x1={`${link.x1}%`} y1={`${link.y1}%`}
              x2={`${link.x2}%`} y2={`${link.y2}%`}
              stroke={link.color}
              strokeWidth="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: link.opacity }}
              transition={{ duration: 1.5, delay: Math.random() }}
            />
          ))}

          {/* Render pulsing employee nodes */}
          {data.nodes.map(node => (
            <motion.circle
              key={node.id}
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.size}
              fill={node.color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.25, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 2 + Math.random() * 2, 
                repeat: Infinity, 
                repeatType: 'reverse',
                delay: Math.random() * 2
              }}
              style={{ filter: `drop-shadow(0 0 5px ${node.color})` }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default NetworkGraph;
