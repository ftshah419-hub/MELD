import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from '../common/Button';

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you wish to proceed with this administrative action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary', // 'primary' | 'danger'
  requireReason = false,
  reasonPlaceholder = 'Please specify the administrative justification...'
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requireReason && (!reason || reason.trim().length < 5)) {
      setError('A justification reason of at least 5 characters is mandatory.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onConfirm(reason.trim());
      setReason('');
      onClose();
    } catch (err) {
      setError(err?.message || 'Action failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDanger = variant === 'danger';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(18, 30, 24, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
          position: 'relative'
        }}
        className="animate-slide-up"
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isDanger ? 'var(--error-surface)' : 'var(--mint)',
              color: isDanger ? 'var(--error)' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: isDanger ? 'var(--error)' : 'var(--text)',
              margin: 0
            }}
          >
            {title}
          </h3>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          {message}
        </p>

        <form onSubmit={handleSubmit}>
          {requireReason && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: '0.4rem'
                }}
              >
                Administrative Reason & Rationale <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder={reasonPlaceholder}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--text)',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '0.6rem 0.8rem',
                backgroundColor: 'var(--error-surface)',
                color: 'var(--error)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                marginBottom: '1.25rem'
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {cancelText}
            </Button>
            <Button
              type="submit"
              variant={isDanger ? 'primary' : 'primary'}
              size="sm"
              isLoading={isSubmitting}
              style={
                isDanger
                  ? { backgroundColor: 'var(--error)', borderColor: 'var(--error)' }
                  : {}
              }
            >
              {confirmText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmationDialog;
