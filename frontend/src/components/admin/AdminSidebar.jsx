import React from 'react';
import {
  LayoutDashboard,
  Users,
  Layers,
  ShieldCheck,
  AlertOctagon,
  FileText,
  ShoppingBag,
  CreditCard,
  HeartHandshake,
  BarChart3,
  History,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import meldLogo from '../../assets/images/meld-logo.jpg';

export function AdminSidebar({
  activeTab = 'overview',
  onSelectTab,
  isCollapsed = false,
  onToggleCollapse,
  badgeCounts = {}
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={19} /> },
    { id: 'users', label: 'User Management', icon: <Users size={19} /> },
    { id: 'modules', label: 'Module Hub', icon: <Layers size={19} /> },
    {
      id: 'verification',
      label: 'Verification',
      icon: <ShieldCheck size={19} />,
      badge: badgeCounts.verification,
      badgeColor: 'var(--primary)',
      badgeBg: 'var(--mint)'
    },
    {
      id: 'moderation',
      label: 'Content Moderation',
      icon: <AlertOctagon size={19} />,
      badge: badgeCounts.moderation,
      badgeColor: 'var(--error)',
      badgeBg: 'var(--error-surface)'
    },
    {
      id: 'reports',
      label: 'Reports & Complaints',
      icon: <FileText size={19} />,
      badge: badgeCounts.reports,
      badgeColor: '#8d6308',
      badgeBg: 'rgba(215, 169, 74, 0.2)'
    },
    { id: 'orders', label: 'Craft Orders', icon: <ShoppingBag size={19} /> },
    { id: 'payments', label: 'Payments Ledger', icon: <CreditCard size={19} /> },
    { id: 'contributions', label: 'Voluntary Giving', icon: <HeartHandshake size={19} /> },
    { id: 'analytics', label: 'Reports & Analytics', icon: <BarChart3 size={19} /> },
    { id: 'audit-logs', label: 'Audit Trail', icon: <History size={19} /> },
    { id: 'settings', label: 'Platform Settings', icon: <Settings size={19} /> }
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '76px' : '260px',
        backgroundColor: '#edf3ec',
        borderRight: '1px solid var(--border)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 40,
        flexShrink: 0
      }}
    >
      {/* Top Header / Branding */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            height: '76px',
            padding: '0 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <img
              src={meldLogo}
              alt="MELD"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                flexShrink: 0
              }}
            />
            {!isCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1
                  }}
                >
                  MELD
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--secondary-dark)',
                    fontWeight: 600
                  }}
                >
                  Console Hub
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Category Label */}
        {!isCollapsed && (
          <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
            <span
              style={{
                fontSize: '0.675rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-subtle)',
                fontWeight: 700
              }}
            >
              Administration
            </span>
          </div>
        )}

        {/* Navigation Menu */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            padding: isCollapsed ? '0.75rem 0.5rem' : '0.5rem 0.85rem'
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '0.65rem 0' : '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--secondary-light)' : 'transparent',
                  color: isActive ? 'var(--primary-dark)' : 'var(--text)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color var(--transition-fast), color var(--transition-fast)',
                  textAlign: 'left',
                  width: '100%'
                }}
                className={!isActive ? 'hover:bg-surface-alt' : ''}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: item.badgeBg || 'var(--mint)',
                      color: item.badgeColor || 'var(--primary)',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Telemetry & Collapse Control */}
      <div style={{ padding: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
        {!isCollapsed && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-xs)',
              marginBottom: '0.65rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success)'
                }}
                className="animate-pulse"
              />
              <span style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--secondary-dark)' }}>
                System Operational
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', color: 'var(--text-subtle)' }}>
              <span>Latency 24ms</span>
              <span>Core v2.4.1</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          style={{
            width: '100%',
            height: '34px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: '0 0.5rem',
            cursor: 'pointer',
            fontSize: '0.75rem'
          }}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {!isCollapsed && <span>Collapse Sidebar</span>}
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
