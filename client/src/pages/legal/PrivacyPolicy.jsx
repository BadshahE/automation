import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
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
            <ShieldCheck size={32} color="var(--primary)" />
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Privacy Policy</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Last updated: September 28, 2026</p>
        </div>

        <div className="glass-panel" style={{ padding: '32px', lineHeight: 1.7, fontSize: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>1. Information We Collect</h2>
          <p style={{ marginBottom: '20px' }}>
            When you use our AI Social Media Automation Platform, we collect information authorized by you via Facebook Login and Meta Graph API, including your Facebook Page ID, Page Access Tokens, Instagram Business Account ID, and post metrics.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>2. How We Use Information</h2>
          <p style={{ marginBottom: '20px' }}>
            We use collected data solely to:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>Generate scheduled social media captions and media using AI models.</li>
            <li>Publish content to your connected Facebook Pages and Instagram accounts.</li>
            <li>Execute Comment-to-DM automated replies per your configured rules.</li>
            <li>Provide performance analytics and publishing status logs.</li>
          </ul>

          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>3. Data Storage and Security</h2>
          <p style={{ marginBottom: '20px' }}>
            All Meta access tokens are encrypted before storage in our secure PostgreSQL database. We do not sell, rent, or trade your personal data or social media content to third parties.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>4. Data Deletion & Rights</h2>
          <p style={{ marginBottom: '20px' }}>
            You may disconnect your social accounts or request complete data deletion at any time via your account settings or our <Link to="/data-deletion" style={{ color: 'var(--primary)' }}>Data Deletion Page</Link>.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>5. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, contact us at <code>privacy@automationsocial.com</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
