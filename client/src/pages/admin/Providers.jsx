import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Cpu, ShieldCheck, ArrowUp, ArrowDown, Power, Key, AlertTriangle } from 'lucide-react';

export default function Providers() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await adminApi.getProviders();
      setProviders(res.data.providers);
    } catch (err) {
      console.error('Error loading AI providers:', err);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await adminApi.updateProvider(id, data);
      fetchProviders();
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>AI Provider Failover Pool</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Configure priority hierarchy and daily quotas for text and image AI providers. Up to 3 fallback attempts are automatically performed if a primary provider fails.
        </p>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Provider Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Daily Usage / Quota</th>
              <th>Encrypted Key</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => {
              const usagePct = Math.round((p.daily_usage / p.quota_limit) * 100);

              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge badge-info" style={{ fontWeight: 800 }}>P{p.priority}</span>
                      <button onClick={() => handleUpdate(p.id, { priority: Math.max(1, p.priority - 1) })} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Increase priority">
                        <ArrowUp size={14} />
                      </button>
                      <button onClick={() => handleUpdate(p.id, { priority: p.priority + 1 })} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Decrease priority">
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td><strong>{p.provider_name}</strong></td>
                  <td>
                    <span className={`badge ${p.type === 'text' ? 'badge-info' : 'badge-warning'}`}>
                      {p.type.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                      {p.daily_usage} / {p.quota_limit} ({usagePct}%)
                    </div>
                    <div style={{ height: '6px', width: '140px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(100, usagePct)}%`, background: usagePct > 80 ? 'var(--warning)' : 'var(--success)' }} />
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-dim)', fontSize: '12px' }}>
                    {p.encrypted_api_key}
                  </td>
                  <td>
                    <button
                      onClick={() => handleUpdate(p.id, { status: p.status === 'active' ? 'degraded' : 'active' })}
                      className={p.status === 'active' ? 'btn-secondary' : 'btn-primary'}
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      <Power size={12} /> {p.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
