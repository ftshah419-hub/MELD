import React from 'react';
import {
  Inbox,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Calendar,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export function UserActivity({
  recentRequests = [],
  recentOrders = [],
  upcomingSessions = [],
  onNavigateTab
}) {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
      case 'paid':
        return <span className="badge badge-mint">{status}</span>;
      case 'pending':
      case 'submitted':
        return <span className="badge badge-gold">{status}</span>;
      case 'accepted':
      case 'processing':
      case 'shipped':
        return <span className="badge" style={{ backgroundColor: 'rgba(101, 115, 184, 0.15)', color: '#6573B8' }}>{status}</span>;
      case 'cancelled':
      case 'rejected':
        return <span className="badge" style={{ backgroundColor: 'rgba(186, 26, 26, 0.12)', color: 'var(--error)' }}>{status}</span>;
      default:
        return <span className="badge badge-surface">{status || 'Active'}</span>;
    }
  };

  const getModuleBadge = (moduleName) => {
    const map = {
      'wisdom-loop': { label: 'Wisdom Loop', color: '#6573B8' },
      'craft-to-cart': { label: 'Craft to Cart', color: '#C47753' },
      'reconnect': { label: 'ReConnect', color: '#368F88' },
      'book-bridge': { label: 'Book Bridge', color: '#D3A34F' },
      'second-serve': { label: 'Second Serve', color: '#70975D' }
    };
    const mod = map[moduleName] || { label: moduleName || 'General', color: 'var(--primary)' };
    return (
      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '0.15rem 0.5rem',
          borderRadius: '999px',
          backgroundColor: `${mod.color}15`,
          color: mod.color
        }}
      >
        {mod.label}
      </span>
    );
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}
    >
      {/* Recent Requests Card */}
      <ScrollReveal direction="up" delay={100}>
        <div
          className="card-surface"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            height: '100%'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Inbox size={18} color="var(--primary)" />
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  margin: 0
                }}
              >
                Recent Requests
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('requests')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <span>View all</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {recentRequests.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--surface-alt)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Inbox size={28} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <p style={{ margin: 0, fontSize: '0.85rem' }}>No requests submitted yet.</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                Explore any of the 5 modules to place a request.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentRequests.map((req) => (
                <div
                  key={req._id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      {getModuleBadge(req.module)}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Clock size={11} />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {req.targetItem?.title || req.targetItem?.model || req.notes || 'Module Request'}
                    </div>
                  </div>
                  <div>{getStatusBadge(req.status)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Upcoming Mentorship Sessions & Recent Orders */}
      <ScrollReveal direction="up" delay={200}>
        <div
          className="card-surface"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            height: '100%'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#6573B8" />
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  margin: 0
                }}
              >
                Upcoming Mentorship Sessions
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('wisdom-loop')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6573B8',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <span>Explore mentors</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {upcomingSessions.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--surface-alt)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Calendar size={28} style={{ opacity: 0.3, marginBottom: '0.5rem', color: '#6573B8' }} />
              <p style={{ margin: 0, fontSize: '0.85rem' }}>No upcoming sessions booked.</p>
              <button
                onClick={() => onNavigateTab && onNavigateTab('wisdom-loop')}
                className="btn btn-outline"
                style={{
                  marginTop: '0.75rem',
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.85rem',
                  borderColor: '#6573B8',
                  color: '#6573B8'
                }}
              >
                Find a Mentor
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingSessions.map((sess) => (
                <div
                  key={sess._id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(101, 115, 184, 0.06)',
                    border: '1px solid rgba(101, 115, 184, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                      {sess.mentorId?.name || 'Senior Mentor'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Topic: {sess.topic || 'Career & Craft'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6573B8', fontWeight: 600, marginTop: '0.2rem' }}>
                      {new Date(sess.preferredDate).toLocaleDateString()} at {sess.preferredTime}
                    </div>
                  </div>
                  <div>
                    {sess.meetingLink ? (
                      <a
                        href={sess.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.35rem 0.75rem',
                          backgroundColor: '#6573B8',
                          borderColor: '#6573B8',
                          textDecoration: 'none'
                        }}
                      >
                        Join Call
                      </a>
                    ) : (
                      getStatusBadge(sess.status)
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}

export default UserActivity;
