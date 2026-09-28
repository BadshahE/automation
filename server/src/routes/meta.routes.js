const express = require('express');
const router = express.Router();
const store = require('../db/store');
const MetaService = require('../services/metaService');

// GET /api/v1/meta/auth - Generate OAuth Redirect URL
router.get('/auth', (req, res) => {
  const url = MetaService.getOAuthUrl(req.query.platform);
  res.json({ success: true, auth_url: url });
});

// GET /api/v1/meta/callback - OAuth Callback handler
router.get('/callback', async (req, res) => {
  try {
    const userId = req.query.user_id || 'u-creator-001';
    const result = await MetaService.handleCallback(req.query.code, userId);
    res.json({ success: true, connections: result, message: 'Meta accounts connected successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/meta/connections - Get social account connection status
router.get('/connections', (req, res) => {
  const userId = req.query.user_id || 'u-creator-001';
  const connections = store.social_connections.filter(c => c.user_id === userId);
  
  res.json({
    success: true,
    facebook: connections.find(c => c.platform === 'facebook') || null,
    instagram: connections.find(c => c.platform === 'instagram') || null
  });
});

// POST /api/v1/meta/disconnect - Disconnect platform
router.post('/disconnect', (req, res) => {
  const { platform, user_id } = req.body;
  const uid = user_id || 'u-creator-001';

  store.social_connections = store.social_connections.filter(
    c => !(c.user_id === uid && c.platform === platform)
  );

  store.activity_logs.unshift({
    id: `act-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user: uid,
    event: 'Social Account Disconnected',
    platform: platform,
    status: 'info',
    details: `Disconnected ${platform} account connection.`
  });

  res.json({ success: true, message: `Disconnected ${platform} account successfully.` });
});

// POST /api/v1/meta/webhook - Meta Webhook Endpoint (PRD Section 34)
router.post('/webhook', async (req, res) => {
  const AutomationEngine = require('../services/automationEngine');
  try {
    const result = await AutomationEngine.processCommentWebhook(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/meta/webhook - Meta Verification Challenge
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === (process.env.META_VERIFY_TOKEN || 'meta_automation_secret')) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

module.exports = router;
