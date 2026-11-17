import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../layouts/AuthLayout';
import MeldLogo from '../../components/common/MeldLogo';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import ErrorMessage from '../../components/common/ErrorMessage';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Register() {
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to proper dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const targetPath = user.role?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard';
      navigate(targetPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const validate = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
      errors.password = 'Password must contain both letters and numbers.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
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
      const result = await register(name, email, password);
      setIsSuccess(true);

      // If backend automatically logged in the user, redirect after short delay
      if (result?.token || result?.user) {
        setTimeout(() => {
          navigate('/user/dashboard', { replace: true });
        }, 1200);
      } else {
        // Redirect to login page
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      }
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="animate-fade-in" style={{ width: '100%' }}>
        {/* Header Branding */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <MeldLogo size="sm" showText={true} />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.025em',
              marginBottom: '0.45rem'
            }}
          >
            Create Your Account
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Join the MELD network and connect your world with others.
          </p>
        </div>

        {/* Success Feedback Banner */}
        {isSuccess && (
          <div
            className="animate-slide-up"
            style={{
              backgroundColor: 'var(--success-surface)',
              color: 'var(--success)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '1px solid rgba(32, 109, 57, 0.25)'
            }}
          >
            <CheckCircle2 size={24} style={{ flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>
                Account created successfully!
              </p>
              <p style={{ fontSize: '0.825rem', margin: '0.2rem 0 0 0' }}>
                Redirecting you to the portal...
              </p>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {apiError && (
          <ErrorMessage
            message={apiError}
            onDismiss={() => setApiError(null)}
          />
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name Field */}
          <InputField
            id="register-name"
            name="name"
            type="text"
            label="Full name"
            placeholder="Aman Sharma"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: null }));
            }}
            error={formErrors.name}
            required
            autoComplete="name"
            icon={<User size={18} />}
          />

          {/* Email Address Field */}
          <InputField
            id="register-email"
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
            id="register-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="At least 6 chars (letters & numbers)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: null }));
            }}
            error={formErrors.password}
            required
            autoComplete="new-password"
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

          {/* Confirm Password Field */}
          <InputField
            id="register-confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (formErrors.confirmPassword)
                setFormErrors((prev) => ({ ...prev, confirmPassword: null }));
            }}
            error={formErrors.confirmPassword}
            required
            autoComplete="new-password"
            icon={<Lock size={18} />}
            rightAction={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {/* Terms info */}
          <p
            style={{
              fontSize: '0.775rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              marginBottom: '1.5rem'
            }}
          >
            By creating an account, you join MELD as a Community Member (USER role).
            You agree to respectful engagement across all five initiatives.
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting || isSuccess}
            iconRight={<ArrowRight size={18} />}
          >
            Create Free Account
          </Button>

          {/* Login Switcher */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>Already have an account? </span>
            <Link
              to="/login"
              style={{
                color: 'var(--primary)',
                fontWeight: 700,
                marginLeft: '0.25rem'
              }}
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Register;
