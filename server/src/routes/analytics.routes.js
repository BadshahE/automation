const express = require('express');
const router = express.Router();
const store = require('../db/store');

// GET /api/v1/analytics - Get analytics data for creator dashboard & charts
router.get('/', (req, res) => {
  const uid = req.query.user_id || 'u-creator-001';
  const posts = store.posts.filter(p => p.user_id === uid);
  const automations = store.comment_automations.filter(a => a.user_id === uid);

  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const scheduledPosts = posts.filter(p => p.status === 'scheduled').length;
  const failedPosts = posts.filter(p => p.status === 'failed').length;

  const totalAutomatedDMs = automations.reduce((sum, a) => sum + (a.dms_sent_count || 0), 0);
  const nextPost = posts.filter(p => p.status === 'scheduled').sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))[0] || null;

  // Chart data: Posts per week
  const postsPerWeek = [
    { week: 'Week 1', facebook: 4, instagram: 6, total: 10 },
    { week: 'Week 2', facebook: 5, instagram: 8, total: 13 },
    { week: 'Week 3', facebook: 7, instagram: 9, total: 16 },
    { week: 'Week 4', facebook: 6, instagram: 12, total: 18 }
  ];

  // Chart data: DMs per day
  const dmsPerDay = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 18 },
    { day: 'Wed', count: 24 },
    { day: 'Thu', count: 19 },
    { day: 'Fri', count: 32 },
    { day: 'Sat', count: 41 },
    { day: 'Sun', count: 28 }
  ];

  res.json({
    success: true,
    summary: {
      total_posts: totalPosts,
      published_posts: publishedPosts,
      scheduled_posts: scheduledPosts,
      failed_posts: failedPosts,
      automated_dms: totalAutomatedDMs,
      next_post_time: nextPost ? nextPost.scheduled_at : null
    },
    charts: {
      posts_per_week: postsPerWeek,
      dms_per_day: dmsPerDay
    }
  });
});

module.exports = router;
