import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { automationApi, postApi } from '../../services/api';
import { MessageSquareReply, Plus, Edit2, Trash2, Power, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';

export default function Automations() {
  const { user } = useAuth();
  const [automations, setAutomations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [selectedPostId, setSelectedPostId] = useState('');
  const [keywords, setKeywords] = useState('');
  const [dmMessage, setDmMessage] = useState('');
  const [dmLink, setDmLink] = useState('');

  useEffect(() => {
    fetchAutomations();
    fetchPosts();
  }, []);

  const fetchAutomations = async () => {
    try {
      const res = await automationApi.getAutomations(user.id);
      setAutomations(res.data.automations);
      setLogs(res.data.logs);
    } catch (err) {
      console.error('Error fetching automations:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await postApi.getPosts({ user_id: user.id });
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await automationApi.createAutomation({
        user_id: user.id,
        post_id: selectedPostId || null,
        name,
        keywords: keywords.split(',').map(k => k.trim()),
        dm_message: dmMessage,
        dm_link: dmLink
      });
      setShowModal(false);
      setName('');
      setKeywords('');
      setDmMessage('');
      setDmLink('');
      fetchAutomations();
    } catch (err) {
      alert('Failed to create automation rule');
    }
  };

  const handleToggle = async (id, currentActive) => {
    try {
      await automationApi.updateAutomation(id, { active: !currentActive });
      fetchAutomations();
    } catch (err) {
      alert('Toggle failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    try {
      await automationApi.deleteAutomation(id);
      fetchAutomations();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Comment-to-DM Automations</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Automatically reply with a private Instagram DM and links whenever users comment qualifying keywords on your posts.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Create New Automation Rule
        </button>
      </div>

      {/* Meta API Informational Alert (PRD Section 17) */}
      <div className="glass-panel" style={{
        padding: '14px 18px',
        marginBottom: '28px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Info size={20} color="#60a5fa" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '13px', color: '#93c5fd' }}>
          <strong>Meta API Policy Note:</strong> Each qualifying comment can trigger only one automated private reply DM under applicable Meta platform policies. Idempotency guarantees prevent duplicate DMs.
        </span>
      </div>

      {/* Active Rules Grid (PRD Section 17) */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Active Automation Rules</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {automations.map(auto => (
          <div key={auto.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{auto.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{auto.post_title}</span>
                </div>
                <button
                  onClick={() => handleToggle(auto.id, auto.active)}
                  className={`badge ${auto.active ? 'badge-success' : 'badge-warning'}`}
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  <Power size={12} /> {auto.active ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Keywords list */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Keywords:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {auto.keywords.map(kw => (
                    <span key={kw} className="badge badge-info" style={{ fontSize: '11px' }}>{kw}</span>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: 'flex', gap: '20px', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Triggered</div>
                  <strong style={{ fontSize: '16px' }}>{auto.triggered_count || 0}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DMs Sent</div>
                  <strong style={{ fontSize: '16px', color: 'var(--success)' }}>{auto.dms_sent_count || 0}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => handleDelete(auto.id)} className="btn-danger" style={{ padding: '4px 10px', fontSize: '12px' }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Table (PRD Section 18) */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Automation Activity Log</h3>
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Commenter</th>
              <th>Comment Text</th>
              <th>Rule Matched</th>
              <th>DM Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td><strong>{log.commenter_handle}</strong></td>
                <td style={{ color: 'var(--text-muted)' }}>"{log.comment_text}"</td>
                <td><span className="badge badge-info">{log.automation_name}</span></td>
                <td><span className="badge badge-success"><CheckCircle2 size={12} /> Sent</span></td>
                <td style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Automation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <form onSubmit={handleCreate} className="glass-panel" style={{ width: '480px', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Create Comment-to-DM Rule</h3>

            <div className="form-group">
              <label className="form-label">Rule Name</label>
              <input type="text" className="form-input" required placeholder="e.g. Recipe Guide Lead Gen" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Target Post (Optional)</label>
              <select className="form-select" value={selectedPostId} onChange={(e) => setSelectedPostId(e.target.value)}>
                <option value="">Apply to All Instagram Posts</option>
                {posts.map(p => (
                  <option key={p.id} value={p.id}>{p.caption.substring(0, 40)}...</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Trigger Keywords (Comma separated)</label>
              <input type="text" className="form-input" required placeholder="price, link, buy, recipe, vip" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">DM Reply Message</label>
              <textarea className="form-textarea" rows={3} required placeholder="Thanks for commenting! Here is your link:" value={dmMessage} onChange={(e) => setDmMessage(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">DM Link (Optional)</label>
              <input type="url" className="form-input" placeholder="https://example.com/offer" value={dmLink} onChange={(e) => setDmLink(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Create Rule</button>
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
