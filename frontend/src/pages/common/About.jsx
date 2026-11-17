import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import MeldLogo from '../../components/common/MeldLogo';
import {
  Globe,
  HeartHandshake,
  Compass,
  Sparkles,
  Users,
  Target,
  ArrowRight,
  ShieldCheck,
  Leaf
} from 'lucide-react';

export function About() {
  const pillars = [
    {
      title: 'Intergenerational Empathy',
      desc: 'Connecting retired veterans of craft, science, and life with young creators who seek grounding and practical mentorship.',
      color: 'var(--wisdom)'
    },
    {
      title: 'Circular Stewardship',
      desc: 'Extending the life cycle of physical assets—from laptops to books and seasonal surplus food—reducing landfill strain.',
      color: 'var(--reconnect)'
    },
    {
      title: 'Artisan Dignity',
      desc: 'Rewarding ancestral craftsmanship with fair value and direct urban patronage, removing coercive middleman margins.',
      color: 'var(--craft)'
    },
    {
      title: 'Hyperlocal Trust',
      desc: 'Building verified, safe, and transparent community bonds where neighborhood mutual aid is an accessible daily ritual.',
      color: 'var(--food)'
    }
  ];

  return (
    <div className="about-page">
      {/* HEADER SECTION */}
      <section className="section-hero" style={{ textAlign: 'center', backgroundColor: 'var(--mint-light)' }}>
        <div className="container">
          <span className="badge badge-mint" style={{ marginBottom: '1rem' }}>
            Our Mission & Story
          </span>
          <h1
            className="display-sm"
            style={{
              maxWidth: '820px',
              margin: '0 auto 1.25rem auto',
              color: 'var(--text)'
            }}
          >
            Different Worlds. One Connected Future.
          </h1>
          <p
            className="body-lg"
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              color: 'var(--text-muted)'
            }}
          >
            MELD was created to prove that the solutions to our society's deepest deficits already
            exist in our society's overlooked surpluses.
          </p>
        </div>
      </section>

      {/* CORE PHILOSOPHY: BRIDGE TWO WORLDS */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center'
            }}
          >
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
                The Genesis
              </span>
              <h2 className="headline-lg" style={{ marginBottom: '1.25rem' }}>
                The "Bridge Two Worlds" Concept
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem'
                }}
              >
                In our modern cities, two distinct realities often live side by side without ever
                speaking to each other:
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '1.75rem'
                }}
              >
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--mint)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    1
                  </div>
                  <span style={{ fontSize: '0.925rem', color: 'var(--text)', lineHeight: 1.5 }}>
                    <strong>Retirees with decades of wisdom</strong> live in silence, while ambitious students
                    navigate career anxiety without guidance.
                  </span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--mint)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    2
                  </div>
                  <span style={{ fontSize: '0.925rem', color: 'var(--text)', lineHeight: 1.5 }}>
                    <strong>Master rural artisans</strong> create world-class handicrafts, while urban homes buy
                    mass-produced plastics unaware of local craftsmanship.
                  </span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--mint)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    3
                  </div>
                  <span style={{ fontSize: '0.925rem', color: 'var(--text)', lineHeight: 1.5 }}>
                    <strong>Tech closets fill with unused gadgets</strong>, while digital classrooms leave
                    underprivileged kids behind.
                  </span>
                </li>
              </ul>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                <strong>MELD bridges these worlds.</strong> Not through top-down charity, but through
                dignified, peer-to-peer exchange and mutual community enrichment.
              </p>
            </div>

            <div
              className="card-surface"
              style={{
                padding: '3rem',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-2xl)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                <MeldLogo size="lg" variant="light" withTagline={true} />
                <div style={{ height: '2rem' }} />
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    color: 'var(--accent)',
                    marginBottom: '1rem'
                  }}
                >
                  Our Vision
                </h3>
                <p
                  style={{
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '2rem'
                  }}
                >
                  A society where zero skills gather dust, zero working tech enters a dump,
                  zero authentic craft is forgotten, and zero edible food is thrown away.
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <Leaf size={24} style={{ color: 'var(--secondary)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--mint)' }}>
                    Built for sustainable living, verified circularity, and neighborhood solidarity.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PILLARS */}
      <section className="section" style={{ backgroundColor: 'var(--surface-alt)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-mint" style={{ marginBottom: '0.85rem' }}>
              Guiding Principles
            </span>
            <h2 className="headline-lg">The Pillars That Anchor Us</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem'
            }}
          >
            {pillars.map((p, idx) => (
              <div
                key={idx}
                className="card-surface"
                style={{
                  borderTop: `4px solid ${p.color}`,
                  padding: '2.25rem 1.75rem'
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    color: 'var(--text)'
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.65 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="headline-lg" style={{ marginBottom: '1rem' }}>
              Become Part of the Movement
            </h2>
            <p className="body-md" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Create your account today and see what opportunities await your skills, idle goods, or curiosity.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Link to="/register">
                <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
                  Join MELD Now
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" size="lg">
                  Explore Initiatives
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
