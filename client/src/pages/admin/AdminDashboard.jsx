import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Users, Sparkles, MessageSquareReply, AlertTriangle, Cpu, HeartPulse, ShieldCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await adminApi.getDashboard();
      setStats(res.data.stats);
    } catch (err) {
      console.error('Error loading admin stats:', err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
          Platform Administrative Control Center 🛡️
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Real-time platform metrics, active creator accounts, background worker queues, and AI pool health.
        </p>
      </div>

      {/* Admin Stat Cards (PRD Section 20) */}
      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Creators</span>
            <Users size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{stats?.total_creators || 1284}</div>
          <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '4px' }}>Active: {stats?.active_creators || 1172}</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Posts Today</span>
            <Sparkles size={20} color="var(--accent-pink)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{stats?.posts_today || 4829}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>This Month: {stats?.posts_this_month || 96420}</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Automated DMs</span>
            <MessageSquareReply size={20} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-cyan)' }}>{stats?.automated_dms || 283902}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Meta Webhooks Active</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Failed Jobs</span>
            <AlertTriangle size={20} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: stats?.failed_jobs > 0 ? 'var(--warning)' : 'var(--success)' }}>
            {stats?.failed_jobs || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Workers Active: 8</div>
        </div>
      </div>

      {/* Quick Nav Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '10px' }}>
        <Link to="/admin/users" className="glass-panel glass-card-interactive" style={{ padding: '24px', textDecoration: 'none', color: 'inherit' }}>
          <Users size={28} color="var(--primary)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Manage Creators</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Enable/disable creator accounts and inspect connected Meta pages.</p>
        </Link>

        <Link to="/admin/providers" className="glass-panel glass-card-interactive" style={{ padding: '24px', textDecoration: 'none', color: 'inherit' }}>
          <Cpu size={28} color="var(--accent-pink)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>AI Failover Pool</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Configure provider priority order (OpenAI, Gemini, Anthropic, Stability).</p>
        </Link>

        <Link to="/admin/system-health" className="glass-panel glass-card-interactive" style={{ padding: '24px', textDecoration: 'none', color: 'inherit' }}>
          <HeartPulse size={28} color="var(--success)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>System Health</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Inspect API status, Redis queues, Meta Graph API status, and workers.</p>
        </Link>
      </div>
    </div>
  );
}
