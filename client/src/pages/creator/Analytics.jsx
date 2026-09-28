import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsApi } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp, Sparkles, MessageSquareReply, Send } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await analyticsApi.getAnalytics(user.id);
      setData(res.data);
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  };

  if (!data) return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading analytics report...</div>;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Performance Analytics</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Track your automated posting output, platform delivery, and Comment-to-DM engagement growth.
        </p>
      </div>

      {/* Metrics Cards (PRD Section 19) */}
      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>TOTAL POSTS</div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{data.summary.total_posts}</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>SUCCESSFUL POSTS</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)' }}>{data.summary.published_posts}</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>AUTOMATED DMS</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-pink)' }}>{data.summary.automated_dms}</div>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>POST SUCCESS RATE</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>100%</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '28px' }}>
        {/* Posts per week chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="var(--primary)" /> Posts Published Per Week
          </h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.posts_per_week}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: '#121826', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                <Bar dataKey="facebook" fill="#60a5fa" name="Facebook" radius={[4, 4, 0, 0]} />
                <Bar dataKey="instagram" fill="#f472b6" name="Instagram" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DMs per day line chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--accent-pink)" /> DMs Triggered Per Day
          </h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.charts.dms_per_day}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: '#121826', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="count" stroke="var(--accent-pink)" strokeWidth={3} dot={{ r: 4 }} name="DMs Sent" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
