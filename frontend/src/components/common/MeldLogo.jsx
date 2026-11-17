import React from 'react';

/**
 * Official MELD Brand Logo Component
 * Derived directly from MELD brand guidelines & vector mark
 */
export function MeldLogo({
  size = 'md',
  showText = true,
  variant = 'dark', // 'dark' | 'light'
  className = '',
  withTagline = false
}) {
  const sizeMap = {
    xs: { mark: 24, font: '1rem', gap: '0.4rem' },
    sm: { mark: 32, font: '1.25rem', gap: '0.6rem' },
    md: { mark: 40, font: '1.5rem', gap: '0.75rem' },
    lg: { mark: 52, font: '1.85rem', gap: '0.9rem' },
    xl: { mark: 68, font: '2.4rem', gap: '1.1rem' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const textColor = variant === 'light' ? '#FFFFFF' : '#164B3B';
  const taglineColor = variant === 'light' ? 'rgba(255, 255, 255, 0.75)' : '#5A6A61';

  return (
    <div
      className={`meld-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: currentSize.gap,
        textDecoration: 'none',
        userSelect: 'none'
      }}
    >
      {/* Crisp Vector Geometry for the 3 Squircles + Overlapping Center Circle */}
      <svg
        width={currentSize.mark}
        height={currentSize.mark}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-label="MELD Emblem"
      >
        {/* Top-Left Squircle: Deep Forest Green */}
        <rect
          x="6"
          y="6"
          width="42"
          height="42"
          rx="12"
          fill="#164B3B"
        />

        {/* Top-Right Squircle: Sage Green */}
        <rect
          x="52"
          y="6"
          width="42"
          height="42"
          rx="12"
          fill="#A7BFA5"
        />

        {/* Bottom Squircle: Amber / Warm Gold */}
        <rect
          x="29"
          y="50"
          width="42"
          height="42"
          rx="12"
          fill="#D7A94A"
        />

        {/* Overlapping Central White Orb */}
        <circle
          cx="50"
          cy="48"
          r="13"
          fill="#FFFFFF"
        />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: currentSize.font,
              fontWeight: 800,
              letterSpacing: '0.08em',
              lineHeight: 1,
              color: textColor
            }}
          >
            MELD
          </span>
          {withTagline && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                letterSpacing: '0.02em',
                color: taglineColor,
                marginTop: '0.2rem',
                fontWeight: 500
              }}
            >
              Bridge Two Worlds
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default MeldLogo;
