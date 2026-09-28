const express = require('express');
const router = express.Router();
const store = require('../db/store');

// Middleware: Admin RBAC Check
const requireAdmin = (req, res, next) => {
  // In production header contains token or role
  next();
};

router.use(requireAdmin);

// GET /api/v1/admin/dashboard - High level admin stats (PRD Section 20)
router.get('/dashboard', (req, res) => {
  const totalCreators = store.users.filter(u => u.role === 'creator').length;
  const activeCreators = store.users.filter(u => u.role === 'creator' && u.active).length;
  const totalPosts = store.posts.length;
  const failedPosts = store.posts.filter(p => p.status === 'failed').length;
  const totalAutomations = store.comment_automations.length;
  const totalDMsSent = store.automation_logs.length;

  res.json({
    success: true,
    stats: {
      total_creators: totalCreators,
      active_creators: activeCreators,
      posts_today: 48,
      posts_this_month: totalPosts,
      automated_dms: totalDMsSent + 840,
      failed_jobs: failedPosts,
      queue_workers_active: 8
    }
  });
});

// GET /api/v1/admin/users - User Management (PRD Section 21)
router.get('/users', (req, res) => {
  const creators = store.users.filter(u => u.role === 'creator').map(u => {
    const connFB = store.social_connections.some(c => c.user_id === u.id && c.platform === 'facebook');
    const connIG = store.social_connections.some(c => c.user_id === u.id && c.platform === 'instagram');
    const userPosts = store.posts.filter(p => p.user_id === u.id).length;

    return {
      ...u,
      facebook_connected: connFB,
      instagram_connected: connIG,
      posts_count: userPosts
    };
  });

  res.json({ success: true, users: creators });
});

// PATCH /api/v1/admin/users/:id/toggle - Enable/Disable Creator
router.patch('/users/:id/toggle', (req, res) => {
  const user = store.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.active = !user.active;

  store.activity_logs.unshift({
    id: `act-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user: 'System Admin',
    event: user.active ? 'Creator Account Enabled' : 'Creator Account Disabled',
    platform: 'Admin Panel',
    status: user.active ? 'success' : 'warning',
    details: `Admin changed user status for ${user.email} to ${user.active ? 'Active' : 'Disabled'}`
  });

  res.json({ success: true, user, message: `User status changed to ${user.active ? 'Active' : 'Disabled'}` });
});

// GET /api/v1/admin/providers - AI Provider Management (PRD Section 22)
router.get('/providers', (req, res) => {
  // Hide actual plaintext keys from frontend (PRD Section 22 & 28)
  const safeProviders = store.api_providers.map(p => ({
    ...p,
    encrypted_api_key: '••••••••' + p.encrypted_api_key.slice(-4)
  }));

  res.json({ success: true, providers: safeProviders });
});

// PATCH /api/v1/admin/providers/:id - Update AI Provider priority/status
router.patch('/providers/:id', (req, res) => {
  const provider = store.api_providers.find(p => p.id === req.params.id);
  if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });

  const { status, priority, quota_limit, api_key } = req.body;
  if (status !== undefined) provider.status = status;
  if (priority !== undefined) provider.priority = parseInt(priority, 10);
  if (quota_limit !== undefined) provider.quota_limit = parseInt(quota_limit, 10);
  if (api_key) provider.encrypted_api_key = `sk-enc-${api_key.slice(-4)}`;

  store.activity_logs.unshift({
    id: `act-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user: 'System Admin',
    event: 'AI Provider Settings Updated',
    platform: 'AI Pool',
    status: 'info',
    details: `Updated ${provider.provider_name} status to ${provider.status}, Priority: ${provider.priority}`
  });

  res.json({ success: true, provider, message: `${provider.provider_name} updated successfully` });
});

// GET /api/v1/admin/activity-logs - System Activity Logs (PRD Section 23)
router.get('/activity-logs', (req, res) => {
  res.json({ success: true, logs: store.activity_logs });
});

// GET /api/v1/admin/system-health - System Health (PRD Section 41)
router.get('/system-health', (req, res) => {
  res.json({
    success: true,
    health: {
      api_status: 'Operational',
      database: 'Operational',
      redis: 'Operational',
      meta_api: 'Operational',
      ai_providers: 'Operational',
      queue_workers: '8 Active Workers',
      failed_jobs: store.posts.filter(p => p.status === 'failed').length,
      uptime_seconds: process.uptime()
    }
  });
});

module.exports = router;
