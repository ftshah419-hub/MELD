import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  ShoppingBag,
  Cpu,
  BookOpen,
  Utensils,
  Inbox,
  Package,
  HeartHandshake,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const MODULES_CONFIG = [
  {
    id: 'wisdom-loop',
    name: 'Wisdom Loop',
    tagline: 'Mentorship & Knowledge Transfer',
    color: '#6573B8',
    icon: GraduationCap,
    desc: 'Connect with seasoned mentors & book 1:1 sessions'
  },
  {
    id: 'craft-to-cart',
    name: 'Craft to Cart',
    tagline: 'Artisan Heritage Marketplace',
    color: '#C47753',
    icon: ShoppingBag,
    desc: 'Fair-trade handcrafted treasures from traditional masters'
  },
  {
    id: 'reconnect',
    name: 'ReConnect',
    tagline: 'Circular Electronics Lifeline',
    color: '#368F88',
    icon: Cpu,
    desc: 'Donate, request or salvage unused devices for learning'
  },
  {
    id: 'book-bridge',
    name: 'Book Bridge',
    tagline: 'Community Knowledge Shelves',
    color: '#D3A34F',
    icon: BookOpen,
    desc: 'Share, request and distribute books to aspiring minds'
  },
  {
    id: 'second-serve',
    name: 'Second Serve',
    tagline: 'Surplus Food Rescue & Dispatch',
    color: '#70975D',
    icon: Utensils,
    desc: 'Divert surplus banquet & kitchen meals to shelters fast'
  }
];

export function UserSidebar({ activeTab, onSelectTab, counts = {} }) {
  const { logout } = useAuth();

  const mainNav = [
    {
      id: 'dashboard',
      name: 'Overview',
      icon: LayoutDashboard
    }
  ];

  const userNav = [
    {
      id: 'requests',
      name: 'My Requests',
      icon: Inbox,
      badge: counts.requests
    },
    {
      id: 'orders',
      name: 'My Orders',
      icon: Package,
      badge: counts.orders
    },
    {
      id: 'contributions',
      name: 'Contributions',
      icon: HeartHandshake,
      badge: counts.contributions
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      badge: counts.unreadNotifications
    },
    {
      id: 'profile',
      name: 'Profile & Settings',
      icon: User
    }
  ];

  return (
    <aside
      className="card-surface user-sidebar"
      style={{
        width: '260px',
        flexShrink: 0,
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 0.85rem',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'fit-content',
        position: 'sticky',
        top: '90px'
      }}
    >
      <div>
        {/* Main Section */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              padding: '0 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}
          >
            Navigation
          </div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="hover-lift-sm"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--mint)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Modules Section */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div
            style={{
              padding: '0 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Impact Modules</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600 }}>5 Active</span>
          </div>

          {MODULES_CONFIG.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeTab === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => onSelectTab(mod.id)}
                className="hover-lift-sm"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? `${mod.color}15` : 'transparent',
                  color: isActive ? mod.color : 'var(--text)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? `3px solid ${mod.color}` : '3px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Icon size={17} color={isActive ? mod.color : 'var(--text-muted)'} />
                  <span>{mod.name}</span>
                </div>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: mod.color,
                    opacity: isActive ? 1 : 0.4
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* User Activity & Records */}
        <div>
          <div
            style={{
              padding: '0 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}
          >
            My Activity
          </div>

          {userNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="hover-lift-sm"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--mint)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Icon size={17} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className="badge badge-mint"
                    style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', fontWeight: 700 }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Action */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', marginTop: '1rem' }}>
        <button
          onClick={logout}
          className="hover-lift-sm"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--error)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default UserSidebar;
