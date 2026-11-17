import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import ModuleCard from '../../components/common/ModuleCard';
import MeldLogo from '../../components/common/MeldLogo';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Heart,
  TrendingUp,
  Recycle,
  BookOpen,
  ShoppingBag,
  Utensils,
  Lightbulb
} from 'lucide-react';

export function Home() {
  const modules = [
    {
      id: 'wisdom-loop',
      title: 'Wisdom Loop',
      tagline: 'Mentorship & Knowledge Sharing',
      description:
        'Bridging generational wisdom by pairing experienced senior mentors with aspiring youth, students, and early-career innovators for lifelong learning.',
      accentColor: 'var(--wisdom)',
      iconName: 'handshake',
      stat: 'Mentorship connected',
      link: '/explore#wisdom-loop'
    },
    {
      id: 'craft-to-cart',
      title: 'Craft to Cart',
      tagline: 'Artisans & Modern Customers',
      description:
        'Empowering traditional artisans and indigenous craftspeople with direct digital access to conscious urban consumers, preserving cultural heritage.',
      accentColor: 'var(--craft)',
      iconName: 'brush',
      stat: 'Handcrafted with pride',
      link: '/explore#craft-to-cart'
    },
    {
      id: 'reconnect',
      title: 'ReConnect',
      tagline: 'Electronics Reuse & Repair',
      description:
        'Circulating pre-loved electronics through certified local diagnostics, refurbishment, and ethical recycling, turning e-waste into student opportunity.',
      accentColor: 'var(--reconnect)',
      iconName: 'devices',
      stat: 'Laptop rehomed',
      link: '/explore#reconnect'
    },
    {
      id: 'book-bridge',
      title: 'Book Bridge',
      tagline: 'Book Donation & Exchange',
      description:
        'Unlocking dormant bookshelves into open neighborhood circulating libraries, community reading rooms, and rural school book drives.',
      accentColor: 'var(--book)',
      iconName: 'menu_book',
      stat: 'Library expanded',
      link: '/explore#book-bridge'
    },
    {
      id: 'second-serve',
      title: 'Second Serve',
      tagline: 'Surplus Food Distribution',
      description:
        'Rescuing clean, nutritious surplus food from banquet halls, grocers, and community events to feed local shelters and families in dignity.',
      accentColor: 'var(--food)',
      iconName: 'eco',
      stat: 'Surplus meal delivered',
      link: '/explore#second-serve'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Discover',
      desc: 'Browse live community needs, mentorship opportunities, circular goods, and local food rescues near you.',
      icon: <Sparkles size={24} style={{ color: 'var(--wisdom)' }} />
    },
    {
      num: '02',
      title: 'Offer or Request',
      desc: 'List your mentoring time, donate an idle laptop, share books, or post surplus meals with transparent tracking.',
      icon: <Heart size={24} style={{ color: 'var(--craft)' }} />
    },
    {
      num: '03',
      title: 'Connect',
      desc: 'Match securely with verified neighbors, local non-profits, students, or ethical buyers without corporate middlemen.',
      icon: <Users size={24} style={{ color: 'var(--reconnect)' }} />
    },
    {
      num: '04',
      title: 'Create Impact',
      desc: 'See the verified difference: carbon emissions averted, skills passed on, and communities strengthened.',
      icon: <TrendingUp size={24} style={{ color: 'var(--food)' }} />
    }
  ];

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="section-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Ambient Warm Gradients */}
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            borderRadius: '50%',
            backgroundColor: 'rgba(220, 235, 225, 0.45)',
            filter: 'blur(100px)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Tagline Badge */}
          <div
            className="animate-slide-down"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.45rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--mint)',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '1.75rem',
              border: '1px solid rgba(22, 75, 59, 0.15)'
            }}
          >
            <Sparkles size={16} style={{ color: 'var(--accent)' }} />
            <span>Different Worlds. One Connected Future.</span>
          </div>

          {/* Master Hero Heading */}
          <h1
            className="display-lg animate-slide-up"
            style={{
              maxWidth: '920px',
              margin: '0 auto 1.5rem auto',
              color: 'var(--text)'
            }}
          >
            What you have can{' '}
            <span
              style={{
                color: 'var(--primary)',
                position: 'relative',
                display: 'inline-block'
              }}
            >
              change someone's world.
            </span>
          </h1>

          {/* Supporting Text */}
          <p
            className="body-lg animate-slide-up delay-100"
            style={{
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
              color: 'var(--text-muted)'
            }}
          >
            Connecting people, skills and resources with the communities that need them.
            A unified ecosystem bridging generational wisdom, sustainable craft, electronics reuse,
            literacy, and food rescue under one community roof.
          </p>

          {/* Action Buttons */}
          <div
            className="animate-slide-up delay-200"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3.5rem'
            }}
          >
            <Link to="/explore">
              <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
                Explore MELD
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                How It Works
              </Button>
            </Link>
          </div>

          {/* Live Community Metric Strip */}
          <div
            className="card-surface animate-fade-in delay-300"
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              padding: '1.25rem 2rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-around',
              gap: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  animation: 'pulseGlow 2s infinite'
                }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                  14,820+
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Live Connections
                </div>
              </div>
            </div>

            <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border)' }} />

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--reconnect)' }}>
                42.8 Tonnes
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Carbon Offset
              </div>
            </div>

            <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border)' }} />

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--food)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Zero Food Waste Target
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE FIVE MODULES SECTION */}
      <section className="section" style={{ backgroundColor: 'var(--surface-alt)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-mint" style={{ marginBottom: '0.85rem' }}>
              Unified Ecosystem
            </span>
            <h2 className="headline-lg" style={{ marginBottom: '1rem' }}>
              Five Initiatives. One Purpose.
            </h2>
            <p className="body-md" style={{ color: 'var(--text-muted)' }}>
              MELD integrates five distinct pathways of social impact into a seamless experience.
              Whether sharing knowledge, craft, technology, books, or meals, every action bridges two worlds.
            </p>
          </div>

          <div className="grid-cards">
            {modules.map((m) => (
              <ModuleCard key={m.id} {...m} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.85rem' }}>
              Simple & Transparent
            </span>
            <h2 className="headline-lg" style={{ marginBottom: '0.75rem' }}>
              How MELD Works
            </h2>
            <p className="body-md" style={{ color: 'var(--text-muted)' }}>
              From initial listing to verified community impact in four human-centered steps.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem'
            }}
          >
            {steps.map((s) => (
              <div
                key={s.num}
                className="card-surface"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'var(--primary)'
                    }}
                  >
                    {s.num}
                  </span>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--mint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {s.icon}
                  </div>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    color: 'var(--text)'
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY STORYTELLING / TESTIMONIALS */}
      <section className="section" style={{ backgroundColor: 'var(--mint-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-mint" style={{ marginBottom: '0.85rem' }}>
              Community Voices
            </span>
            <h2 className="headline-lg" style={{ marginBottom: '0.75rem' }}>
              Real Stories from Bridged Worlds
            </h2>
            <p className="body-md" style={{ color: 'var(--text-muted)' }}>
              See how intergenerational wisdom and circular empathy change daily lives.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}
          >
            {/* Story 1 */}
            <div className="card-surface" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', color: 'var(--accent)', marginBottom: '1rem' }}>
                {'★'.repeat(5)}
              </div>
              <p
                style={{
                  fontStyle: 'italic',
                  color: 'var(--text)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem'
                }}
              >
                "Through Wisdom Loop, I met Dr. Ramanathan, a retired engineering dean.
                His guidance transformed my final-year project into a funded clean-water startup.
                We still talk every Sunday."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--wisdom)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  AK
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Ananya K.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Mentee • Wisdom Loop
                  </div>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="card-surface" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', color: 'var(--accent)', marginBottom: '1rem' }}>
                {'★'.repeat(5)}
              </div>
              <p
                style={{
                  fontStyle: 'italic',
                  color: 'var(--text)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem'
                }}
              >
                "We had three older laptops sitting in our storeroom. Via ReConnect, a certified
                technician cleaned them up, and now two high school siblings in our district can attend
                online coding classes."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--reconnect)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  MR
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Mohan Rao</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Tech Donor • ReConnect
                  </div>
                </div>
              </div>
            </div>

            {/* Story 3 */}
            <div className="card-surface" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', color: 'var(--accent)', marginBottom: '1rem' }}>
                {'★'.repeat(5)}
              </div>
              <p
                style={{
                  fontStyle: 'italic',
                  color: 'var(--text)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem'
                }}
              >
                "At our bakery, end-of-day surplus used to be a heartbreak. With Second Serve,
                a verified volunteer picks it up within 45 minutes to distribute to the night shelter.
                Nothing wasted, everyone fed."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--food)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  SV
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Sara Varghese</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Food Partner • Second Serve
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION (CTA) */}
      <section className="section" style={{ position: 'relative' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              padding: 'clamp(3rem, 6vw, 4.5rem)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            {/* Glow blobs */}
            <div
              style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                backgroundColor: 'rgba(215, 169, 74, 0.15)',
                filter: 'blur(80px)'
              }}
            />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  marginBottom: '1.25rem',
                  lineHeight: 1.2
                }}
              >
                Ready to Bridge Two Worlds?
              </h2>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.6,
                  marginBottom: '2.5rem'
                }}
              >
                Join thousands of neighbors, educators, artisans, and changemakers.
                Your skills, pre-loved items, or shared meals can spark real transformation.
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <Link to="/register">
                  <Button variant="accent" size="lg" iconRight={<ArrowRight size={18} />}>
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    variant="ghost"
                    size="lg"
                    style={{ color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.25)' }}
                  >
                    Read Our Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
