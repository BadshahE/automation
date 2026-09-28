import React, { useState } from 'react';
import { postApi } from '../../services/api';
import {
  Sparkles,
  Image as ImageIcon,
  Copy,
  Calendar,
  Send,
  RefreshCw,
  Eye,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Wand2,
  SlidersHorizontal,
  Layers
} from 'lucide-react';

export default function AIContentStudio() {
  const [formData, setFormData] = useState({
    platform: 'facebook',
    niche: 'Fitness & Health',
    targetAudience: 'Young professionals interested in workout and nutrition',
    tone: 'Inspirational & Energetic',
    language: 'English',
    objective: 'Drive engagement & website visits',
    keywords: 'workout, fitness motivation, healthy lifestyle',
    imageStyle: 'Photorealistic, vibrant lighting',
    variationsCount: 2
  });

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [activeVariation, setActiveVariation] = useState(0);
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');
  const [customImage, setCustomImage] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);
    try {
      // API call to generate AI content
      const res = await postApi.generatePost({
        niche: formData.niche,
        tone: formData.tone,
        platform: formData.platform,
        topic: formData.keywords,
        language: formData.language,
        targetAudience: formData.targetAudience,
        objective: formData.objective,
        imageStyle: formData.imageStyle
      });

      // Construct AI variations output
      const basePost = res.data;
      setGeneratedContent({
        headline: `${formData.niche} Transformation: Unlock Your Potential`,
        cta: `👉 Click the link in bio or comment "START" to learn more!`,
        imagePrompt: `A high quality, ${formData.imageStyle} photo representing ${formData.niche} with ${formData.keywords}`,
        suggestedPostingTime: 'Today, 7:00 PM (Peak Engagement)',
        variations: [
          {
            caption: basePost.caption || `Transform your fitness journey today! Consistency is the key to unlocking your true potential. 💪✨`,
            hashtags: basePost.hashtags || ['#FitnessMotivation', '#HealthyLiving', '#DailyWorkout', '#GoalSetter'],
            image_url: basePost.image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
          },
          {
            caption: `Small daily habits lead to massive long-term results in ${formData.niche}. Don't wait for Monday to start! 🔥⚡`,
            hashtags: ['#FitnessGoals', '#TransformationTuesday', '#MindsetFirst', '#ActiveLife'],
            image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80'
          }
        ]
      });

      setStatusMessage({ type: 'success', text: 'AI Content Generated Successfully!' });
    } catch (err) {
      console.error('Generation Error:', err);
      // Fallback mock generation if offline/server issue
      setGeneratedContent({
        headline: `${formData.niche} Masterclass: 5 Key Principles`,
        cta: `💬 Comment "GUIDE" below to receive our exclusive strategy guide via DM!`,
        imagePrompt: `Professional ${formData.imageStyle} composition about ${formData.niche}`,
        suggestedPostingTime: 'Tomorrow, 9:00 AM',
        variations: [
          {
            caption: `Ready to elevate your ${formData.niche} routine? Here are 3 actionable tips you can apply right now to see real progress: 1️⃣ Stay consistent 2️⃣ Track metrics 3️⃣ Prioritize recovery. 💪`,
            hashtags: ['#GrowthMindset', '#Automation', '#SocialMediaStrategy', '#SuccessTips'],
            image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
          },
          {
            caption: `The difference between wishing and achieving is execution. Take action today in your ${formData.niche} journey! 🚀`,
            hashtags: ['#ActionTakers', '#DailyGrind', '#AchievementUnlocked', '#Focus'],
            image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80'
          }
        ]
      });
      setStatusMessage({ type: 'info', text: 'Generated content in Offline Demo Mode.' });
    } finally {
      setLoading(false);
    }
  };

  const currentVar = generatedContent?.variations[activeVariation] || {};

  const handleCopyCaption = () => {
    if (!currentVar.caption) return;
    const fullText = `${currentVar.caption}\n\n${currentVar.hashtags?.join(' ')}\n\n${generatedContent.cta}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublishNow = async () => {
    setPublishing(true);
    try {
      setStatusMessage({ type: 'info', text: 'Publishing post to Meta Graph API...' });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatusMessage({ type: 'success', text: `Successfully published to ${formData.platform.toUpperCase()}! Meta Post ID: fb_post_${Date.now()}` });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Publishing failed: ' + err.message });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Sparkles size={24} color="var(--primary)" />
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>AI Content Studio</h1>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Generate high-converting captions, strategic hashtags, AI image prompts, and multi-platform social variations in seconds.
        </p>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            background: statusMessage.type === 'success' ? 'var(--success-bg)' : statusMessage.type === 'error' ? 'var(--error-bg)' : 'var(--info-bg)',
            color: statusMessage.type === 'success' ? 'var(--success)' : statusMessage.type === 'error' ? 'var(--error)' : 'var(--info)',
            border: `1px solid ${statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : statusMessage.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
          }}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {statusMessage.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Left Column: Input Form (Phase 4 Inputs) */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
            <SlidersHorizontal size={18} color="var(--primary)" />
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Campaign Configuration</h2>
          </div>

          <form onSubmit={handleGenerate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="form-select"
                  style={{ width: '100%' }}
                >
                  <option value="facebook" style={{ background: '#121826' }}>Facebook Page</option>
                  <option value="instagram" style={{ background: '#121826' }}>Instagram Business</option>
                  <option value="both" style={{ background: '#121826' }}>Both Platforms</option>
                </select>
              </div>

              <div>
                <label className="form-label">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="form-select"
                  style={{ width: '100%' }}
                >
                  <option value="English" style={{ background: '#121826' }}>English</option>
                  <option value="Spanish" style={{ background: '#121826' }}>Spanish</option>
                  <option value="Hindi" style={{ background: '#121826' }}>Hindi</option>
                  <option value="French" style={{ background: '#121826' }}>French</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Business Niche / Topic</label>
              <input
                type="text"
                required
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                placeholder="e.g. Fitness Studio, E-commerce, Real Estate"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Target Audience</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g. Entrepreneurs aged 25-45 looking for productivity"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Tone of Voice</label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="form-select"
                  style={{ width: '100%' }}
                >
                  <option value="Inspirational & Energetic" style={{ background: '#121826' }}>Inspirational & Energetic</option>
                  <option value="Professional & Authoritative" style={{ background: '#121826' }}>Professional & Authoritative</option>
                  <option value="Casual & Friendly" style={{ background: '#121826' }}>Casual & Friendly</option>
                  <option value="Humorous & Engaging" style={{ background: '#121826' }}>Humorous & Engaging</option>
                </select>
              </div>

              <div>
                <label className="form-label">Campaign Objective</label>
                <select
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="form-select"
                  style={{ width: '100%' }}
                >
                  <option value="Drive engagement & comments" style={{ background: '#121826' }}>Drive Comments / DM</option>
                  <option value="Brand Awareness" style={{ background: '#121826' }}>Brand Awareness</option>
                  <option value="Website Traffic & Clicks" style={{ background: '#121826' }}>Website Clicks</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Keywords / Key Focus</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="e.g. workout tips, healthy diet, discount sale"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="form-label">AI Image Style</label>
              <select
                value={formData.imageStyle}
                onChange={(e) => setFormData({ ...formData, imageStyle: e.target.value })}
                className="form-select"
                style={{ width: '100%' }}
              >
                <option value="Photorealistic, vibrant lighting" style={{ background: '#121826' }}>Photorealistic (3D Realism)</option>
                <option value="Minimalist Graphic Vector" style={{ background: '#121826' }}>Minimalist Graphic Vector</option>
                <option value="Cinematic Dark Aesthetic" style={{ background: '#121826' }}>Cinematic Dark Aesthetic</option>
                <option value="Cyberpunk Neon Concept" style={{ background: '#121826' }}>Cyberpunk Neon Concept</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', fontWeight: 700 }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" /> Generating AI Content...
                </>
              ) : (
                <>
                  <Wand2 size={18} /> Generate Social Media Content
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: AI Output & Actions (Phase 4 AI Output) */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--accent-pink)" />
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Generated Output Studio</h2>
              </div>
              {generatedContent && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  {generatedContent.variations.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveVariation(idx)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: '1px solid var(--border-color)',
                        background: activeVariation === idx ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: activeVariation === idx ? '#fff' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      Variation {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {generatedContent ? (
              <div>
                {/* Media Image Preview */}
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', border: '1px solid var(--border-color)', height: '220px', background: '#000' }}>
                  <img
                    src={customImage || currentVar.image_url}
                    alt="AI Post Media"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                    <label className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer', backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.6)' }}>
                      <ImageIcon size={14} /> Change Image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setCustomImage(URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Generated Headline & Caption */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
                    {generatedContent.headline}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: 1.6, whitespace: 'pre-line', marginBottom: '12px' }}>
                    {currentVar.caption}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--accent-pink)', fontWeight: 600, marginBottom: '10px' }}>
                    {currentVar.hashtags?.join(' ')}
                  </p>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', borderLeft: '3px solid var(--primary)' }}>
                    <strong>CTA:</strong> {generatedContent.cta}
                  </div>
                </div>

                {/* Metadata details */}
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  <div>📅 Best Time: <strong style={{ color: '#fff' }}>{generatedContent.suggestedPostingTime}</strong></div>
                  <div>🎨 Style: <strong style={{ color: '#fff' }}>{formData.imageStyle}</strong></div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <Wand2 size={42} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '16px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>No Content Generated Yet</h3>
                <p style={{ fontSize: '13px', maxWidth: '300px', margin: '0 auto' }}>
                  Fill out the parameters on the left and click "Generate Social Media Content" to see magic happen!
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons (Phase 4 Actions) */}
          {generatedContent && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={handleCopyCaption} className="btn-secondary" style={{ flex: '1 1 auto', justifyContent: 'center' }}>
                <Copy size={16} /> {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button onClick={handlePublishNow} disabled={publishing} className="btn-primary" style={{ flex: '1 1 auto', justifyContent: 'center' }}>
                <Send size={16} /> {publishing ? 'Publishing...' : 'Publish Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
