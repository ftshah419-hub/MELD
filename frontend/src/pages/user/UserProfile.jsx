import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Save,
  CheckCircle,
  Shield,
  Sparkles
} from 'lucide-react';
import userService from '../../services/user/userService';
import ScrollReveal from '../../components/user/ScrollReveal';

export function UserProfile({ user }) {
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userService.getProfile();
      if (res && res.user) {
        setProfile({
          name: res.user.name || '',
          email: res.user.email || '',
          phone: res.user.phone || '',
          bio: res.user.bio || '',
          address: {
            street: res.user.address?.street || '',
            city: res.user.address?.city || '',
            state: res.user.address?.state || '',
            pincode: res.user.address?.pincode || ''
          }
        });
      }
    } catch {
      // Fallback to auth context user
      if (user) {
        setProfile((prev) => ({
          ...prev,
          name: user.name || '',
          email: user.email || ''
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = () => {
    let score = 25; // Email registered
    if (profile.name) score += 25;
    if (profile.phone) score += 20;
    if (profile.bio) score += 15;
    if (profile.address?.city && profile.address?.pincode) score += 15;
    return Math.min(score, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSavedSuccess(false);

    try {
      await userService.updateProfile({
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        address: profile.address
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const completionScore = calculateCompletion();

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <ScrollReveal direction="down">
        {/* Profile Completion Meter */}
        <div
          className="card-surface"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--primary)" />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Profile Completion</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
              {completionScore}%
            </span>
          </div>

          <div
            style={{
              height: '8px',
              backgroundColor: 'var(--surface-alt)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '0.5rem'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${completionScore}%`,
                backgroundColor: completionScore === 100 ? 'var(--primary)' : 'var(--secondary)',
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Complete your contact and address details to streamline logistics across ReConnect, Book Bridge, and Second Serve.
          </span>
        </div>
      </ScrollReveal>

      {/* Main Profile Form */}
      <ScrollReveal direction="up" delay={100}>
        <div
          className="card-surface"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.35rem'
              }}
            >
              {profile.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.2rem' }}>
                Account & Impact Profile
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Authenticated Member ID: {user?._id || user?.id || 'Active'}
              </span>
            </div>
          </div>

          {savedSuccess && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--mint)',
                color: 'var(--primary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
                fontSize: '0.85rem'
              }}
            >
              <CheckCircle size={18} />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(186, 26, 26, 0.1)',
                color: 'var(--error)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Registered Email (Verified)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.875rem', backgroundColor: 'var(--surface-alt)', opacity: 0.8 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Direct Contact Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  City / Town
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru"
                    value={profile.address.city}
                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, city: e.target.value } })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.875rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  State
                </label>
                <input
                  type="text"
                  placeholder="e.g. Karnataka"
                  value={profile.address.state}
                  onChange={(e) => setProfile({ ...profile, address: { ...profile.address, state: e.target.value } })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Postal Pincode
                </label>
                <input
                  type="text"
                  placeholder="e.g. 560001"
                  value={profile.address.pincode}
                  onChange={(e) => setProfile({ ...profile, address: { ...profile.address, pincode: e.target.value } })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Community Bio & Interests
              </label>
              <textarea
                rows={3}
                placeholder="Share your interest in mentorship, traditional craft, digital circularity, literacy, or food rescue..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.875rem', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary hover-lift"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem' }}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default UserProfile;
