const express = require('express');
const router = express.Router();
const store = require('../db/store');

// GET /api/v1/preferences - Get creator content preferences
router.get('/', (req, res) => {
  const uid = req.query.user_id || 'u-creator-001';
  let pref = store.content_preferences.find(p => p.user_id === uid);

  if (!pref) {
    pref = {
      id: `cp-${Date.now()}`,
      user_id: uid,
      niche: 'Fitness & Health',
      tone: 'Inspirational',
      posting_frequency: 'Twice Daily',
      topics: ['Workout Routines', 'Nutrition Tips'],
      language: 'English',
      style: 'Modern & Vibrant',
      hashtag_preference: 'Automatic',
      updated_at: new Date().toISOString()
    };
    store.content_preferences.push(pref);
  }

  res.json({ success: true, preferences: pref });
});

// POST /api/v1/preferences - Save content preferences
router.post('/', (req, res) => {
  const { user_id, niche, tone, posting_frequency, topics, language, style, hashtag_preference } = req.body;
  const uid = user_id || 'u-creator-001';

  let pref = store.content_preferences.find(p => p.user_id === uid);

  if (!pref) {
    pref = {
      id: `cp-${Date.now()}`,
      user_id: uid,
      niche: niche || 'Fitness & Health',
      tone: tone || 'Inspirational',
      posting_frequency: posting_frequency || 'Twice Daily',
      topics: topics || ['Workout', 'Health'],
      language: language || 'English',
      style: style || 'Modern',
      hashtag_preference: hashtag_preference || 'Automatic',
      updated_at: new Date().toISOString()
    };
    store.content_preferences.push(pref);
  } else {
    if (niche) pref.niche = niche;
    if (tone) pref.tone = tone;
    if (posting_frequency) pref.posting_frequency = posting_frequency;
    if (topics) pref.topics = Array.isArray(topics) ? topics : topics.split(',').map(t => t.trim());
    if (language) pref.language = language;
    if (style) pref.style = style;
    if (hashtag_preference) pref.hashtag_preference = hashtag_preference;
    pref.updated_at = new Date().toISOString();
  }

  store.activity_logs.unshift({
    id: `act-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user: uid,
    event: 'Content Preferences Updated',
    platform: 'Settings',
    status: 'info',
    details: `Updated niche to ${pref.niche}, frequency: ${pref.posting_frequency}`
  });

  res.json({ success: true, preferences: pref, message: 'Content preferences updated successfully!' });
});

module.exports = router;
