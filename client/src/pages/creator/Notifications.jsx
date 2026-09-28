import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Trash2, CheckCheck } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Post Published Successfully',
      message: 'Your scheduled fitness post was published to Facebook Page "Apex Fitness Studio".',
      type: 'success',
      time: '10 minutes ago',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Comment-to-DM Triggered',
      message: 'Automated DM sent to @alex_fit for keyword "PRICE" on post #4892.',
      type: 'info',
      time: '1 hour ago',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Meta Access Token Refresh',
      message: 'Long-lived Facebook Page access token auto-refreshed successfully.',
      type: 'success',
      time: '3 hours ago',
      read: true
    },
    {
      id: 'notif-4',
      title: 'Scheduled Post Queue Warning',
      message: 'Post #3910 image ratio optimization suggested for Instagram Reels container.',
      type: 'warning',
      time: 'Yesterday',
      read: true
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Bell size={24} color="var(--primary)" />
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Notification Center</h1>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Real-time updates on automated publishing, Comment-to-DM triggers, and Meta API tokens.
          </p>
        </div>

        {notifications.length > 0 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={markAllRead} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
              <CheckCheck size={14} /> Mark all read
            </button>
            <button onClick={clearAll} className="btn-danger" style={{ fontSize: '12px', padding: '6px 12px' }}>
              <Trash2 size={14} /> Clear all
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Bell size={48} color="var(--text-muted)" style={{ opacity: 0.4, margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No New Notifications</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>You're all caught up! Platform alerts will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="glass-panel"
              style={{
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                background: notif.read ? 'rgba(18, 24, 38, 0.4)' : 'rgba(99, 102, 241, 0.08)',
                borderLeft: `4px solid ${notif.type === 'success' ? 'var(--success)' : notif.type === 'warning' ? 'var(--warning)' : 'var(--info)'}`
              }}
            >
              <div style={{ marginTop: '2px' }}>
                {notif.type === 'success' && <CheckCircle2 size={20} color="var(--success)" />}
                {notif.type === 'warning' && <AlertTriangle size={20} color="var(--warning)" />}
                {notif.type === 'info' && <Info size={20} color="var(--info)" />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: notif.read ? 'var(--text-main)' : '#fff' }}>
                    {notif.title}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{notif.time}</span>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
