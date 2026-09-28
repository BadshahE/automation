import React, { useState } from 'react';
import PlatformBadge from './PlatformBadge';
import { Send, Trash2, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { postApi } from '../../services/api';

export default function PostCard({ post, onRefresh }) {
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishNow = async () => {
    setIsPublishing(true);
    try {
      await postApi.publishPost(post.id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Publishing failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await postApi.deletePost(post.id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const getStatusBadge = () => {
    if (post.status === 'published') return <span className="badge badge-success"><CheckCircle2 size={12} /> Published</span>;
    if (post.status === 'scheduled') return <span className="badge badge-warning"><Clock size={12} /> Scheduled</span>;
    return <span className="badge badge-error"><AlertCircle size={12} /> Failed</span>;
  };

  return (
    <div className="glass-panel glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Social Card Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PlatformBadge platform={post.platform} />
        {getStatusBadge()}
      </div>

      {/* Image Preview */}
      {post.image_url ? (
        <div style={{ position: 'relative', width: '100%', height: '220px', background: '#000' }}>
          <img src={post.image_url} alt="Post Visual" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{ height: '100px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
          Text Only Post
        </div>
      )}

      {/* Caption Preview */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-main)', whiteSpace: 'pre-line', marginBottom: '14px' }}>
          {post.caption.length > 180 ? post.caption.substring(0, 180) + '...' : post.caption}
        </p>

        {/* Schedule / Published date */}
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={12} />
          {post.status === 'published' ? (
            `Published: ${new Date(post.published_at || post.created_at).toLocaleString()}`
          ) : (
            `Scheduled: ${new Date(post.scheduled_at).toLocaleString()}`
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          {post.status !== 'published' && (
            <button
              onClick={handlePublishNow}
              disabled={isPublishing}
              className="btn-primary"
              style={{ flex: 1, padding: '6px 12px', fontSize: '12px', justifyContent: 'center' }}
            >
              <Send size={14} /> {isPublishing ? 'Publishing...' : 'Publish Now'}
            </button>
          )}

          <button
            onClick={handleDelete}
            className="btn-danger"
            style={{ padding: '6px 10px', fontSize: '12px' }}
            title="Delete post"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
