import React from 'react';
import {
  Inbox,
  Activity,
  CheckCircle2,
  ShoppingBag,
  HeartHandshake,
  Calendar,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export function UserStats({ summary = {}, onNavigateTab }) {
  const stats = [
    {
      label: 'Total Requests',
      value: summary.totalRequests ?? 0,
      icon: Inbox,
      color: '#164B3B',
      bgColor: 'rgba(22, 75, 59, 0.08)',
      actionTab: 'requests',
      hint: 'Across all 5 modules'
    },
    {
      label: 'Active Requests',
      value: summary.activeRequests ?? 0,
      icon: Activity,
      color: '#368F88',
      bgColor: 'rgba(54, 143, 136, 0.1)',
      actionTab: 'requests',
      hint: 'Awaiting match or in-transit'
    },
    {
      label: 'Completed Impact',
      value: summary.completedRequests ?? 0,
      icon: CheckCircle2,
      color: '#70975D',
      bgColor: 'rgba(112, 151, 93, 0.12)',
      hint: 'Delivered, completed & rated'
    },
    {
      label: 'Craft Orders',
      value: summary.ordersCount ?? 0,
      icon: ShoppingBag,
      color: '#C47753',
      bgColor: 'rgba(196, 119, 83, 0.1)',
      actionTab: 'orders',
      hint: 'Direct artisan orders'
    },
    {
      label: 'Contributions',
      value: `₹${(summary.totalContributions ?? 0).toLocaleString('en-IN')}`,
      icon: HeartHandshake,
      color: '#D7A94A',
      bgColor: 'rgba(215, 169, 74, 0.12)',
      actionTab: 'contributions',
      hint: 'Voluntary cause funding'
    },
    {
      label: 'Upcoming Sessions',
      value: summary.upcomingSessionsCount ?? 0,
      icon: Calendar,
      color: '#6573B8',
      bgColor: 'rgba(101, 115, 184, 0.1)',
      actionTab: 'wisdom-loop',
      hint: '1:1 Wisdom mentorship'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}
    >
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <ScrollReveal key={stat.label} delay={idx * 60} direction="up">
            <div
              className="card-surface hover-lift"
              onClick={() => stat.actionTab && onNavigateTab && onNavigateTab(stat.actionTab)}
              style={{
                padding: '1.15rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                cursor: stat.actionTab ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.65rem'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: stat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color
                  }}
                >
                  <Icon size={20} />
                </div>
                {stat.actionTab && (
                  <ArrowUpRight
                    size={16}
                    style={{ color: 'var(--text-light)', opacity: 0.7 }}
                  />
                )}
              </div>

              <div
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--text)',
                  lineHeight: 1.1,
                  marginBottom: '0.2rem'
                }}
              >
                {stat.value}
              </div>

              <div
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)'
                }}
              >
                {stat.label}
              </div>

              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-light)',
                  marginTop: '0.35rem'
                }}
              >
                {stat.hint}
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}

export default UserStats;
