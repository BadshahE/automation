import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { metaApi } from '../../services/api';
import { Facebook, Instagram, CheckCircle2, ShieldCheck, RefreshCw, Unlink, ExternalLink } from 'lucide-react';

export default function ConnectAccounts() {
  const { user } = useAuth();
  const [connections, setConnections] = useState({ facebook: null, instagram: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await metaApi.getConnections(user.id);
      setConnections(res.data);
    } catch (err) {
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform) => {
    try {
      // Simulate Meta OAuth Callback flow (PRD Section 10)
      await metaApi.simulateCallback();
      fetchConnections();
      alert(`Meta ${platform} account connected successfully!`);
    } catch (err) {
      alert('OAuth failed: ' + err.message);
    }
  };

  const handleDisconnect = async (platform) => {
    if (!confirm(`Are you sure you want to disconnect ${platform}?`)) return;
    try {
      await metaApi.disconnect(platform);
      fetchConnections();
    } catch (err) {
      alert('Disconnect failed');
    }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>Social Media Accounts</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Connect your official Facebook Page and Instagram Professional Account to enable automated publishing and Comment-to-DM triggers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {/* Facebook Page Connection Card (PRD Section 9) */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justify: 'center' }}>
                  <Facebook size={24} color="#60a5fa" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Facebook Page</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Meta Graph API v19.0</span>
                </div>
              </div>
              {connections.facebook ? (
                <span className="badge badge-success"><CheckCircle2 size={12} /> Connected</span>
              ) : (
                <span className="badge badge-warning">Not Connected</span>
              )}
            </div>

            {connections.facebook ? (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                  <strong>Connected Page:</strong> <span style={{ color: 'var(--primary)' }}>{connections.facebook.page_name || 'Apex Fitness Studio'}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Page ID: {connections.facebook.page_id}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Token Status: <strong style={{ color: 'var(--success)' }}>Active (Auto-refresh)</strong>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                Grant permission to automatically publish scheduled posts to your Facebook Page feed and manage comments.
              </p>
            )}
          </div>

          <div>
            {connections.facebook ? (
              <button onClick={() => handleDisconnect('facebook')} className="btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
                <Unlink size={16} /> Disconnect Facebook Page
              </button>
            ) : (
              <button onClick={() => handleConnect('facebook')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Facebook size={18} /> Connect Facebook Page
              </button>
            )}
          </div>
        </div>

        {/* Instagram Account Connection Card (PRD Section 9) */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justify: 'center' }}>
                  <Instagram size={24} color="#f472b6" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Instagram Business</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Professional Account</span>
                </div>
              </div>
              {connections.instagram ? (
                <span className="badge badge-success"><CheckCircle2 size={12} /> Connected</span>
              ) : (
                <span className="badge badge-warning">Not Connected</span>
              )}
            </div>

            {connections.instagram ? (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                  <strong>Account Handle:</strong> <span style={{ color: 'var(--accent-pink)' }}>{connections.instagram.instagram_handle || '@apexfitness_official'}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  IG User ID: {connections.instagram.instagram_user_id}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Comment-to-DM Webhook: <strong style={{ color: 'var(--success)' }}>Active</strong>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                Connect your Instagram Business or Creator account to enable Container publishing, Stories, and automated Private Reply DMs.
              </p>
            )}
          </div>

          <div>
            {connections.instagram ? (
              <button onClick={() => handleDisconnect('instagram')} className="btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
                <Unlink size={16} /> Disconnect Instagram
              </button>
            ) : (
              <button onClick={() => handleConnect('instagram')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' }}>
                <Instagram size={18} /> Connect Instagram Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
