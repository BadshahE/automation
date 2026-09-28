const express = require('express');
const cors = require('cors');
require('dotenv').config();

const store = require('./db/store');
const MetaService = require('./services/metaService');

const authRoutes = require('./routes/auth.routes');
const metaRoutes = require('./routes/meta.routes');
const postsRoutes = require('./routes/posts.routes');
const automationsRoutes = require('./routes/automations.routes');
const preferencesRoutes = require('./routes/preferences.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS & Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes (PRD Section 24)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/meta', metaRoutes);
app.use('/api/v1/posts', postsRoutes);
app.use('/api/v1/automations', automationsRoutes);
app.use('/api/v1/preferences', preferencesRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Global 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler (PRD Section 26)
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Background Worker Simulation: Auto-publishing scheduled posts (BullMQ / Cron replacement)
setInterval(async () => {
  const now = new Date();
  const duePosts = store.posts.filter(p => p.status === 'scheduled' && new Date(p.scheduled_at) <= now);
  
  for (const post of duePosts) {
    try {
      console.log(`[Background Worker] Auto-publishing scheduled post ${post.id}...`);
      await MetaService.publishPost(post.id);
    } catch (err) {
      console.error(`[Background Worker] Failed to publish post ${post.id}:`, err);
    }
  }
}, 30000); // Check every 30s

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 AI Content Automation Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`====================================================`);
});
