import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
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
            <FileText size={32} color="var(--primary)" />
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Terms of Service</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Last updated: September 28, 2026</p>
        </div>

        <div className="glass-panel" style={{ padding: '32px', lineHeight: 1.7, fontSize: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: '20px' }}>
            By using our AI Social Automation Platform, you agree to comply with Meta Graph API Terms of Service, Instagram Community Guidelines, and applicable laws.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>2. Account Automation</h2>
          <p style={{ marginBottom: '20px' }}>
            You are responsible for all AI-generated content published through your connected Facebook and Instagram accounts. You agree not to schedule harmful, spammy, or copyright-infringing material.
          </p>

          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>3. Termination</h2>
          <p style={{ marginBottom: '20px' }}>
            We reserve the right to suspend or terminate accounts that violate Meta platform policies or abuse API quotas.
          </p>
        </div>
      </div>
    </div>
  );
}
