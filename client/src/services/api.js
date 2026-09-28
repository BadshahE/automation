import axios from 'axios';

const API_BASE = '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for attaching auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('autosocial_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, role) => api.post('/auth/register', { name, email, password, role }),
  me: () => api.get('/auth/me')
};

export const metaApi = {
  getAuthUrl: (platform) => api.get(`/meta/auth?platform=${platform}`),
  getConnections: (userId) => api.get(`/meta/connections?user_id=${userId || ''}`),
  disconnect: (platform) => api.post('/meta/disconnect', { platform }),
  simulateCallback: () => api.get('/meta/callback')
};

export const postApi = {
  getPosts: (params) => api.get('/posts', { params }),
  getScheduled: (userId) => api.get(`/posts/scheduled?user_id=${userId || ''}`),
  generatePost: (data) => api.post('/posts/generate', data),
  publishPost: (id) => api.post(`/posts/${id}/publish`),
  updatePost: (id, data) => api.patch(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`)
};

export const automationApi = {
  getAutomations: (userId) => api.get(`/automations?user_id=${userId || ''}`),
  createAutomation: (data) => api.post('/automations', data),
  updateAutomation: (id, data) => api.patch(`/automations/${id}`, data),
  deleteAutomation: (id) => api.delete(`/automations/${id}`)
};

export const preferenceApi = {
  getPreferences: (userId) => api.get(`/preferences?user_id=${userId || ''}`),
  savePreferences: (data) => api.post('/preferences', data)
};

export const analyticsApi = {
  getAnalytics: (userId) => api.get(`/analytics?user_id=${userId || ''}`)
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  toggleUser: (id) => api.patch(`/admin/users/${id}/toggle`),
  getProviders: () => api.get('/admin/providers'),
  updateProvider: (id, data) => api.patch(`/admin/providers/${id}`, data),
  getActivityLogs: () => api.get('/admin/activity-logs'),
  getSystemHealth: () => api.get('/admin/system-health')
};

export default api;
