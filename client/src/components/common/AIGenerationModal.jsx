import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Loader2, X, Image, FileText, Share2 } from 'lucide-react';
import { postApi } from '../../services/api';

export default function AIGenerationModal({ isOpen, onClose, onPostGenerated }) {
  const [platform, setPlatform] = useState('both');
  const [promptOverride, setPromptOverride] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(0);
  const [resultPost, setResultPost] = useState(null);

  const steps = [
    'Understanding content preferences',
    'Generating caption using AI text pool',
    'Generating optimal hashtags',
    'Creating visual image asset',
    'Uploading image to Supabase / Storage',
    'Scheduling post on Facebook & Instagram'
  ];

  if (!isOpen) return null;

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setStep(0);

    // Simulate animated stepper progression
    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 1200);
    const timer3 = setTimeout(() => setStep(3), 1800);
    const timer4 = setTimeout(() => setStep(4), 2400);

    try {
      const response = await postApi.generatePost({
        platform,
        prompt_override: promptOverride
      });

      setTimeout(() => {
        setStep(5);
        setIsGenerating(false);
        setResultPost(response.data.post);
        if (onPostGenerated) onPostGenerated(response.data.post);
      }, 3000);
    } catch (err) {
      alert('AI Generation failed: ' + (err.response?.data?.message || err.message));
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResultPost(null);
    setIsGenerating(false);
    setStep(0);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '28px', position: 'relative' }}>
        <button
          onClick={handleReset}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} color="var(--primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>AI Content Generator</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Multi-provider failover content generation engine</p>
          </div>
        </div>

        {!isGenerating && !resultPost && (
          <div>
            <div className="form-group">
              <label className="form-label">Target Platform</label>
              <select className="form-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="both">Both (Facebook Page + Instagram)</option>
                <option value="instagram">Instagram Only</option>
                <option value="facebook">Facebook Page Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Custom Topic / Prompt Override (Optional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Highlight our upcoming weekend promo pass or morning mobility routine..."
                value={promptOverride}
                onChange={(e) => setPromptOverride(e.target.value)}
              />
            </div>

            <button onClick={handleStartGeneration} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
              <Sparkles size={18} /> Generate Post Now
            </button>
          </div>
        )}

        {isGenerating && (
          <div style={{ padding: '10px 0' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              Creating your social post...
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {steps.map((label, idx) => {
                const isDone = idx < step;
                const isCurrent = idx === step;

                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: idx <= step ? 1 : 0.4 }}>
                    {isDone ? (
                      <CheckCircle2 size={18} color="var(--success)" />
                    ) : isCurrent ? (
                      <Loader2 size={18} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--text-dim)' }} />
                    )}
                    <span style={{ fontSize: '13px', fontWeight: isCurrent ? 700 : 400 }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {resultPost && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <CheckCircle2 size={48} color="var(--success)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Post Generated & Scheduled!</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Created via {resultPost.meta_info?.text_provider || 'OpenAI'} & {resultPost.meta_info?.image_provider || 'Stability AI'}
            </p>

            {resultPost.image_url && (
              <img src={resultPost.image_url} alt="Generated" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
            )}

            <button onClick={handleReset} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              View in Scheduled Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
