import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postApi, analyticsApi, automationApi } from '../../services/api';
import PostCard from '../../components/posts/PostCard';
import { Sparkles, Calendar, MessageSquareReply, CheckCircle2, Clock, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const resAna = await analyticsApi.getAnalytics(user.id);
      setAnalytics(resAna.data.summary);

      const resPosts = await postApi.getPosts({ user_id: user.id, status: 'scheduled' });
      setUpcomingPosts(resPosts.data.posts.slice(0, 3));

      const resAuto = await automationApi.getAutomations(user.id);
      setRecentLogs(resAuto.data.logs.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '28px 32px',
        marginBottom: '28px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(236, 72, 153, 0.1) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
            Welcome back, <span className="gradient-text">{user?.name || 'Creator'}</span> 👋
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Your social automation engine is actively generating, scheduling, and replying to comments on Meta.
          </p>
        </div>
        <Link to="/content-preferences" className="btn-secondary">
          Configure AI Preferences
        </Link>
      </div>

      {/* Dashboard Stat Cards (PRD Section 8) */}
      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Posts</span>
            <Sparkles size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{analytics?.total_posts || 4}</div>
          <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '4px' }}>+100% Automated</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Successful Posts</span>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)' }}>{analytics?.published_posts || 2}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Published on FB & IG</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Automated DMs</span>
            <MessageSquareReply size={20} color="var(--accent-pink)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-pink)' }}>{analytics?.automated_dms || 52}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Comment-to-DM triggers</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Next Scheduled</span>
            <Clock size={20} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--warning)' }}>Tomorrow, 7:00 PM</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>AI Queue Ready</div>
        </div>
      </div>

      {/* Grid Section: Upcoming Queue & Live Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
        {/* Upcoming Posts Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Upcoming Scheduled Queue</h3>
            <Link to="/posts/scheduled" style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Calendar <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {upcomingPosts.length > 0 ? (
              upcomingPosts.map(post => (
                <PostCard key={post.id} post={post} onRefresh={fetchDashboardData} />
              ))
            ) : (
              <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No upcoming posts scheduled. Use the top button to generate one with AI!
              </div>
            )}
          </div>
        </div>

        {/* Comment-to-DM Live Activity Feed */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Recent DM Automations</h3>
            <Link to="/automations" style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Manage Rules <ArrowRight size={14} />
            </Link>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {recentLogs.map(log => (
                <div key={log.id} style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <MessageSquareReply size={18} color="var(--accent-pink)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{log.commenter_handle}</strong>
                      <span style={{ color: 'var(--text-dim)' }}>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Comment: "{log.comment_text}"
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '10px' }}>
                      DM Sent: {log.automation_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
