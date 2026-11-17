import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import {
  TrendingUp,
  Leaf,
  Users,
  Utensils,
  Laptop,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Globe2
} from 'lucide-react';

export function Impact() {
  const metrics = [
    {
      label: 'Live Community Connections',
      value: '14,820+',
      sub: 'Verified exchanges across 5 modules',
      color: 'var(--primary)',
      icon: <Users size={28} />
    },
    {
      label: 'Carbon Emissions Offset',
      value: '42.8t',
      sub: 'Through circular electronics & food rescue',
      color: 'var(--reconnect)',
      icon: <Leaf size={28} />
    },
    {
      label: 'Surplus Meals Delivered',
      value: '38,400+',
      sub: 'Distributed to community kitchens in dignity',
      color: 'var(--food)',
      icon: <Utensils size={28} />
    },
    {
      label: 'Laptops & Devices Rehomed',
      value: '1,240+',
      sub: 'Cryptographically wiped & given to students',
      color: 'var(--accent)',
      icon: <Laptop size={28} />
    },
    {
      label: 'Mentorship Hours Completed',
      value: '6,150+',
      sub: 'Intergenerational knowledge transfer sessions',
      color: 'var(--wisdom)',
      icon: <GraduationCap size={28} />
    },
    {
      label: 'Artisan Livelihoods Supported',
      value: '410+',
      sub: 'Direct fair-trade patron purchases',
      color: 'var(--craft)',
      icon: <TrendingUp size={28} />
    }
  ];

  const sdgs = [
    { num: 'SDG 1', name: 'No Poverty', desc: 'Direct market access for rural artisans.' },
    { num: 'SDG 2', name: 'Zero Hunger', desc: 'Rapid rescue of edible banquet surplus food.' },
    { num: 'SDG 4', name: 'Quality Education', desc: 'Free devices, textbooks, and elder mentorship.' },
    { num: 'SDG 10', name: 'Reduced Inequalities', desc: 'Bridging tech, generational, and social divides.' },
    { num: 'SDG 12', name: 'Responsible Consumption', desc: 'Circular repair, electronics life extension.' }
  ];

  return (
    <div className="impact-page">
      {/* HEADER SECTION */}
      <section className="section-hero" style={{ textAlign: 'center', backgroundColor: 'var(--mint-light)' }}>
        <div className="container">
          <span className="badge badge-mint" style={{ marginBottom: '1rem' }}>
            Transparent Social Metrics
          </span>
          <h1
            className="display-sm"
            style={{
              maxWidth: '820px',
              margin: '0 auto 1.25rem auto',
              color: 'var(--text)'
            }}
          >
            Measuring What Truly Matters
          </h1>
          <p
            className="body-lg"
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              color: 'var(--text-muted)'
            }}
          >
            Real change is not an abstract slogan. Here is the tangible, verified impact created by
            everyday citizens bridging two worlds through MELD.
          </p>
        </div>
      </section>

      {/* METRIC TILES */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              marginBottom: '4.5rem'
            }}
          >
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className="card-surface"
                style={{
                  padding: '2.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--surface-alt)',
                    color: m.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid var(--border)',
                    flexShrink: 0
                  }}
                >
                  {m.icon}
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '2.2rem',
                      fontWeight: 800,
                      color: m.color,
                      lineHeight: 1.1,
                      marginBottom: '0.35rem'
                    }}
                  >
                    {m.value}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                      marginBottom: '0.25rem'
                    }}
                  >
                    {m.label}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {m.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* UN SDG ALIGNMENT */}
          <div
            className="card-surface"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              padding: '3rem',
              borderRadius: 'var(--radius-2xl)'
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  color: 'var(--mint)'
                }}
              >
                <Globe2 size={14} />
                Global Impact
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.85rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  marginBottom: '0.75rem'
                }}
              >
                Aligned with UN Sustainable Development Goals
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
                MELD's community initiatives directly advance five core global sustainability objectives.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {sdgs.map((sdg) => (
                <div
                  key={sdg.num}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.12)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--accent)',
                      marginBottom: '0.35rem'
                    }}
                  >
                    {sdg.num}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem', color: '#fff' }}>
                    {sdg.name}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                    {sdg.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="headline-lg" style={{ marginBottom: '1rem' }}>
              Add Your Numbers to the Board
            </h2>
            <p className="body-md" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Every hour mentored, meal shared, or laptop donated moves the needle.
            </p>
            <Link to="/register">
              <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
                Join the Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Impact;
