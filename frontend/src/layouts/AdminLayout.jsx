import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

export function AdminLayout({
  children,
  activeTab = 'overview',
  onSelectTab,
  activeTabTitle = 'Console Workspace',
  badgeCounts = {},
  unreadNotificationsCount = 0,
  notifications = [],
  onMarkNotificationRead = null
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)'
      }}
    >
      {/* Desktop Persistent Sidebar */}
      <div style={{ display: 'none' }} className="md:block">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          badgeCounts={badgeCounts}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 99,
            display: 'flex'
          }}
          className="md:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AdminSidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                onSelectTab(tab);
                setIsMobileOpen(false);
              }}
              isCollapsed={false}
              badgeCounts={badgeCounts}
            />
          </div>
        </div>
      )}

      {/* Main Administrative Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        <AdminHeader
          activeTabTitle={activeTabTitle}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          notifications={notifications}
          onMarkNotificationRead={onMarkNotificationRead}
        />

        <main style={{ flex: 1, padding: 'clamp(1rem, 2.5vw, 2rem)', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
