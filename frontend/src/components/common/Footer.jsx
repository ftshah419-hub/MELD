import React from 'react';
import { Link } from 'react-router-dom';
import MeldLogo from './MeldLogo';
import { ShieldCheck, Lock, Heart, Globe, Sparkles } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const modules = [
    { name: 'Wisdom Loop', desc: 'Intergenerational Mentorship', color: 'var(--wisdom)', path: '/explore#wisdom-loop' },
    { name: 'Craft to Cart', desc: 'Artisan Marketplace', color: 'var(--craft)', path: '/explore#craft-to-cart' },
    { name: 'ReConnect', desc: 'Tech Repair & Circular Life', color: 'var(--reconnect)', path: '/explore#reconnect' },
    { name: 'Book Bridge', desc: 'Community Book Sharing', color: 'var(--book)', path: '/explore#book-bridge' },
    { name: 'Second Serve', desc: 'Surplus Food Rescue', color: 'var(--food)', path: '/explore#second-serve' }
  ];

  const quickLinks = [
    { name: 'Explore Modules', path: '/explore' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Verified Impact', path: '/impact' },
    { name: 'About MELD', path: '/about' },
    { name: 'Contact & Support', path: '/contact' }
  ];

  return (
    <footer
      style={{
        backgroundColor: 'var(--primary)',
        color: '#FFFFFF',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '5rem',
        paddingBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Background Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          backgroundColor: 'rgba(215, 169, 74, 0.08)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          backgroundColor: 'rgba(167, 191, 165, 0.08)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem'
          }}
        >
          {/* Brand Info */}
          <div style={{ maxWidth: '340px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
              <MeldLogo size="lg" variant="light" withTagline={true} />
            </Link>

            <p
              style={{
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: '0.925rem',
                lineHeight: 1.65,
                marginBottom: '1.5rem'
              }}
            >
              Different Worlds. One Connected Future. A unified community network bridging generations,
              skills, surplus resources, and authentic human solidarity.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                fontSize: '0.75rem',
                color: 'var(--mint)',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--accent)' }} />
              <span>Community Matrix Active</span>
            </div>
          </div>

          {/* Five Initiatives */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '1.25rem',
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}
            >
              Five Initiatives
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {modules.map((mod) => (
                <li key={mod.name}>
                  <Link
                    to={mod.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: mod.color,
                        flexShrink: 0
                      }}
                    />
                    <span>{mod.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '1.25rem',
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}
            >
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Live Platform Vitals */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '1.25rem',
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}
            >
              Real-Time Impact
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                backgroundColor: 'rgba(0, 52, 38, 0.6)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    animation: 'pulseGlow 2s infinite'
                  }}
                />
                <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>
                  14,820 live connections today
                </span>
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--mint)' }}>
                Carbon Offset: <strong>42.8 tonnes</strong>
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--mint)' }}>
                Food Rescued: <strong>Zero Food Waste goal</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Trust Badges */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}
        >
          <div>
            © {currentYear} MELD Platform. All rights reserved. Built with pride for Buildathon.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} style={{ color: 'var(--secondary)' }} />
              <span>256-Bit SSL Encrypted</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--secondary)' }} />
              <span>Privacy Compliant</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
