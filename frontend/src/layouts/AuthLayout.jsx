import React from 'react';
import { Link } from 'react-router-dom';
import MeldLogo from '../components/common/MeldLogo';
import { ShieldCheck, Lock } from 'lucide-react';

/**
 * Split-screen Auth Layout matching the official MELD login design
 */
export function AuthLayout({ children }) {
  const heroImageUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBQsWD3r4K4bmo_eI15ko4cc4MZwpJjiMTM7uYpfbVG1rgERwwCo6HNk6JB0KF4j_zuQDn9xsqApfRCEyrroY6GJ1aj7FQXHT_D72BHkqbldrEP2Z2nyjgCa6xjKBKGBPB49UL0IuGuBEytRAHVJ9WJZLBfY8wiWbK0_EgNc8iZNfVJyaclQhORcG3qU_M24qgOdZ95SLfD69ImFHon3ghdTM0loFTNr95dT1S_Gqxq';

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--background)'
      }}
      className="auth-layout-wrapper"
    >
      {/* LEFT PANEL: Visual Storytelling & Brand Showcase */}
      <div
        className="auth-left-panel"
        style={{
          flex: '1 1 50%',
          backgroundColor: '#003426',
          backgroundImage: 'radial-gradient(circle at 20% 20%, #164B3B 0%, #003426 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(2rem, 4vw, 4rem)',
          color: '#FFFFFF'
        }}
      >
        {/* Ambient Glow Elements */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-80px',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            backgroundColor: 'rgba(22, 75, 59, 0.45)',
            filter: 'blur(90px)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            backgroundColor: 'rgba(215, 169, 74, 0.16)',
            filter: 'blur(100px)',
            pointerEvents: 'none'
          }}
        />

        {/* Top Header: Logo & Community Matrix Badge */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Link to="/" style={{ display: 'inline-flex' }}>
            <MeldLogo size="md" variant="light" />
          </Link>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--mint)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(22, 75, 59, 0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            Community Matrix
          </span>
        </div>

        {/* Center Feature Visual with Floating Badges */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            margin: 'auto 0',
            padding: '2.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Main Circular Imagery with Rings */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Concentric Glow Rings */}
            <div
              style={{
                position: 'absolute',
                inset: '-10px',
                borderRadius: '50%',
                backgroundColor: 'rgba(22, 75, 59, 0.25)',
                animation: 'pulseGlow 4s infinite'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '10px',
                borderRadius: '50%',
                backgroundColor: 'rgba(167, 191, 165, 0.12)',
                filter: 'blur(16px)'
              }}
            />

            {/* Focal Circular Hero Image */}
            <div
              style={{
                position: 'relative',
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                border: '6px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <img
                src={heroImageUrl}
                alt="Two community members collaborating warmly over a tablet"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0, 52, 38, 0.65) 0%, transparent 60%)'
                }}
              />
            </div>

            {/* Floating Badge 1: Wisdom Loop (Top-Left) */}
            <div
              className="animate-float"
              style={{
                position: 'absolute',
                top: '-10px',
                left: '-15px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transform: 'rotate(-2deg)',
                color: 'var(--text)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--mint)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>
                  handshake
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--text-muted)',
                    fontWeight: 700
                  }}
                >
                  Wisdom Loop
                </p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                  Mentorship connected
                </p>
              </div>
            </div>

            {/* Floating Badge 2: ReConnect (Middle-Right) */}
            <div
              className="animate-float-delayed"
              style={{
                position: 'absolute',
                top: '48%',
                right: '-25px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'var(--text)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(215, 169, 74, 0.2)',
                  color: '#996C0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>
                  devices
                </span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p
                  style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--text-muted)',
                    fontWeight: 700
                  }}
                >
                  ReConnect
                </p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                  Laptop rehomed
                </p>
              </div>
            </div>

            {/* Floating Badge 3: Second Serve (Bottom-Left) */}
            <div
              className="animate-float"
              style={{
                position: 'absolute',
                bottom: '-15px',
                left: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transform: 'rotate(2deg)',
                color: 'var(--text)'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(112, 151, 93, 0.2)',
                  color: 'var(--food)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span className="material-symbols-outlined fill" style={{ fontSize: '20px' }}>
                  eco
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--text-muted)',
                    fontWeight: 700
                  }}
                >
                  Second Serve
                </p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                  Surplus meal delivered
                </p>
              </div>
            </div>
          </div>

          {/* Taglines */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center', maxWidth: '440px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-0.025em'
              }}
            >
              Different Worlds.
            </h2>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
                fontWeight: 800,
                color: 'var(--accent)',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                marginBottom: '1rem'
              }}
            >
              One Connected Future.
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6
              }}
            >
              Empowering intergenerational wisdom, sustainable living, and neighborhood
              solidarity across unified platforms.
            </p>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.775rem',
            color: 'var(--mint)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                display: 'inline-block',
                animation: 'pulseGlow 2s infinite'
              }}
            />
            <span style={{ fontWeight: 600 }}>14,820 live connections today</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span>Carbon Offset: <strong>42.8t</strong></span>
            <span>Zero Food Waste</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Form Container & Trust Badges */}
      <div
        className="auth-right-panel"
        style={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(1.5rem, 4vw, 4rem)',
          backgroundColor: 'var(--background)'
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {children}

          {/* Trust Badges */}
          <div
            style={{
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={15} style={{ color: 'var(--primary)' }} />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
              <span>Privacy Compliant</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .auth-layout-wrapper {
            flex-direction: column;
          }
          .auth-left-panel {
            min-height: 480px;
          }
        }
      `}</style>
    </div>
  );
}

export default AuthLayout;
