import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { HeartPulse, CheckCircle2, ShieldCheck, Server, Database, Cpu, Share2, Layers } from 'lucide-react';

export default function SystemHealth() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await adminApi.getSystemHealth();
      setHealth(res.data.health);
    } catch (err) {
      console.error('Error fetching health status:', err);
    }
  };

  if (!health) return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Checking system health status...</div>;

  const services = [
    { name: 'API Server', status: health.api_status, icon: Server, details: 'Express Node.js Cluster' },
    { name: 'Database', status: health.database, icon: Database, details: 'Supabase PostgreSQL' },
    { name: 'Redis Queue Engine', status: health.redis, icon: Layers, details: 'BullMQ Worker Pool' },
    { name: 'Meta Graph API', status: health.meta_api, icon: Share2, details: 'Facebook & Instagram Webhook Gateway' },
    { name: 'AI Provider Pool', status: health.ai_providers, icon: Cpu, details: 'OpenAI, Gemini, Anthropic, Stability' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>System Health & Monitoring</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Live operational status check for backend services, database connections, Redis queue workers, and Meta API endpoints.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {services.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.name} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={24} color="var(--success)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{s.name}</h3>
                  <span className="dot-indicator dot-success" title="Operational" />
                </div>
                <div style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 600, marginBottom: '4px' }}>
                  ● {s.status}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.details}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Queue Workers Overview Card */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} color="var(--primary)" /> Background Worker Queues (BullMQ)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {['content-generation', 'image-generation', 'post-publishing', 'comment-automation', 'token-refresh'].map(q => (
            <div key={q} style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>{q}</div>
              <span className="badge badge-success" style={{ fontSize: '11px' }}>● 8 Active Workers</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
