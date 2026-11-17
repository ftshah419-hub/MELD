import React from 'react';

/**
 * Universal MELD Status Badge Component
 * Formatted with exact MELD Design System colors & tokens
 */
export function StatusBadge({ status, type = 'status', size = 'md' }) {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  // Color & background mappings
  let bg = 'rgba(167, 191, 165, 0.2)';
  let color = 'var(--text)';
  let border = 'transparent';
  let dotColor = null;

  switch (normalized) {
    // Positive / Success / Active
    case 'ACTIVE':
    case 'APPROVED':
    case 'VERIFIED':
    case 'SUCCESS':
    case 'COMPLETED':
    case 'RESOLVED':
    case 'AVAILABLE':
    case 'CIRCULATING':
    case 'DELIVERED':
      bg = 'rgba(32, 109, 57, 0.12)';
      color = '#1b5e20';
      border = 'rgba(32, 109, 57, 0.25)';
      dotColor = '#2e7d32';
      break;

    // Warning / Pending / Under Review
    case 'PENDING':
    case 'UNDER_REVIEW':
    case 'UNDER_REPAIR':
    case 'PLACED':
    case 'PROCESSING':
    case 'MEDIUM':
      bg = 'rgba(215, 169, 74, 0.15)';
      color = '#8d6308';
      border = 'rgba(215, 169, 74, 0.35)';
      dotColor = '#c5983b';
      break;

    // Negative / Suspended / Rejected / Critical / Failed
    case 'SUSPENDED':
    case 'REJECTED':
    case 'FAILED':
    case 'CANCELLED':
    case 'EXPIRED':
    case 'HIGH':
    case 'CRITICAL':
      bg = 'rgba(186, 26, 26, 0.12)';
      color = '#ba1a1a';
      border = 'rgba(186, 26, 26, 0.25)';
      dotColor = '#ba1a1a';
      break;

    // Inactive / Draft / Out of Stock
    case 'INACTIVE':
    case 'DRAFT':
    case 'OUT_OF_STOCK':
    case 'ARCHIVED':
    case 'LOW':
      bg = 'rgba(90, 106, 97, 0.12)';
      color = '#5a6a61';
      border = 'rgba(90, 106, 97, 0.2)';
      dotColor = '#798a80';
      break;

    // Modules
    case 'WISDOM_LOOP':
    case 'WISDOM LOOP':
      bg = 'rgba(101, 115, 184, 0.15)';
      color = '#43529d';
      border = 'rgba(101, 115, 184, 0.3)';
      break;

    case 'CRAFT_TO_CART':
    case 'CRAFT TO CART':
      bg = 'rgba(196, 119, 83, 0.15)';
      color = '#9d4a25';
      border = 'rgba(196, 119, 83, 0.3)';
      break;

    case 'RECONNECT':
      bg = 'rgba(54, 143, 136, 0.15)';
      color = '#206862';
      border = 'rgba(54, 143, 136, 0.3)';
      break;

    case 'BOOK_BRIDGE':
    case 'BOOK BRIDGE':
      bg = 'rgba(211, 163, 79, 0.15)';
      color = '#8f681a';
      border = 'rgba(211, 163, 79, 0.3)';
      break;

    case 'SECOND_SERVE':
    case 'SECOND SERVE':
      bg = 'rgba(112, 151, 93, 0.15)';
      color = '#456a34';
      border = 'rgba(112, 151, 93, 0.3)';
      break;

    case 'ADMIN':
      bg = 'rgba(215, 169, 74, 0.2)';
      color = '#8d6308';
      border = 'rgba(215, 169, 74, 0.4)';
      dotColor = '#8d6308';
      break;

    default:
      bg = 'rgba(40, 53, 46, 0.08)';
      color = 'var(--text)';
  }

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: isSmall ? '0.15rem 0.5rem' : '0.25rem 0.65rem',
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        borderRadius: 'var(--radius-full)',
        fontSize: isSmall ? '0.7rem' : '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
        lineHeight: 1.2
      }}
    >
      {dotColor && (
        <span
          style={{
            width: isSmall ? '5px' : '6px',
            height: isSmall ? '5px' : '6px',
            borderRadius: '50%',
            backgroundColor: dotColor,
            flexShrink: 0
          }}
        />
      )}
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default StatusBadge;
