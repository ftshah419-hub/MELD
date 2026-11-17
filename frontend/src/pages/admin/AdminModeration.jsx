import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Thermometer,
  ShieldAlert,
  Camera,
  Layers
} from 'lucide-react';
import adminModerationService from '../../services/admin/adminModerationService';
import adminReportService from '../../services/admin/adminReportService';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export function AdminModeration() {
  const [queue, setQueue] = useState({ pendingMentors: [], pendingArtisans: [], draftProducts: [] });
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIncident, setActiveIncident] = useState(null);

  // Dialog State
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    item: null,
    action: 'APPROVE',
    title: ''
  });

  const loadModerationData = async () => {
    try {
      setIsLoading(true);
      const [qRes, repRes] = await Promise.all([
        adminModerationService.getPendingVerifications(),
        adminReportService.getReports({ status: 'PENDING', limit: 20 })
      ]);
      setQueue(qRes);
      setReports(repRes.reports || []);

      if (repRes.reports?.length > 0) {
        setActiveIncident({ type: 'report', data: repRes.reports[0] });
      } else if (qRes.draftProducts?.length > 0) {
        setActiveIncident({ type: 'product', data: qRes.draftProducts[0] });
      } else if (qRes.pendingMentors?.length > 0) {
        setActiveIncident({ type: 'mentor', data: qRes.pendingMentors[0] });
      }
    } catch (err) {
      console.error('Failed to load moderation queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModerationData();
  }, []);

  const handleAction = async (reason) => {
    if (!dialogState.item) return;

    if (dialogState.item.type === 'report') {
      await adminReportService.updateReportStatus(dialogState.item.data._id, {
        status: dialogState.action === 'APPROVE' ? 'RESOLVED' : 'REJECTED',
        resolutionNotes: reason || 'Moderation decision recorded'
      });
    } else if (dialogState.item.type === 'mentor') {
      await adminModerationService.reviewMentor(
        dialogState.item.data._id,
        dialogState.action === 'APPROVE' ? 'APPROVE' : 'REJECT',
        reason
      );
    } else if (dialogState.item.type === 'product') {
      await adminModerationService.reviewProduct(
        dialogState.item.data._id,
        dialogState.action === 'APPROVE' ? 'APPROVE' : 'REJECT',
        reason
      );
    }

    loadModerationData();
  };

  const allIncidents = [
    ...reports.map((r) => ({ type: 'report', id: r._id, data: r, priority: r.severity === 'CRITICAL' ? 1 : 2 })),
    ...queue.draftProducts.map((p) => ({ type: 'product', id: p._id, data: p, priority: 3 })),
    ...queue.pendingMentors.map((m) => ({ type: 'mentor', id: m._id, data: m, priority: 4 }))
  ].sort((a, b) => a.priority - b.priority);

  return (
    <div className="animate-fade-in">
      {/* Top Incident Control Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--error-surface)',
                color: 'var(--error)',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--error)' }} className="animate-pulse" />
              Real-Time Moderation Stream
            </span>
          </div>
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
            Trust & Safety Moderation Workspace
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            Triaging cross-module safety breaches, cold-chain deviations, policy complaints, and unverified merchant submissions.
          </p>
        </div>

        <button
          type="button"
          onClick={loadModerationData}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={15} />
          <span>Refresh Incidents</span>
        </button>
      </div>

      {isLoading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="lg" message="Ingesting active incidents..." />
        </div>
      ) : allIncidents.length === 0 ? (
        <div
          style={{
            padding: '4rem 2rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <CheckCircle size={44} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', margin: '0 0 0.5rem' }}>
            All Queues Clear
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            There are zero pending incidents or escalated safety flags requiring administrative review.
          </p>
        </div>
      ) : (
        /* Asymmetric Layout: Incidents Stream (7 Cols) + Inspector Tray (5 Cols) */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
          {/* Left: Incident Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Incidents Queue ({allIncidents.length})
            </span>

            {allIncidents.map((inc) => {
              const isSelected = activeIncident?.id === inc.id;
              const isCritical = inc.data.severity === 'CRITICAL';

              return (
                <div
                  key={inc.id}
                  onClick={() => setActiveIncident(inc)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.25rem',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-xs)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {/* Left Accent Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '1rem',
                      bottom: '1rem',
                      width: '4px',
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: isCritical ? 'var(--error)' : 'var(--secondary)'
                    }}
                  />

                  <div style={{ paddingLeft: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {inc.type === 'report' ? (
                          <StatusBadge status={inc.data.severity || 'HIGH'} size="sm" />
                        ) : (
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--mint)', color: 'var(--primary)' }}>
                            {inc.type.toUpperCase()} REVIEW
                          </span>
                        )}
                        <StatusBadge status={inc.data.module || 'PLATFORM'} size="sm" />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                        {new Date(inc.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.25rem 0' }}>
                      {inc.data.title || `${inc.type.toUpperCase()} Submission`}
                    </h3>

                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {inc.data.description || inc.data.bio || 'Review submission details and credentials.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Telemetry & Inspector Tray */}
          {activeIncident && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
                position: 'sticky',
                top: '90px'
              }}
              className="animate-slide-up"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)' }}>
                  Incident Telemetry & Inspector
                </span>
                <StatusBadge status={activeIncident.data.status || 'PENDING'} />
              </div>

              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', margin: '0 0 0.75rem 0' }}>
                {activeIncident.data.title || `${activeIncident.type.toUpperCase()} Incident Context`}
              </h2>

              <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {activeIncident.data.description || activeIncident.data.bio}
              </p>

              {/* Context Details Box */}
              <div
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: '0.8rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Target Entity Type: </span>
                  <strong>{activeIncident.data.targetType || activeIncident.type}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Submitted / Reported: </span>
                  <strong>{new Date(activeIncident.data.createdAt).toLocaleString()}</strong>
                </div>
                {activeIncident.data.reporterId && (
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Reported By: </span>
                    <strong>{activeIncident.data.reporterId?.fullName || activeIncident.data.reporterId}</strong>
                  </div>
                )}
                {activeIncident.data.reportedUserId && (
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Reported User: </span>
                    <strong style={{ color: 'var(--error)' }}>
                      {activeIncident.data.reportedUserId?.fullName || activeIncident.data.reportedUserId}
                    </strong>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() =>
                    setDialogState({
                      isOpen: true,
                      item: activeIncident,
                      action: 'APPROVE',
                      title: `Approve / Resolve: ${activeIncident.data.title || activeIncident.type}`
                    })
                  }
                  style={{
                    flex: 1,
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <CheckCircle size={16} />
                  <span>Approve / Resolve</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDialogState({
                      isOpen: true,
                      item: activeIncident,
                      action: 'REJECT',
                      title: `Reject / Take Action: ${activeIncident.data.title || activeIncident.type}`
                    })
                  }
                  style={{
                    flex: 1,
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--error-surface)',
                    color: 'var(--error)',
                    border: '1px solid rgba(186, 26, 26, 0.3)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <XCircle size={16} />
                  <span>Reject / Sanction</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Moderation Decision Confirmation */}
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, item: null, action: 'APPROVE', title: '' })}
        onConfirm={handleAction}
        title={dialogState.title}
        message="Recording this moderation decision will execute the lifecycle change and log a permanent administrative audit entry."
        confirmText="Confirm Decision"
        variant={dialogState.action === 'REJECT' ? 'danger' : 'primary'}
        requireReason={dialogState.action === 'REJECT'}
        reasonPlaceholder="Specify resolution notes or rejection rationale..."
      />
    </div>
  );
}

export default AdminModeration;
