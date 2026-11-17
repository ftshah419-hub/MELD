import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Trash2
} from 'lucide-react';
import userService from '../../services/user/userService';
import ScrollReveal from '../../components/user/ScrollReveal';

const MODULES = ['all', 'wisdom-loop', 'reconnect', 'book-bridge', 'second-serve'];
const STATUSES = ['all', 'pending', 'accepted', 'completed', 'cancelled'];

export function MyRequests({ onNavigateModule }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [selectedModule, selectedStatus]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedModule !== 'all') params.module = selectedModule;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      const res = await userService.getMyRequests(params);
      if (res && res.requests) {
        setRequests(res.requests);
      }
    } catch {
      // Mock fallback
      setRequests([
        {
          _id: 'r1',
          module: 'wisdom-loop',
          targetItem: { title: '1:1 Mentorship in Traditional Weaving' },
          status: 'accepted',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          notes: 'Discussing natural dyes and loom setup.'
        },
        {
          _id: 'r2',
          module: 'reconnect',
          targetItem: { title: 'Lenovo ThinkPad T480 Laptop' },
          status: 'pending',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          notes: 'Required for BCA coding curriculum.'
        },
        {
          _id: 'r3',
          module: 'book-bridge',
          targetItem: { title: 'NCERT Class 11 & 12 Physics Set' },
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          notes: 'Picked up from Jayanagar Drop-box.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      await userService.cancelRequest(requestId);
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Failed to cancel request');
    }
  };

  const getModuleStyle = (mod) => {
    switch (mod) {
      case 'wisdom-loop':
        return { label: 'Wisdom Loop', color: '#6573B8' };
      case 'reconnect':
        return { label: 'ReConnect', color: '#368F88' };
      case 'book-bridge':
        return { label: 'Book Bridge', color: '#D3A34F' };
      case 'second-serve':
        return { label: 'Second Serve', color: '#70975D' };
      default:
        return { label: mod || 'Impact', color: 'var(--primary)' };
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <span className="badge badge-mint">Completed</span>;
      case 'accepted':
      case 'approved':
        return <span className="badge" style={{ backgroundColor: 'rgba(101, 115, 184, 0.15)', color: '#6573B8' }}>Accepted</span>;
      case 'pending':
        return <span className="badge badge-gold">Pending Approval</span>;
      case 'cancelled':
        return <span className="badge" style={{ backgroundColor: 'rgba(186, 26, 26, 0.12)', color: 'var(--error)' }}>Cancelled</span>;
      default:
        return <span className="badge badge-surface">{status}</span>;
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <ScrollReveal direction="down">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.35rem', color: 'var(--text)' }}>
            My Requests & Applications
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Track your open applications, mentorship inquiries, device allocations, and book loans in one central record.
          </p>
        </div>
      </ScrollReveal>

      {/* Filter Bars */}
      <div
        className="card-surface"
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
          {MODULES.map((m) => {
            const isActive = selectedModule === m;
            return (
              <button
                key={m}
                onClick={() => setSelectedModule(m)}
                style={{
                  border: '1px solid',
                  borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: isActive ? 'var(--mint)' : 'var(--surface)',
                  color: isActive ? 'var(--primary)' : 'var(--text)',
                  borderRadius: '999px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {m === 'all' ? 'All Streams' : m.replace('-', ' ')}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {STATUSES.map((s) => {
            const isActive = selectedStatus === s;
            return (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: '0.2rem 0.5rem',
                  textTransform: 'capitalize'
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div
          className="card-surface"
          style={{ textAlign: 'center', padding: '3.5rem 1.5rem', borderRadius: 'var(--radius-lg)' }}
        >
          <Inbox size={42} style={{ opacity: 0.35, color: 'var(--primary)', marginBottom: '0.75rem' }} />
          <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.2rem' }}>No Requests Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            {selectedModule !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your filters above.'
              : 'You have not submitted any module requests yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map((req, idx) => {
            const modInfo = getModuleStyle(req.module);
            return (
              <ScrollReveal key={req._id || idx} delay={idx * 60} direction="up">
                <div
                  className="card-surface hover-lift"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.55rem',
                          borderRadius: '999px',
                          backgroundColor: `${modInfo.color}15`,
                          color: modInfo.color
                        }}
                      >
                        {modInfo.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
                      {req.targetItem?.title || req.targetItem?.name || req.topic || 'Item Request'}
                    </h3>

                    {req.notes && (
                      <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        Notes: {req.notes}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    {getStatusBadge(req.status)}

                    {req.status === 'pending' && (
                      <button
                        onClick={() => handleCancelRequest(req._id)}
                        className="btn btn-outline"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.35rem 0.65rem',
                          color: 'var(--error)',
                          borderColor: 'rgba(186, 26, 26, 0.25)'
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyRequests;
