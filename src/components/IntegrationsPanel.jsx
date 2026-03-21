import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

const IntegrationsPanel = () => {
  const integrations = [
    { name: "Microsoft 365", status: "Connected", detail: "Last sync: 2 mins ago", icon: CheckCircle, color: "var(--green)" },
    { name: "Slack Workspace", status: "Connected", detail: "1,247 events today", icon: CheckCircle, color: "var(--green)" },
    { name: "ServiceNow ITSM", status: "Partial", detail: "3 tickets pending", icon: AlertTriangle, color: "var(--warn)" },
    { name: "Google Workspace", status: "Not Connected", detail: "Awaiting Auth", icon: XCircle, color: "var(--ink-3)" }
  ];

  return (
    <div className="card" style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink-1)', marginBottom: '20px', letterSpacing: '-0.2px' }}>Data Integrations</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {integrations.map((int, i) => {
          const Icon = int.icon;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: i !== integrations.length - 1 ? '16px' : 0, borderBottom: i !== integrations.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={int.color} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-1)' }}>{int.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {int.status === 'Connected' && <Clock size={10} />}
                    {int.detail}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: int.color, padding: '4px 8px', background: int.status === 'Not Connected' ? 'var(--surface-2)' : `${int.color}15`, borderRadius: '4px', border: int.status === 'Not Connected' ? '1px solid var(--border)' : 'none' }}>
                {int.status}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default IntegrationsPanel;
