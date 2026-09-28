import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Sparkles, User, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Topbar({ onTriggerAIGenerate }) {
  const { user, role } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Post Published Successfully', text: 'Instagram post #post-002 was published to @apexfitness_official', time: '5m ago', icon: CheckCircle2, color: 'var(--success)' },
    { id: 2, title: 'Comment DM Automation Triggered', text: 'Sent recipe link DM to @fit_life_john', time: '18m ago', icon: Sparkles, color: 'var(--primary)' },
    { id: 3, title: 'AI Provider Failover Notice', text: 'Switched from OpenAI to Gemini 1.5 Pro seamlessly', time: '1h ago', icon: AlertTriangle, color: 'var(--warning)' }
  ];

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(10, 13, 20, 0.7)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Title / Action Quick Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Environment: <strong style={{ color: 'var(--success)' }}>Production (Live Queue)</strong>
        </span>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {role === 'creator' && (
          <button onClick={onTriggerAIGenerate} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            <Sparkles size={16} /> Generate Post with AI
          </button>
        )}

        {/* Notifications Bell (PRD Section 36) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-pink)',
              boxShadow: '0 0 8px var(--accent-pink)'
            }} />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="glass-panel" style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '340px',
              padding: '16px',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <strong style={{ fontSize: '14px' }}>🔔 Notifications</strong>
                <span style={{ fontSize: '11px', color: 'var(--primary)', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} style={{ display: 'flex', gap: '12px', fontSize: '13px', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                      <Icon size={18} color={n.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{n.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{n.text}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '12px', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.1 }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
