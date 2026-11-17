import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * MELD Module Card Component
 * Highlights the 5 core community initiatives
 */
export function ModuleCard({
  id,
  title,
  tagline,
  description,
  accentColor,
  iconName,
  stat,
  link = '/explore',
  className = ''
}) {
  return (
    <div
      className={`meld-module-card ${className}`}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.borderColor = accentColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      {/* Top Accent Gradient Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: accentColor
        }}
      />

      <div>
        {/* Header: Icon & Micro Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: `${accentColor}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor
            }}
          >
            <span className="material-symbols-outlined fill" style={{ fontSize: '28px' }}>
              {iconName}
            </span>
          </div>

          {stat && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: `${accentColor}15`,
                color: accentColor,
                border: `1px solid ${accentColor}30`
              }}
            >
              {stat}
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '0.35rem'
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: accentColor,
            marginBottom: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.03em'
          }}
        >
          {tagline}
        </p>

        {/* Description */}
        <p
          style={{
            fontSize: '0.925rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '1.75rem'
          }}
        >
          {description}
        </p>
      </div>

      {/* Action Footer */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Link
          to={link}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--primary)',
            transition: 'gap var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = accentColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--primary)';
          }}
        >
          <span>Learn More</span>
          <ArrowRight size={16} />
        </Link>

        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-subtle)',
            fontWeight: 500
          }}
        >
          MELD Initiative
        </span>
      </div>
    </div>
  );
}

export default ModuleCard;
