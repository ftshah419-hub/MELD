import React, { useState, useEffect } from 'react';
import {
  Bell,
  Sparkles,
  User as UserIcon,
  ChevronRight,
  Heart,
  CheckCircle,
  ExternalLink,
  Clock
} from 'lucide-react';
import userService from '../../services/user/userService';

export function UserHeader({ user, activeModule, onSelectTab, onOpenContribute }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await userService.getNotifications({ limit: 5 });
      if (res && res.notifications) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch {
      // Graceful fallback for offline/initial state
    }
  };

  const markAllRead = async () => {
    try {
      await userService.markNotificationRead('all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // Ignored
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header
      className="card-surface"
      style={{
        padding: '1.25rem 1.75rem',
        marginBottom: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'relative'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {getGreeting()},
          </span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
            {user?.name || 'Changemaker'}
          </span>
          <span
            className="badge badge-mint"
            style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', fontWeight: 600 }}
          >
            Level 1 Catalyst
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 800,
              margin: 0,
              color: 'var(--text)'
            }}
          >
            {activeModule ? activeModule.name : 'Personal Impact Hub'}
          </h2>
          {activeModule && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                backgroundColor: `${activeModule.color}15`,
                color: activeModule.color,
                fontWeight: 600
              }}
            >
              {activeModule.tagline}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Make a voluntary contribution button */}
        <button
          onClick={onOpenContribute}
          className="btn btn-outline hover-lift"
          style={{
            borderColor: 'var(--accent)',
            color: '#996C0B',
            backgroundColor: 'rgba(215, 169, 74, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)'
          }}
        >
          <Heart size={16} fill="rgba(215, 169, 74, 0.4)" />
          <span>Support a Cause</span>
        </button>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
            className="btn btn-secondary hover-lift"
            style={{
              width: '42px',
              height: '42px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--error)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Popover Dropdown */}
          {showNotifications && (
            <div
              className="card-surface animate-scale-in"
              style={{
                position: 'absolute',
                top: '52px',
                right: 0,
                width: '320px',
                maxWidth: '90vw',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border)',
                zIndex: 100,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '0.85rem 1.15rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--surface-alt)'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                  Notifications
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Bell size={24} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>No recent notifications</p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        padding: '0.85rem 1.15rem',
                        borderBottom: '1px solid var(--border)',
                        backgroundColor: item.read ? 'transparent' : 'rgba(22, 75, 59, 0.04)',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: item.read ? 'transparent' : 'var(--primary)',
                          marginTop: '6px',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: item.read ? 500 : 700, color: 'var(--text)' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.4 }}>
                          {item.message}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div
                style={{
                  padding: '0.65rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--surface-alt)',
                  borderTop: '1px solid var(--border)'
                }}
              >
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    if (onSelectTab) onSelectTab('notifications');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8rem',
                    color: 'var(--primary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View all notifications &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <button
          onClick={() => onSelectTab && onSelectTab('profile')}
          className="btn hover-lift"
          style={{
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            padding: '0.4rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            borderRadius: '999px'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
            Profile
          </span>
        </button>
      </div>
    </header>
  );
}

export default UserHeader;
