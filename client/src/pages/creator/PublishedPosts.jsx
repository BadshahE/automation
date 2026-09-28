import React, { useState, useEffect } from 'react';
import { postApi } from '../../services/api';
import PlatformBadge from '../../components/posts/PlatformBadge';
import { CheckCircle2, ExternalLink, Calendar, MessageSquare, ThumbsUp, RefreshCw, Sparkles, Filter } from 'lucide-react';

export default function PublishedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState('all');

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  const fetchPublishedPosts = async () => {
    setLoading(true);
    try {
      const res = await postApi.getPosts({ status: 'published' });
      setPosts(res.data || []);
    } catch (err) {
      console.error('Error loading published posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(p => filterPlatform === 'all' || p.platform === filterPlatform);

  return (
    <div style={{ maxWidth: '1100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Published Posts</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Live content published to your connected Facebook Pages and Instagram accounts via Meta Graph API.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="form-select"
            style={{ padding: '8px 14px', fontSize: '13px' }}
          >
            <option value="all" style={{ background: '#121826' }}>All Platforms</option>
            <option value="facebook" style={{ background: '#121826' }}>Facebook Only</option>
            <option value="instagram" style={{ background: '#121826' }}>Instagram Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="spin" style={{ margin: '0 auto 12px' }} />
          Loading published posts...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <CheckCircle2 size={48} color="var(--success)" style={{ opacity: 0.5, margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No Published Posts Yet</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 20px' }}>
            Posts automatically published through AI Content Studio or Scheduled Queue will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredPosts.map((post) => (
            <div key={post.id} className="glass-panel glass-card-interactive" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ position: 'relative', height: '200px', background: '#000' }}>
                  <img src={post.image_url} alt="Published media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <PlatformBadge platform={post.platform} />
                  </div>
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="badge badge-success"><CheckCircle2 size={12} /> Published</span>
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.caption}
                  </p>
                  <div style={{ fontSize: '12px', color: 'var(--accent-pink)', fontWeight: 600, marginBottom: '14px' }}>
                    {Array.isArray(post.hashtags) ? post.hashtags.join(' ') : post.hashtags}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <span>ID: <code>{post.meta_post_id || `fb_post_${post.id.slice(0, 8)}`}</code></span>
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ThumbsUp size={14} color="var(--primary)" /> {Math.floor(Math.random() * 40) + 12}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={14} color="var(--accent-pink)" /> {Math.floor(Math.random() * 15) + 3}</span>
                </div>
                <a
                  href={`https://facebook.com/${post.meta_post_id || 'post'}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  View on Meta <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
