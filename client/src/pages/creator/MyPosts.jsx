import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postApi } from '../../services/api';
import PostCard from '../../components/posts/PostCard';
import { Search, Filter, Sparkles } from 'lucide-react';

export default function MyPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [activeTab, platformFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await postApi.getPosts({
        user_id: user.id,
        status: activeTab,
        platform: platformFilter,
        search: searchQuery
      });
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Generated Posts Feed</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Manage all AI generated posts, view Meta publishing statuses, or manually publish scheduled posts.
          </p>
        </div>
      </div>

      {/* Tabs & Filter Bar (PRD Section 14) */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '28px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: 'All Posts' },
            { id: 'published', label: 'Published' },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'failed', label: 'Failed' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Platform & Search */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            className="form-select"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            style={{ padding: '8px 14px', fontSize: '13px' }}
          >
            <option value="all">All Platforms</option>
            <option value="facebook">Facebook Page</option>
            <option value="instagram">Instagram</option>
          </select>

          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search caption..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 14px 8px 36px', fontSize: '13px', width: '220px' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          </form>
        </div>
      </div>

      {/* Posts Cards Grid */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading post library...</div>
      ) : posts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} onRefresh={fetchPosts} />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
          <Sparkles size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No posts found</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            No posts match the selected tab or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
