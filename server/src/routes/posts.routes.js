const express = require('express');
const router = express.Router();
const store = require('../db/store');
const AIService = require('../services/aiService');
const MetaService = require('../services/metaService');

// GET /api/v1/posts - List posts with filters
router.get('/', (req, res) => {
  const { user_id, status, platform, search } = req.query;
  const uid = user_id || 'u-creator-001';

  let list = store.posts.filter(p => p.user_id === uid);

  if (status && status !== 'all') {
    list = list.filter(p => p.status === status);
  }

  if (platform && platform !== 'all') {
    list = list.filter(p => p.platform === platform || p.platform === 'both');
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => p.caption.toLowerCase().includes(q));
  }

  res.json({ success: true, posts: list });
});

// GET /api/v1/posts/scheduled - Scheduled posts for calendar
router.get('/scheduled', (req, res) => {
  const uid = req.query.user_id || 'u-creator-001';
  const scheduled = store.posts.filter(p => p.user_id === uid && p.status === 'scheduled');
  
  res.json({ success: true, posts: scheduled });
});

// POST /api/v1/posts/generate - AI Content Generation with Failover (PRD Section 12 & 31)
router.post('/generate', async (req, res) => {
  try {
    const { user_id, platform = 'both', scheduled_at, prompt_override } = req.body;
    const uid = user_id || 'u-creator-001';

    // Get user preferences
    const pref = store.content_preferences.find(p => p.user_id === uid) || {
      niche: 'Fitness & Wellness',
      tone: 'Inspirational',
      posting_frequency: 'Once Daily',
      topics: ['Workout', 'Health'],
      language: 'English',
      style: 'Modern'
    };

    const topic = pref.topics[Math.floor(Math.random() * pref.topics.length)] || 'Updates';

    // Step 1: AI Caption Generation with Failover
    const textResult = await AIService.generateCaption(pref.niche, topic, pref.tone, pref.style, pref.language);

    // Step 2: AI Image Generation with Failover
    const imageResult = await AIService.generateImage(prompt_override || `${pref.niche} ${topic} social media visual`);

    const fullCaption = `${textResult.caption}\n\n${textResult.hashtags}`;

    // Create scheduled post record
    const newPost = {
      id: `post-${Date.now()}`,
      user_id: uid,
      platform: platform,
      image_url: imageResult.image_url,
      caption: fullCaption,
      status: 'scheduled',
      meta_post_id: null,
      created_at: new Date().toISOString(),
      published_at: null,
      scheduled_at: scheduled_at || new Date(Date.now() + 86400000).toISOString(),
      failure_reason: null,
      meta_info: {
        text_provider: textResult.provider_used,
        image_provider: imageResult.provider_used
      }
    };

    store.posts.unshift(newPost);

    store.activity_logs.unshift({
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: uid,
      event: 'AI Post Generated',
      platform: platform,
      status: 'success',
      details: `Generated post via ${textResult.provider_used} (Text) & ${imageResult.provider_used} (Image)`
    });

    res.status(201).json({
      success: true,
      post: newPost,
      generation_details: {
        text_provider: textResult.provider_used,
        image_provider: imageResult.provider_used,
        attempts: textResult.attempts_made
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/posts/:id/publish - Trigger Immediate Meta Publishing
router.post('/:id/publish', async (req, res) => {
  try {
    const publishedPost = await MetaService.publishPost(req.params.id);
    res.json({ success: true, post: publishedPost, message: 'Post published successfully to Meta!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/v1/posts/:id - Edit Post
router.patch('/:id', (req, res) => {
  const post = store.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  const { caption, scheduled_at, platform, status } = req.body;
  if (caption !== undefined) post.caption = caption;
  if (scheduled_at !== undefined) post.scheduled_at = scheduled_at;
  if (platform !== undefined) post.platform = platform;
  if (status !== undefined) post.status = status;

  res.json({ success: true, post });
});

// DELETE /api/v1/posts/:id - Delete Post
router.delete('/:id', (req, res) => {
  const index = store.posts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Post not found' });

  const deleted = store.posts.splice(index, 1);
  res.json({ success: true, message: 'Post deleted successfully', post: deleted[0] });
});

module.exports = router;
