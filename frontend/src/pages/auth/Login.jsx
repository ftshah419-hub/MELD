import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../layouts/AuthLayout';
import MeldLogo from '../../components/common/MeldLogo';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to proper dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath =
        location.state?.from?.pathname ||
        (user.role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const loggedUser = await login(email, password, rememberMe);
      const role = loggedUser?.role?.toUpperCase();
      const targetPath =
        location.state?.from?.pathname ||
        (role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard');
      navigate(targetPath, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Unable to sign in. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="animate-fade-in" style={{ width: '100%' }}>
        {/* Header Branding & Welcome */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <MeldLogo size="sm" showText={true} />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.025em',
              marginBottom: '0.5rem'
            }}
          >
            Welcome Back
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Connect with opportunities that make a difference.
          </p>
        </div>

        {/* Global Error Banner */}
        {apiError && (
          <ErrorMessage
            message={apiError}
            onDismiss={() => setApiError(null)}
          />
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <InputField
            id="login-email"
            name="email"
            type="email"
            label="Email address"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: null }));
            }}
            error={formErrors.email}
            required
            autoComplete="email"
            icon={<Mail size={18} />}
          />

          {/* Password Field */}
          <InputField
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: null }));
            }}
            error={formErrors.password}
            required
            autoComplete="current-password"
            icon={<Lock size={18} />}
            rightAction={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {/* Remember Me & Forgot Password Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
              fontSize: '0.875rem'
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                userSelect: 'none',
                color: 'var(--text-muted)'
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: 'var(--primary)',
                  cursor: 'pointer'
                }}
              />
              <span>Remember me</span>
            </label>

            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset link will be sent to your registered email when connected to backend service.');
              }}
              style={{
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            iconRight={<ArrowRight size={18} />}
          >
            Login
          </Button>

          {/* Registration Switcher */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>Don't have an account? </span>
            <Link
              to="/register"
              style={{
                color: 'var(--primary)',
                fontWeight: 700,
                marginLeft: '0.25rem'
              }}
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
