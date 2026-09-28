import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  MessageSquareReply,
  Share2,
  Sliders,
  BarChart3,
  Users,
  Cpu,
  Activity,
  HeartPulse,
  LogOut,
  Repeat,
  CheckCircle2,
  Bell,
  HelpCircle,
  Wand2
} from 'lucide-react';

export default function Sidebar() {
  const { role, switchRole, logout } = useAuth();
  const location = useLocation();

  const creatorNav = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Social Accounts', path: '/connect-accounts', icon: Share2 },
    { label: 'AI Content Studio', path: '/ai-studio', icon: Wand2 },
    { label: 'Content Calendar', path: '/posts/scheduled', icon: Calendar },
    { label: 'Published Posts', path: '/posts/published', icon: CheckCircle2 },
    { label: 'Comment Automation', path: '/automations', icon: MessageSquareReply },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Settings', path: '/settings', icon: Sliders },
    { label: 'Help & Support', path: '/help', icon: HelpCircle },
  ];

  const adminNav = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Creator Users', path: '/admin/users', icon: Users },
    { label: 'AI Provider Pool', path: '/admin/providers', icon: Cpu },
    { label: 'System Health', path: '/admin/system-health', icon: HeartPulse },
    { label: 'Activity Logs', path: '/admin/activity-logs', icon: Activity },
  ];

  const navItems = role === 'admin' ? adminNav : creatorNav;

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(10, 13, 20, 0.95)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      padding: '24px 16px',
      zIndex: 50
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-pink) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '20px',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
        }}>
          🚀
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', lineHeight: 1.1 }}>AutoSocial <span style={{ color: 'var(--accent-pink)' }}>AI</span></h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            {role === 'admin' ? '🛡️ Admin Console' : '✨ Creator Suite'}
          </span>
        </div>
      </div>

      {/* Mode Switcher Toggle */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        padding: '8px 12px',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Mode: <strong style={{ color: '#fff' }}>{role === 'admin' ? 'Admin' : 'Creator'}</strong>
        </div>
        <button
          onClick={() => switchRole(role === 'admin' ? 'creator' : 'admin')}
          className="btn-secondary"
          style={{ padding: '3px 8px', fontSize: '11px', gap: '4px' }}
        >
          <Repeat size={12} /> Switch
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '9px 14px',
                borderRadius: '9px',
                color: isActive ? '#fff' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13.5px',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={17} color={isActive ? 'var(--primary)' : 'currentColor'} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Meta API Active</span>
        </div>
        <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }} title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
