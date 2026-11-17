import React from 'react';
import MeldLogo from './MeldLogo';

/**
 * MELD Branded Loading Spinner
 */
export function LoadingSpinner({
  size = 'md', // 'sm' | 'md' | 'lg' | 'fullscreen'
  message = 'Loading...',
  showLogo = false
}) {
  if (size === 'fullscreen') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--background)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          zIndex: 9999
        }}
        className="animate-fade-in"
      >
        <MeldLogo size="lg" withTagline={false} />
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(22, 75, 59, 0.15)',
            borderTopColor: 'var(--primary)',
            borderRightColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.9s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite'
          }}
        />
        {message && (
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              letterSpacing: '0.02em'
            }}
          >
            {message}
          </p>
        )}
      </div>
    );
  }

  const spinnerDimensions = {
    sm: 20,
    md: 32,
    lg: 48
  }[size] || 32;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '1rem'
      }}
      role="status"
      aria-live="polite"
    >
      {showLogo && <MeldLogo size="sm" showText={false} />}
      <div
        style={{
          width: `${spinnerDimensions}px`,
          height: `${spinnerDimensions}px`,
          border: '3px solid rgba(22, 75, 59, 0.15)',
          borderTopColor: 'var(--primary)',
          borderRightColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      {message && (
        <span
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            fontWeight: 500
          }}
        >
          {message}
        </span>
      )}
    </div>
  );
}

export default LoadingSpinner;
