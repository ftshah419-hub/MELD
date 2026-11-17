import React, { useState, useEffect } from 'react';
import { Bell, Megaphone, Send, CheckCircle2, Clock, AlertTriangle, Shield } from 'lucide-react';
import adminService from '../../services/admin/adminService';
import StatusBadge from '../../components/admin/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Broadcast Form
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    targetRole: 'ALL'
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState(null);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getNotifications({ limit: 50 });
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await adminService.markNotificationRead(id);
      loadNotifications();
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;

    try {
      setIsBroadcasting(true);
      setBroadcastFeedback(null);
      const res = await adminService.broadcastAnnouncement(broadcastForm);
      setBroadcastFeedback({
        type: 'success',
        text: `Platform broadcast dispatched successfully to ${res.recipientsCount} community members.`
      });
      setBroadcastForm({ title: '', message: '', targetRole: 'ALL' });
    } catch (err) {
      setBroadcastFeedback({
        type: 'error',
        text: err?.message || 'Failed to broadcast announcement.'
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--primary)',
            letterSpacing: '-0.02em',
            margin: '0 0 0.25rem 0'
          }}
        >
          Administrative Alerts & Announcements
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Manage real-time system alerts, critical threshold notifications, and broadcast community-wide announcements.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Left: Broadcast Announcement Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--mint)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Megaphone size={20} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Broadcast Announcement
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Publish system notices to registered community members
              </span>
            </div>
          </div>

          <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Announcement Headline *
              </label>
              <input
                type="text"
                value={broadcastForm.title}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                placeholder="e.g. Scheduled Network Maintenance or Holiday Protocol"
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Target Member Segment
              </label>
              <select
                value={broadcastForm.targetRole}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, targetRole: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="ALL">All Network Members (Users & Admins)</option>
                <option value="USER">Community Members Only</option>
                <option value="ADMIN">Administrative Staff Only</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Notice Body Copy *
              </label>
              <textarea
                value={broadcastForm.message}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                placeholder="Enter detailed notice or operational instructions..."
                rows={4}
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {broadcastFeedback && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: broadcastFeedback.type === 'success' ? 'var(--mint)' : 'var(--error-surface)',
                  color: broadcastFeedback.type === 'success' ? 'var(--primary)' : 'var(--error)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {broadcastFeedback.text}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              iconLeft={<Send size={16} />}
              isLoading={isBroadcasting}
              style={{ marginTop: '0.5rem' }}
            >
              Broadcast Bulletin
            </Button>
          </form>
        </div>

        {/* Right: Administrative Alert Stream */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Alert Stream
              </h2>
            </div>
            {unreadCount > 0 && (
              <span
                style={{
                  fontSize: '0.725rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--error-surface)',
                  color: 'var(--error)',
                  fontWeight: 700
                }}
              >
                {unreadCount} Unread
              </span>
            )}
          </div>

          {isLoading ? (
            <div style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner size="md" message="Loading notification stream..." />
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No administrative alerts logged.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '480px', overflowY: 'auto' }}>
              {notifications.map((n) => (
                <div
                  key={n._id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: n.isRead ? 'var(--surface-alt)' : 'rgba(215, 169, 74, 0.08)',
                    borderLeft: n.isRead ? '3px solid transparent' : '3px solid var(--accent)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                        {n.title}
                      </span>
                      <StatusBadge status={n.type} size="sm" />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.35rem', display: 'inline-block' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminNotifications;
