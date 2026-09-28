import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postApi } from '../../services/api';
import PlatformBadge from '../../components/posts/PlatformBadge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Eye, Send, X } from 'lucide-react';

export default function ScheduledPosts() {
  const { user } = useAuth();
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchScheduled();
  }, []);

  const fetchScheduled = async () => {
    try {
      const res = await postApi.getScheduled(user.id);
      setScheduledPosts(res.data.posts);
    } catch (err) {
      console.error('Error loading scheduled calendar:', err);
    }
  };

  // Generate 30 days grid for September 2026
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const getPostsForDay = (dayNum) => {
    return scheduledPosts.filter(p => {
      const d = new Date(p.scheduled_at);
      return d.getDate() === dayNum;
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Scheduled Posts Calendar</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Visual calendar representation of your upcoming automated Facebook & Instagram posts.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ChevronLeft size={18} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
          <strong style={{ fontSize: '14px' }}>September 2026</strong>
          <ChevronRight size={18} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Calendar Grid Header */}
      <div className="glass-panel" style={{ padding: '16px', overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '10px', textAlign: 'center' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
          {/* Offset first day */}
          <div style={{ height: '110px', background: 'rgba(255,255,255,0.01)', borderRadius: '10px', opacity: 0.3 }} />
          
          {days.map(day => {
            const postsOnDay = getPostsForDay(day);
            const isToday = day === 20; // Current local time date

            return (
              <div
                key={day}
                style={{
                  minHeight: '110px',
                  background: isToday ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.02)',
                  border: isToday ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: isToday ? 'var(--primary)' : 'var(--text-muted)' }}>
                  <span>{day}</span>
                  {isToday && <span style={{ fontSize: '10px', background: 'var(--primary)', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>Today</span>}
                </div>

                {postsOnDay.map(post => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    style={{
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={post.caption}
                  >
                    <Clock size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {new Date(post.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Post Modal Detail */}
      {selectedPost && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="glass-panel" style={{ width: '440px', padding: '24px', position: 'relative' }}>
            <button onClick={() => setSelectedPost(null)} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>

            <div style={{ marginBottom: '16px' }}>
              <PlatformBadge platform={selectedPost.platform} />
            </div>

            {selectedPost.image_url && (
              <img src={selectedPost.image_url} alt="Scheduled asset" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', marginBottom: '14px' }} />
            )}

            <p style={{ fontSize: '13px', lineHeight: 1.5, marginBottom: '14px', whiteSpace: 'pre-line' }}>
              {selectedPost.caption}
            </p>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Scheduled for: <strong style={{ color: '#fff' }}>{new Date(selectedPost.scheduled_at).toLocaleString()}</strong>
            </div>

            <button onClick={() => setSelectedPost(null)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
