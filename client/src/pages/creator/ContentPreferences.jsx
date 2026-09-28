import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { preferenceApi } from '../../services/api';
import { Sliders, Save, Plus, X, Sparkles, Check } from 'lucide-react';

export default function ContentPreferences() {
  const { user } = useAuth();
  const [niche, setNiche] = useState('Fitness & Health');
  const [tone, setTone] = useState('Inspirational');
  const [postingFrequency, setPostingFrequency] = useState('Twice Daily');
  const [topics, setTopics] = useState(['Strength Training', 'High Protein Diet', 'Morning Routine']);
  const [newTopic, setNewTopic] = useState('');
  const [language, setLanguage] = useState('English');
  const [hashtagPref, setHashtagPref] = useState('Automatic');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await preferenceApi.getPreferences(user.id);
      const pref = res.data.preferences;
      if (pref) {
        setNiche(pref.niche || 'Fitness & Health');
        setTone(pref.tone || 'Inspirational');
        setPostingFrequency(pref.posting_frequency || 'Twice Daily');
        setTopics(pref.topics || []);
        setLanguage(pref.language || 'English');
        setHashtagPref(pref.hashtag_preference || 'Automatic');
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topicToRemove) => {
    setTopics(topics.filter(t => t !== topicToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await preferenceApi.savePreferences({
        user_id: user.id,
        niche,
        tone,
        posting_frequency: postingFrequency,
        topics,
        language,
        hashtag_preference: hashtagPref
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>AI Content Preferences</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Configure your brand voice, niche focus, and posting cadence. The AI engine uses these preferences to generate targeted captions and visual image prompts.
        </p>
      </div>

      <form onSubmit={handleSave} className="glass-panel" style={{ padding: '32px' }}>
        {/* Niche Selection (PRD Section 11) */}
        <div className="form-group">
          <label className="form-label">Brand Niche / Industry</label>
          <select className="form-select" value={niche} onChange={(e) => setNiche(e.target.value)}>
            <option value="Fitness & Health">Fitness & Wellness</option>
            <option value="Technology & AI">Technology & AI</option>
            <option value="E-commerce & Retail">E-commerce & Retail</option>
            <option value="Business & Finance">Business & Entrepreneurship</option>
            <option value="Lifestyle & Travel">Lifestyle & Travel</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Digital Marketing">Digital Marketing</option>
          </select>
        </div>

        {/* Posting Frequency */}
        <div className="form-group">
          <label className="form-label">Automated Posting Frequency</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '6px' }}>
            {['Once Daily', 'Twice Daily', 'Three Times Weekly', 'Weekly'].map(freq => (
              <label
                key={freq}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: postingFrequency === freq ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${postingFrequency === freq ? 'var(--primary)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <input
                  type="radio"
                  name="frequency"
                  checked={postingFrequency === freq}
                  onChange={() => setPostingFrequency(freq)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                {freq}
              </label>
            ))}
          </div>
        </div>

        {/* Tone Selection */}
        <div className="form-group">
          <label className="form-label">Brand Voice Tone</label>
          <select className="form-select" value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="Inspirational">Inspirational & Empowering</option>
            <option value="Professional">Professional & Authoritative</option>
            <option value="Friendly">Friendly & Casual</option>
            <option value="Funny">Witty & Humorous</option>
            <option value="Educational">Educational & Informative</option>
          </select>
        </div>

        {/* Content Topics Tag List */}
        <div className="form-group">
          <label className="form-label">Core Content Topics / Keywords</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Mobility Drills, High Protein, Daily Routine"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              style={{ flex: 1 }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTopic(); } }}
            />
            <button type="button" onClick={handleAddTopic} className="btn-secondary">
              <Plus size={16} /> Add Topic
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {topics.map(t => (
              <span key={t} className="badge badge-info" style={{ padding: '6px 12px', fontSize: '13px', gap: '6px' }}>
                {t}
                <X size={14} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTopic(t)} />
              </span>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="form-group">
          <label className="form-label">Language</label>
          <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="English">English (US/UK)</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>

        {/* Hashtags Preference */}
        <div className="form-group">
          <label className="form-label">Hashtag Generation Strategy</label>
          <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input type="radio" name="hashtag" value="Automatic" checked={hashtagPref === 'Automatic'} onChange={() => setHashtagPref('Automatic')} style={{ accentColor: 'var(--primary)' }} />
              Automatic (AI generates niche hashtags)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input type="radio" name="hashtag" value="Manual" checked={hashtagPref === 'Manual'} onChange={() => setHashtagPref('Manual')} style={{ accentColor: 'var(--primary)' }} />
              Manual (Custom override)
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <button type="submit" disabled={isSaving} className="btn-primary" style={{ padding: '12px 28px' }}>
            <Save size={18} /> {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
          {savedSuccess && (
            <span style={{ fontSize: '13px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} /> Preferences updated successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
