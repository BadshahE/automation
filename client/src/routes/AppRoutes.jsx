import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Legal & Compliance Pages (Meta App Requirement)
import PrivacyPolicy from '../pages/legal/PrivacyPolicy';
import TermsOfService from '../pages/legal/TermsOfService';
import DataDeletion from '../pages/legal/DataDeletion';

// Creator Pages
import Dashboard from '../pages/creator/Dashboard';
import Profile from '../pages/creator/Profile';
import ConnectAccounts from '../pages/creator/ConnectAccounts';
import ContentPreferences from '../pages/creator/ContentPreferences';
import MyPosts from '../pages/creator/MyPosts';
import ScheduledPosts from '../pages/creator/ScheduledPosts';
import PublishedPosts from '../pages/creator/PublishedPosts';
import AIContentStudio from '../pages/creator/AIContentStudio';
import Automations from '../pages/creator/Automations';
import Analytics from '../pages/creator/Analytics';
import Notifications from '../pages/creator/Notifications';
import Settings from '../pages/creator/Settings';
import HelpSupport from '../pages/creator/HelpSupport';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import Users from '../pages/admin/Users';
import Providers from '../pages/admin/Providers';
import ActivityLogs from '../pages/admin/ActivityLogs';
import SystemHealth from '../pages/admin/SystemHealth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Public Legal Routes (Meta Policy Required) */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/data-deletion" element={<DataDeletion />} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Creator Suite Routes (PRD & Master Prompt Phase 2) */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><Profile /></ProtectedRoute>} />
      <Route path="/connect-accounts" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><ConnectAccounts /></ProtectedRoute>} />
      <Route path="/ai-studio" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><AIContentStudio /></ProtectedRoute>} />
      <Route path="/content-preferences" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><ContentPreferences /></ProtectedRoute>} />
      <Route path="/posts" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><MyPosts /></ProtectedRoute>} />
      <Route path="/posts/scheduled" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><ScheduledPosts /></ProtectedRoute>} />
      <Route path="/posts/published" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><PublishedPosts /></ProtectedRoute>} />
      <Route path="/automations" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><Automations /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><Analytics /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><Notifications /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><Settings /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><HelpSupport /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
      <Route path="/admin/providers" element={<ProtectedRoute allowedRoles={['admin']}><Providers /></ProtectedRoute>} />
      <Route path="/admin/activity-logs" element={<ProtectedRoute allowedRoles={['admin']}><ActivityLogs /></ProtectedRoute>} />
      <Route path="/admin/system-health" element={<ProtectedRoute allowedRoles={['admin']}><SystemHealth /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
