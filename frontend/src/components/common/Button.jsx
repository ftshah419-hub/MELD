import React from 'react';

/**
 * MELD Shared Button Component
 * Supports variants, sizes, icon integration, and loading states
 */
export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  type = 'button',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all var(--transition-normal)',
    textDecoration: 'none',
    position: 'relative',
    userSelect: 'none',
    width: fullWidth ? '100%' : 'auto',
    letterSpacing: '0.01em'
  };

  const sizeStyles = {
    sm: { padding: '0.45rem 0.9rem', fontSize: '0.85rem' },
    md: { padding: '0.75rem 1.4rem', fontSize: '0.95rem' },
    lg: { padding: '0.95rem 1.85rem', fontSize: '1.05rem' }
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: '#FFFFFF',
      boxShadow: 'var(--shadow-sm)'
    },
    secondary: {
      backgroundColor: 'var(--mint)',
      color: 'var(--primary)',
      boxShadow: 'none'
    },
    accent: {
      backgroundColor: 'var(--accent)',
      color: 'var(--text)',
      boxShadow: 'var(--shadow-sm)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--primary)',
      boxShadow: 'none'
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary)',
      border: '1.5px solid var(--secondary)',
      boxShadow: 'none'
    },
    danger: {
      backgroundColor: 'var(--error)',
      color: '#FFFFFF',
      boxShadow: 'var(--shadow-sm)'
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const currentVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`meld-btn meld-btn-${variant} ${className}`}
      style={{
        ...baseStyles,
        ...currentSize,
        ...currentVariant
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTopColor: variant === 'secondary' || variant === 'ghost' ? 'var(--primary)' : '#FFFFFF',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {iconLeft && <span style={{ display: 'inline-flex' }}>{iconLeft}</span>}
          <span>{children}</span>
          {iconRight && <span style={{ display: 'inline-flex' }}>{iconRight}</span>}
        </>
      )}
    </button>
  );
}

export default Button;
