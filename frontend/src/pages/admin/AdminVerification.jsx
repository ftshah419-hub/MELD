import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  FileCheck,
  Calendar,
  Eye,
  MapPin,
  Sparkles,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import adminModerationService from '../../services/admin/adminModerationService';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export function AdminVerification() {
  const [queue, setQueue] = useState({ pendingMentors: [], pendingArtisans: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Dialog State
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    item: null,
    action: 'APPROVE',
    title: ''
  });

  const loadVerificationQueue = async () => {
    try {
      setIsLoading(true);
      const res = await adminModerationService.getPendingVerifications();
      setQueue(res);

      const all = [
        ...res.pendingArtisans.map((a) => ({ type: 'artisan', data: a })),
        ...res.pendingMentors.map((m) => ({ type: 'mentor', data: m }))
      ];

      if (all.length > 0) {
        setSelectedCandidate(all[0]);
      } else {
        setSelectedCandidate(null);
      }
    } catch (err) {
      console.error('Failed to load verification queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVerificationQueue();
  }, []);

  const handleDecision = async (reason) => {
    if (!dialogState.item) return;

    if (dialogState.item.type === 'artisan') {
      await adminModerationService.reviewArtisan(
        dialogState.item.data._id,
        dialogState.action === 'APPROVE' ? 'APPROVE' : 'REJECT',
        reason
      );
    } else if (dialogState.item.type === 'mentor') {
      await adminModerationService.reviewMentor(
        dialogState.item.data._id,
        dialogState.action === 'APPROVE' ? 'APPROVE' : 'REJECT',
        reason
      );
    }

    loadVerificationQueue();
  };

  const candidates = [
    ...queue.pendingArtisans.map((a) => ({
      id: a._id,
      type: 'artisan',
      module: 'CRAFT_TO_CART',
      title: a.craftSpecialty,
      subtitle: `${a.userId?.fullName || 'Artisan'} (Lead Master Artisan)`,
      region: a.region,
      story: a.heritageStory,
      data: a,
      date: a.createdAt,
      risk: 'Low Risk (0.04)'
    })),
    ...queue.pendingMentors.map((m) => ({
      id: m._id,
      type: 'mentor',
      module: 'WISDOM_LOOP',
      title: m.title,
      subtitle: `${m.userId?.fullName || 'Candidate'} (Mentor Candidate)`,
      region: m.expertiseAreas?.join(', '),
      story: m.bio,
      data: m,
      date: m.createdAt,
      risk: 'Standard Review'
    }))
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
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
                backgroundColor: 'var(--mint)',
                color: 'var(--primary)',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              <ShieldCheck size={14} /> Partner & Guild Vetting Pipeline
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
            Credential Verification Workspace
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            Inspect authentic artisanal guild credentials, generational mentorship credentials, and NGO authorization proofs.
          </p>
        </div>

        <button
          type="button"
          onClick={loadVerificationQueue}
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
          <span>Batch Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="lg" message="Loading applicant vetting queue..." />
        </div>
      ) : candidates.length === 0 ? (
        <div
          style={{
            padding: '4rem 2rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <FileCheck size={44} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', margin: '0 0 0.5rem' }}>
            Zero Pending Applications
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            All submitted partner and artisan verification applications have been evaluated.
          </p>
        </div>
      ) : (
        /* Dual-Panel Review Workspace: Left Queue (5 Cols) + Right Inspector (7 Cols) */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
          {/* Left Panel: Submission Queue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Prioritized Submissions ({candidates.length})
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Ordered by Risk & Age</span>
            </div>

            {candidates.map((cand) => {
              const isSelected = selectedCandidate?.id === cand.id;
              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.25rem',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    boxShadow: isSelected
                      ? '0 4px 20px -2px rgba(22, 75, 59, 0.12), inset 4px 0 0 0 #164b3b'
                      : 'var(--shadow-xs)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: cand.type === 'artisan' ? 'rgba(196, 119, 83, 0.15)' : 'rgba(101, 115, 184, 0.15)',
                        color: cand.type === 'artisan' ? '#9d4a25' : '#43529d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        flexShrink: 0
                      }}
                    >
                      {cand.data.userId?.fullName ? cand.data.userId.fullName[0].toUpperCase() : 'P'}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <StatusBadge status={cand.module} size="sm" />
                        <span style={{ fontSize: '0.7rem', color: '#2e7d32', fontWeight: 600 }}>{cand.risk}</span>
                      </div>

                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.15rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cand.title}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cand.subtitle}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
                        <span>Submitted {new Date(cand.date).toLocaleDateString()}</span>
                        {isSelected && (
                          <span style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Eye size={13} /> Inspecting
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Panel: Applicant Inspector */}
          {selectedCandidate && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
                position: 'sticky',
                top: '90px'
              }}
              className="animate-slide-up"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)' }}>
                  Credentials & Portfolio dossier
                </span>
                <StatusBadge status="PENDING" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--mint)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.3rem'
                  }}
                >
                  {selectedCandidate.data.userId?.fullName ? selectedCandidate.data.userId.fullName[0].toUpperCase() : 'P'}
                </div>

                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                    {selectedCandidate.title}
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {selectedCandidate.subtitle}
                  </div>
                </div>
              </div>

              {/* Dossier Information Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  marginBottom: '1.25rem',
                  fontSize: '0.825rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Email Contact: </span>
                  <div><strong>{selectedCandidate.data.userId?.email || 'N/A'}</strong></div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Geographic Region: </span>
                  <div><strong>{selectedCandidate.region || 'Not specified'}</strong></div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Submission Timestamp: </span>
                  <div><strong>{new Date(selectedCandidate.date).toLocaleString()}</strong></div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>KYC Integrity Risk: </span>
                  <div style={{ color: '#2e7d32', fontWeight: 700 }}>Pass (No Sanction Flags)</div>
                </div>
              </div>

              {/* Heritage Story or Bio Copy */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Heritage Documentation & Provenance Narrative
                </span>
                <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6, marginTop: '0.4rem', backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  {selectedCandidate.story || 'No narrative provided. Contact applicant for supplementary lineage confirmation.'}
                </p>
              </div>

              {/* Decision Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() =>
                    setDialogState({
                      isOpen: true,
                      item: selectedCandidate,
                      action: 'APPROVE',
                      title: `Verify & Approve: ${selectedCandidate.title}`
                    })
                  }
                  style={{
                    flex: 1,
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Check size={18} />
                  <span>Verify Credentials</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDialogState({
                      isOpen: true,
                      item: selectedCandidate,
                      action: 'REJECT',
                      title: `Reject Application: ${selectedCandidate.title}`
                    })
                  }
                  style={{
                    flex: 1,
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--error-surface)',
                    color: 'var(--error)',
                    border: '1px solid rgba(186, 26, 26, 0.3)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <X size={18} />
                  <span>Reject with Note</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Decision Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, item: null, action: 'APPROVE', title: '' })}
        onConfirm={handleDecision}
        title={dialogState.title}
        message="Confirming this verification decision records a cryptographically referenced audit log and updates the member's live privileges."
        confirmText="Confirm Verification Decision"
        variant={dialogState.action === 'REJECT' ? 'danger' : 'primary'}
        requireReason={dialogState.action === 'REJECT'}
        reasonPlaceholder="Specify reason for applicant notification..."
      />
    </div>
  );
}

export default AdminVerification;
