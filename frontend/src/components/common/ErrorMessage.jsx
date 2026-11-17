import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';

/**
 * MELD Accessible Error Message Box
 */
export function ErrorMessage({
  message,
  onRetry = null,
  onDismiss = null,
  className = ''
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`animate-slide-up ${className}`}
      style={{
        backgroundColor: 'var(--error-surface)',
        border: '1px solid rgba(186, 26, 26, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '0.9rem 1.25rem',
        color: 'var(--error-text)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '1rem',
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
        <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--error)' }} />
        <div style={{ fontSize: '0.875rem', lineHeight: 1.5, fontWeight: 500 }}>
          {message}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--error)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <RotateCcw size={14} />
            <span>Retry</span>
          </button>
        )}

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss message"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--error-text)',
              cursor: 'pointer',
              padding: '0.2rem',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
