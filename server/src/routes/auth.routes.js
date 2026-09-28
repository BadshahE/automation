const express = require('express');
const router = express.Router();
const store = require('../db/store');

// POST /api/v1/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = store.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.active) {
    return res.status(403).json({ success: false, message: 'Your account has been disabled by administrator.' });
  }

  const token = `jwt_token_${user.id}_${Date.now()}`;
  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  });
});

// POST /api/v1/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `u-creator-${Date.now()}`,
    email,
    password,
    role: role === 'admin' ? 'admin' : 'creator',
    name,
    created_at: new Date().toISOString(),
    active: true
  };

  store.users.push(newUser);

  // Initialize default content preferences for new creator
  store.content_preferences.push({
    id: `cp-${Date.now()}`,
    user_id: newUser.id,
    niche: 'General Business',
    tone: 'Professional',
    posting_frequency: 'Once Daily',
    topics: ['Industry Trends', 'Updates'],
    language: 'English',
    style: 'Modern',
    hashtag_preference: 'Automatic',
    updated_at: new Date().toISOString()
  });

  const token = `jwt_token_${newUser.id}_${Date.now()}`;

  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    },
    token
  });
});

// GET /api/v1/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided' });

  // Default return primary demo creator or admin based on header token string
  const userId = authHeader.includes('admin') ? 'u-admin-001' : 'u-creator-001';
  const user = store.users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

module.exports = router;
