import React, { useState } from 'react';
import { Sliders, Shield, Key, Bell, CheckCircle2, Globe, Save } from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    autoPublish: true,
    emailAlerts: true,
    webhookToken: 'meta_automation_secret',
    defaultAIProvider: 'OpenAI GPT-4o (Text) + DALL-E 3 (Image)',
    timezone: 'Asia/Kolkata (GMT+5:30)',
    retryAttempts: 3
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Sliders size={24} color="var(--primary)" />
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Platform Settings</h1>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Configure Meta API Webhooks, AI model fallback priorities, timezones, and system notifications.
        </p>
      </div>

      {saved && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'var(--success-bg)',
          color: 'var(--success)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px'
        }}>
          <CheckCircle2 size={16} /> Platform settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Webhook & Meta Settings */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="var(--primary)" /> Meta Webhook & Security Settings
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Meta Webhook Verification Token</label>
            <input
              type="text"
              value={settings.webhookToken}
              onChange={(e) => setSettings({ ...settings, webhookToken: e.target.value })}
              className="form-input"
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Must match the Verify Token configured in Meta Developer Portal $\rightarrow$ Webhooks.
            </span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Default Publishing Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="form-select"
              style={{ width: '100%' }}
            >
              <option value="Asia/Kolkata (GMT+5:30)" style={{ background: '#121826' }}>Asia/Kolkata (GMT+5:30)</option>
              <option value="UTC (GMT+0:00)" style={{ background: '#121826' }}>UTC (GMT+0:00)</option>
              <option value="America/New_York (EST)" style={{ background: '#121826' }}>America/New_York (EST)</option>
              <option value="Europe/London (GMT)" style={{ background: '#121826' }}>Europe/London (GMT)</option>
            </select>
          </div>
        </div>

        {/* AI & Automation Settings */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent-pink)" /> AI & Publishing Worker Rules
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Primary AI Provider Stack</label>
            <select
              value={settings.defaultAIProvider}
              onChange={(e) => setSettings({ ...settings, defaultAIProvider: e.target.value })}
              className="form-select"
              style={{ width: '100%' }}
            >
              <option value="OpenAI GPT-4o (Text) + DALL-E 3 (Image)" style={{ background: '#121826' }}>OpenAI GPT-4o (Text) + DALL-E 3 (Image)</option>
              <option value="Claude 3.5 Sonnet + Stability AI" style={{ background: '#121826' }}>Claude 3.5 Sonnet + Stability AI</option>
              <option value="Gemini Flash 1.5 + Flux 1.1" style={{ background: '#121826' }}>Gemini Flash 1.5 + Flux 1.1</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Automatic Retry Attempts on Temporary Meta Error</label>
            <input
              type="number"
              min="1"
              max="5"
              value={settings.retryAttempts}
              onChange={(e) => setSettings({ ...settings, retryAttempts: Number(e.target.value) })}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Auto-Publish Queue Worker</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Automatically trigger queue publishing when scheduled time is reached.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoPublish}
              onChange={(e) => setSettings({ ...settings, autoPublish: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 700, alignSelf: 'flex-start' }}>
          <Save size={16} /> Save Settings
        </button>
      </form>
    </div>
  );
}
