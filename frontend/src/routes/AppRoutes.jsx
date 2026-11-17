import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleRoute from '../components/common/RoleRoute';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

// Common Website Pages
import Home from '../pages/common/Home';
import About from '../pages/common/About';
import Explore from '../pages/common/Explore';
import HowItWorks from '../pages/common/HowItWorks';
import Impact from '../pages/common/Impact';
import Contact from '../pages/common/Contact';
import NotFound from '../pages/common/NotFound';

// Authentication Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import {
  LayoutDashboard,
  Shield,
  UserCheck,
  CheckCircle2,
  Code2,
  ExternalLink,
  LogOut
} from 'lucide-react';

/**
 * Person 2: User Dashboard Integration Component
 * Protected file policy: src/pages/user/ is owned exclusively by Person 2.
 * This handoff container mounts Person 2's dashboard and provides seamless session context.
 */
function UserDashboardIntegration() {
  const { user, logout } = useAuth();

  return (
    <div className="section animate-fade-in" style={{ minHeight: '80vh', padding: '3rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div
          className="card-surface"
          style={{
            borderLeft: '6px solid var(--primary)',
            padding: '2.5rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--mint)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LayoutDashboard size={28} />
              </div>
              <div>
                <span className="badge badge-mint" style={{ marginBottom: '0.25rem' }}>
                  Live Authenticated Session
                </span>
                <h1 className="headline-md" style={{ margin: 0 }}>
                  Welcome, {user?.name || 'Community Member'}!
                </h1>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              iconLeft={<LogOut size={16} />}
              onClick={logout}
              style={{ color: 'var(--error)', borderColor: 'rgba(186, 26, 26, 0.3)' }}
            >
              Sign Out
            </Button>
          </div>

          <div
            style={{
              backgroundColor: 'var(--surface-alt)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
              border: '1px solid var(--border)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>User ID</span>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', wordBreak: 'break-all' }}>
                {user?._id || user?.id || 'Session Active'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Email</span>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                {user?.email || 'N/A'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Role</span>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>
                {user?.role ? user.role.toUpperCase() : 'USER'}
              </div>
            </div>
          </div>

          {/* Person 2 Handoff Specification Box */}
          <div
            style={{
              border: '1.5px dashed var(--secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              backgroundColor: 'rgba(220, 235, 225, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <Code2 size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>
                Person 2 (User Module) Integration Bridge
              </h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: '1rem' }}>
              This route (<code>/user/dashboard</code>) is fully protected by <code>ProtectedRoute</code> and <code>RoleRoute</code>.
              Person 2's protected directory is untouched at <code>src/pages/user/</code>.
            </p>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <strong>Expected Person 2 export:</strong> Drop <code>UserDashboard.jsx</code> in <code>src/pages/user/UserDashboard.jsx</code>.
              The shared <code>AuthContext</code> and <code>useAuth()</code> hook are ready to provide full user identity and token headers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Person 3: Admin Dashboard Integration Component
 * Protected file policy: src/pages/admin/ is owned exclusively by Person 3.
 * This handoff container mounts Person 3's admin management interface.
 */
function AdminDashboardIntegration() {
  const { user, logout } = useAuth();

  return (
    <div className="section animate-fade-in" style={{ minHeight: '80vh', padding: '3rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div
          className="card-surface"
          style={{
            borderLeft: '6px solid var(--accent)',
            padding: '2.5rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(215, 169, 74, 0.2)',
                  color: '#996C0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Shield size={28} />
              </div>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '0.25rem' }}>
                  ADMINISTRATOR PRIVILEGES
                </span>
                <h1 className="headline-md" style={{ margin: 0 }}>
                  Admin Control Portal
                </h1>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              iconLeft={<LogOut size={16} />}
              onClick={logout}
              style={{ color: 'var(--error)', borderColor: 'rgba(186, 26, 26, 0.3)' }}
            >
              Sign Out
            </Button>
          </div>

          <div
            style={{
              backgroundColor: 'var(--surface-alt)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
              border: '1px solid var(--border)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Admin Name</span>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                {user?.name || 'Administrator'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Admin Email</span>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                {user?.email || 'N/A'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role Clearance</span>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#996C0B' }}>
                ADMIN
              </div>
            </div>
          </div>

          {/* Person 3 Handoff Specification Box */}
          <div
            style={{
              border: '1.5px dashed var(--accent)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              backgroundColor: 'rgba(215, 169, 74, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <Code2 size={20} style={{ color: '#996C0B' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#996C0B' }}>
                Person 3 (Admin Module) Integration Bridge
              </h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: '1rem' }}>
              This route (<code>/admin/dashboard</code>) is protected by <code>ProtectedRoute</code> and strictly requires
              <code>role === 'ADMIN'</code>. Unauthorized users are blocked with an Access Restricted screen.
              Person 3's protected directory is untouched at <code>src/pages/admin/</code>.
            </p>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <strong>Expected Person 3 export:</strong> Drop <code>AdminDashboard.jsx</code> in <code>src/pages/admin/AdminDashboard.jsx</code>.
              Platform moderation metrics, user controls, and module reports plug directly into this route.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Authentication Pages (Using AuthLayout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public Pages (Using MainLayout with Navbar & Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected User Dashboard Destination */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['USER', 'ADMIN']}>
                <UserDashboardIntegration />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Dashboard Destination */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['ADMIN']}>
                <AdminDashboardIntegration />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
