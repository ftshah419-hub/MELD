import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import Button from './Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

/**
 * Role-Based Route Guard
 * Enforces role authorization (USER vs ADMIN)
 */
export function RoleRoute({ allowedRoles = [], children }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner size="fullscreen" message="Verifying permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role ? user.role.toUpperCase() : 'USER';
  const isAllowed = allowedRoles.map(r => r.toUpperCase()).includes(userRole);

  if (!isAllowed) {
    return (
      <div
        className="section animate-fade-in"
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <div
          className="card-surface"
          style={{
            maxWidth: '520px',
            width: '100%',
            textAlign: 'center',
            padding: '3rem 2rem'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--error-surface)',
              color: 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}
          >
            <ShieldAlert size={34} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.75rem',
              color: 'var(--text)',
              marginBottom: '0.75rem'
            }}
          >
            Access Restricted
          </h2>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}
          >
            Your current account role (<strong>{userRole}</strong>) does not have authorization
            to view this administrative section.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={userRole === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'}>
              <Button variant="primary">
                Return to My Dashboard
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" iconLeft={<ArrowLeft size={16} />}>
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default RoleRoute;
