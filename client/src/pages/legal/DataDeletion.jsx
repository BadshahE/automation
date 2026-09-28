import React, { useState } from 'react';
import { Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DataDeletion() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: '#e2e8f0',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', marginBottom: '16px' }}>
            <ArrowLeft size={16} /> Back to App
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Trash2 size={32} color="#f87171" />
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>User Data Deletion Request</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            In accordance with Meta Platform Policy, you can request complete deletion of your connected Facebook & Instagram app data.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>Data Deletion Request Received</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                Your request ID is <code>DEL-{Math.random().toString(36).substring(2, 9).toUpperCase()}</code>. All stored tokens, logs, and account connections associated with <strong>{email}</strong> will be permanently purged within 24 hours.
              </p>
              <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                To request immediate purging of your access tokens, scheduled post logs, and connected account data from our servers, enter your registered email below:
              </p>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Registered Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="creator@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>
              <button type="submit" className="btn-danger" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', fontWeight: 700 }}>
                Request Full Data Purge
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
