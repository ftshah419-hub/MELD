import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Menu,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function AdminHeader({
  activeTabTitle = 'Console Workspace',
  onOpenMobileMenu,
  unreadNotificationsCount = 0,
  notifications = [],
  onMarkNotificationRead = null
}) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header
      style={{
        height: '76px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        gap: '1rem'
      }}
    >
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center'
            }}
            className="md:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Admin</span>
          <ChevronRight size={14} style={{ color: 'var(--text-subtle)' }} />
          <span
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {activeTabTitle}
          </span>
        </div>
      </div>

      {/* Center Search Bar */}
      <div style={{ flex: '1 1 350px', maxWidth: '480px', display: 'none' }} className="sm:block">
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={17}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)'
            }}
          />
          <input
            type="search"
            placeholder="Search users, listings, logs, reports..."
            style={{
              width: '100%',
              height: '38px',
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--text)',
              fontSize: '0.825rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Right Controls: Notifications & Admin Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text)',
              position: 'relative'
            }}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--error)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '320px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border)',
                zIndex: 60,
                padding: '1rem'
              }}
              className="animate-slide-up"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Platform Alerts
                </span>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              </div>

              {notifications.length === 0 ? (
                <div style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No pending system alerts.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n._id}
                      onClick={() => onMarkNotificationRead && onMarkNotificationRead(n._id)}
                      style={{
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: n.isRead ? 'var(--background)' : 'rgba(215, 169, 74, 0.1)',
                        cursor: 'pointer',
                        borderLeft: n.isRead ? '3px solid transparent' : '3px solid var(--accent)'
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {n.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }} />

        {/* User Profile Pill */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem 0.4rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.875rem'
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>

            <div style={{ display: 'none', flexDirection: 'column', textAlign: 'left' }} className="md:flex">
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>
                {user?.name || user?.fullName || 'Administrator'}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#8d6308', fontWeight: 700, lineHeight: 1.2 }}>
                SUPER ADMIN
              </span>
            </div>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '200px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border)',
                zIndex: 60,
                padding: '0.5rem'
              }}
              className="animate-slide-up"
            >
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.25rem' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text)' }}>
                  {user?.email || 'admin@meld.org'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Administrator Clearance
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--error)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                className="hover:bg-surface-alt"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
