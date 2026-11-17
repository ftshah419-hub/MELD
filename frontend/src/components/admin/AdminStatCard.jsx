import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function AdminStatCard({
  title,
  value,
  unit,
  icon,
  iconBg = 'var(--mint)',
  iconColor = 'var(--primary)',
  accentColor = 'var(--primary)',
  trend = null,
  trendLabel = 'vs last period',
  subText = null,
  sparkline = null,
  onClick = null
}) {
  const isPositive = trend && !trend.startsWith('-');

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
        cursor: onClick ? 'pointer' : 'default'
      }}
      className="admin-stat-card hover:shadow-md"
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--text-muted)'
              }}
            >
              {title}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.25rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1
                }}
              >
                {value}
              </span>
              {unit && (
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {unit}
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: iconBg,
              color: iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            {icon}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {trend && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.775rem',
                fontWeight: 700,
                color: isPositive ? '#2e7d32' : '#ba1a1a'
              }}
            >
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{trend}</span>
              {trendLabel && (
                <span style={{ color: 'var(--text-subtle)', fontWeight: 400, marginLeft: '0.2rem' }}>
                  {trendLabel}
                </span>
              )}
            </div>
          )}

          {subText && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {subText}
            </span>
          )}
        </div>

        {sparkline && (
          <div style={{ width: '70px', height: '28px', opacity: 0.85 }}>
            {sparkline}
          </div>
        )}
      </div>

      {/* Bottom Accent Line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: accentColor
        }}
      />
    </div>
  );
}

export default AdminStatCard;
