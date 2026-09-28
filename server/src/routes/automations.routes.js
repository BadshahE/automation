const express = require('express');
const router = express.Router();
const store = require('../db/store');

// GET /api/v1/automations - List automations for creator
router.get('/', (req, res) => {
  const uid = req.query.user_id || 'u-creator-001';
  const list = store.comment_automations.filter(a => a.user_id === uid);
  const logs = store.automation_logs.filter(l => {
    const auto = store.comment_automations.find(a => a.id === l.automation_id);
    return auto && auto.user_id === uid;
  });

  res.json({ success: true, automations: list, logs });
});

// POST /api/v1/automations - Create new Comment-to-DM automation rule
router.post('/', (req, res) => {
  const { user_id, post_id, name, keywords, dm_message, dm_link } = req.body;
  const uid = user_id || 'u-creator-001';

  if (!keywords || !dm_message) {
    return res.status(400).json({ success: false, message: 'Keywords and DM message are required.' });
  }

  const post = store.posts.find(p => p.id === post_id);

  const newRule = {
    id: `auto-${Date.now()}`,
    user_id: uid,
    post_id: post_id || null,
    post_title: post ? (post.caption.substring(0, 30) + '...') : 'All Instagram Posts',
    name: name || 'Comment-to-DM Rule',
    keywords: Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim()),
    dm_message,
    dm_link: dm_link || null,
    active: true,
    created_at: new Date().toISOString(),
    triggered_count: 0,
    dms_sent_count: 0
  };

  store.comment_automations.unshift(newRule);

  store.activity_logs.unshift({
    id: `act-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user: uid,
    event: 'Automation Created',
    platform: 'Instagram',
    status: 'success',
    details: `Created DM automation "${newRule.name}" with keywords: [${newRule.keywords.join(', ')}]`
  });

  res.status(201).json({ success: true, automation: newRule });
});

// PATCH /api/v1/automations/:id - Toggle/update automation rule
router.patch('/:id', (req, res) => {
  const auto = store.comment_automations.find(a => a.id === req.params.id);
  if (!auto) return res.status(404).json({ success: false, message: 'Automation rule not found' });

  const { active, name, keywords, dm_message, dm_link } = req.body;
  if (active !== undefined) auto.active = active;
  if (name !== undefined) auto.name = name;
  if (keywords !== undefined) auto.keywords = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
  if (dm_message !== undefined) auto.dm_message = dm_message;
  if (dm_link !== undefined) auto.dm_link = dm_link;

  res.json({ success: true, automation: auto });
});

// DELETE /api/v1/automations/:id - Delete automation rule
router.delete('/:id', (req, res) => {
  const index = store.comment_automations.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Automation rule not found' });

  const deleted = store.comment_automations.splice(index, 1);
  res.json({ success: true, message: 'Automation rule deleted', automation: deleted[0] });
});

module.exports = router;
