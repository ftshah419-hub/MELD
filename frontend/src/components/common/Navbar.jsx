import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import MeldLogo from './MeldLogo';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, User, LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Impact', path: '/impact' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const userRole = user?.role ? user.role.toUpperCase() : 'USER';
  const dashboardPath = userRole === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(246, 243, 233, 0.92)' : 'rgba(246, 243, 233, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(40, 53, 46, 0.12)' : 'transparent'}`,
        transition: 'all var(--transition-normal)'
      }}
    >
      <div
        className="container"
        style={{
          height: 'var(--navbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <MeldLogo size="md" showText={true} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-heading)',
                fontSize: '0.925rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary)' : 'var(--text)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isActive ? 'var(--mint)' : 'transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Auth Actions / User Pill */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.85rem'
          }}
          className="desktop-auth"
        >
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Join Community
                </Button>
              </Link>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--border)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: userRole === 'ADMIN' ? 'var(--accent)' : 'var(--primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                </div>

                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text)'
                    }}
                  >
                    {user?.name || 'Account'}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: userRole === 'ADMIN' ? '#B87A00' : 'var(--primary)',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    {userRole}
                  </div>
                </div>

                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="animate-slide-down"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '230px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem',
                    zIndex: 1010
                  }}
                >
                  <div
                    style={{
                      padding: '0.75rem 0.85rem',
                      borderBottom: '1px solid var(--border)',
                      marginBottom: '0.4rem'
                    }}
                  >
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Signed in as</p>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: 'var(--text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to={dashboardPath}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      color: 'var(--text)',
                      fontWeight: 500,
                      transition: 'background-color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--mint)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {userRole === 'ADMIN' ? <Shield size={16} /> : <LayoutDashboard size={16} />}
                    <span>{userRole === 'ADMIN' ? 'Admin Dashboard' : 'User Dashboard'}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      color: 'var(--error)',
                      fontWeight: 500,
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--error-surface)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)'
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="animate-slide-down"
          style={{
            position: 'fixed',
            top: 'var(--navbar-height)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--background)',
            borderBottom: '1px solid var(--border)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 999
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--mint)' : 'transparent'
                })}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            {!isAuthenticated ? (
              <>
                <Link to="/login" style={{ width: '100%' }}>
                  <Button variant="outline" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" style={{ width: '100%' }}>
                  <Button variant="primary" fullWidth>
                    Join Community
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={dashboardPath} style={{ width: '100%' }}>
                  <Button variant="primary" fullWidth iconLeft={<LayoutDashboard size={18} />}>
                    {userRole === 'ADMIN' ? 'Admin Dashboard' : 'User Dashboard'}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={handleLogout}
                  iconLeft={<LogOut size={18} />}
                  style={{ color: 'var(--error)' }}
                >
                  Log Out
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Media Query Styles for Desktop/Mobile Viewports */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}

export default Navbar;
