import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  Clock,
  CheckCheck,
  AlertCircle,
  Inbox,
  ArrowRight
} from 'lucide-react';
import userService from '../../services/user/userService';
import ScrollReveal from '../../components/user/ScrollReveal';

export function Notifications({ onNavigateTab }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [unreadOnly]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (unreadOnly) params.unread = 'true';
      const res = await userService.getNotifications(params);
      if (res && res.notifications) {
        setNotifications(res.notifications);
      }
    } catch {
      // Mock fallback
      setNotifications([
        {
          _id: 'n1',
          title: 'Session Confirmed with Mentor',
          message: 'Dr. Anandita Sharma confirmed your Wisdom Loop session for Saturday, 10:00 AM.',
          read: false,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          module: 'wisdom-loop'
        },
        {
          _id: 'n2',
          title: 'Artisan Order Dispatched',
          message: 'Your Ikat Silk Stole order has been shipped via India Post Artisan Express.',
          read: true,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          module: 'craft-to-cart'
        },
        {
          _id: 'n3',
          title: 'New Student Request for Device',
          message: 'A polytechnic student requested your donated Lenovo ThinkPad T480.',
          read: false,
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          module: 'reconnect'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await userService.markNotificationRead('all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      alert('Failed to mark notifications read');
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await userService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      // Ignored
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <ScrollReveal direction="down">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.35rem', color: 'var(--text)' }}>
              Notifications & Alerts
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Real-time updates across all 5 MELD modules and community exchanges.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setUnreadOnly(!unreadOnly)}
              className="btn btn-outline"
              style={{
                fontSize: '0.8rem',
                padding: '0.4rem 0.8rem',
                borderColor: unreadOnly ? 'var(--primary)' : 'var(--border)',
                backgroundColor: unreadOnly ? 'var(--mint)' : 'transparent',
                color: unreadOnly ? 'var(--primary)' : 'var(--text)'
              }}
            >
              Unread only
            </button>
            <button
              onClick={handleMarkAllRead}
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div
          className="card-surface"
          style={{ textAlign: 'center', padding: '3.5rem 1.5rem', borderRadius: 'var(--radius-lg)' }}
        >
          <Bell size={40} style={{ opacity: 0.3, color: 'var(--primary)', marginBottom: '0.75rem' }} />
          <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.2rem' }}>No Notifications</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            {unreadOnly ? 'No unread notifications at this time.' : 'You have no recent notification alerts.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n, idx) => (
            <ScrollReveal key={n._id || idx} delay={idx * 50} direction="up">
              <div
                className="card-surface hover-lift-sm"
                onClick={() => !n.read && handleMarkSingleRead(n._id)}
                style={{
                  padding: '1.15rem 1.35rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: n.read ? 'var(--surface)' : 'rgba(22, 75, 59, 0.04)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  cursor: n.read ? 'default' : 'pointer'
                }}
              >
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: n.read ? 'transparent' : 'var(--primary)',
                      marginTop: '6px',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: n.read ? 600 : 750, color: 'var(--text)' }}>
                      {n.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {n.message}
                    </p>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} />
                      {new Date(n.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {n.module && onNavigateTab && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateTab(n.module);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span>View</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
