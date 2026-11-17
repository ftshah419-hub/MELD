import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModuleCard from '../../components/common/ModuleCard';
import Button from '../../components/common/Button';
import { Search, Filter, Sparkles, Check, ArrowRight } from 'lucide-react';

export function Explore() {
  const [activeFilter, setActiveFilter] = useState('All');

  const modules = [
    {
      id: 'wisdom-loop',
      title: 'Wisdom Loop',
      category: 'Knowledge',
      tagline: 'Mentorship & Knowledge Sharing',
      description:
        'Bridging generational wisdom by pairing experienced senior mentors with aspiring youth, students, and early-career innovators for lifelong learning.',
      accentColor: 'var(--wisdom)',
      iconName: 'handshake',
      stat: 'Mentorship connected',
      canOffer: ['Career guidance & life advice', 'Subject-matter tutoring', 'Industry trade expertise'],
      canReceive: ['Fresh perspectives from youth', 'Digital companionship', 'Meaningful purpose'],
      link: '/register?ref=wisdom-loop'
    },
    {
      id: 'craft-to-cart',
      title: 'Craft to Cart',
      category: 'Crafts',
      tagline: 'Artisans & Modern Customers',
      description:
        'Empowering traditional artisans and indigenous craftspeople with direct digital access to conscious urban consumers, preserving cultural heritage.',
      accentColor: 'var(--craft)',
      iconName: 'brush',
      stat: 'Handcrafted with pride',
      canOffer: ['Handmade pottery & textiles', 'Carved woodwork & metalware', 'Traditional folk arts'],
      canReceive: ['Fair, transparent pricing', 'Direct patron relationships', 'Cultural appreciation'],
      link: '/register?ref=craft-to-cart'
    },
    {
      id: 'reconnect',
      title: 'ReConnect',
      category: 'Technology',
      tagline: 'Electronics Reuse & Repair',
      description:
        'Circulating pre-loved electronics through certified local diagnostics, refurbishment, and ethical recycling, turning e-waste into student opportunity.',
      accentColor: 'var(--reconnect)',
      iconName: 'devices',
      stat: 'Laptop rehomed',
      canOffer: ['Idle laptops, tablets, smartphones', 'Spare chargers & cables', 'PC peripherals'],
      canReceive: ['Refurbished digital devices for study', 'Data wipe certificates', 'Free diagnostics'],
      link: '/register?ref=reconnect'
    },
    {
      id: 'book-bridge',
      title: 'Book Bridge',
      category: 'Education',
      tagline: 'Book Donation & Exchange',
      description:
        'Unlocking dormant bookshelves into open neighborhood circulating libraries, community reading rooms, and rural school book drives.',
      accentColor: 'var(--book)',
      iconName: 'menu_book',
      stat: 'Library expanded',
      canOffer: ['Textbooks & academic guides', 'Novels & children books', 'Reference volumes'],
      canReceive: ['Access to community libraries', 'Free book exchange', 'Neighborhood reading clubs'],
      link: '/register?ref=book-bridge'
    },
    {
      id: 'second-serve',
      title: 'Second Serve',
      category: 'Food Relief',
      tagline: 'Surplus Food Distribution',
      description:
        'Rescuing clean, nutritious surplus food from banquet halls, grocers, and community events to feed local shelters and families in dignity.',
      accentColor: 'var(--food)',
      iconName: 'eco',
      stat: 'Surplus meal delivered',
      canOffer: ['Catered surplus meals', 'Fresh bakery items', 'Surplus packaged produce'],
      canReceive: ['Timely pickup within 45 mins', 'Verified distribution to shelters', 'Zero Food Waste badge'],
      link: '/register?ref=second-serve'
    }
  ];

  const categories = ['All', 'Knowledge', 'Crafts', 'Technology', 'Education', 'Food Relief'];

  const filteredModules =
    activeFilter === 'All'
      ? modules
      : modules.filter((m) => m.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="explore-page">
      {/* HEADER SECTION */}
      <section className="section-hero" style={{ textAlign: 'center', backgroundColor: 'var(--mint-light)' }}>
        <div className="container">
          <span className="badge badge-mint" style={{ marginBottom: '1rem' }}>
            Initiative Catalog
          </span>
          <h1
            className="display-sm"
            style={{
              maxWidth: '820px',
              margin: '0 auto 1.25rem auto',
              color: 'var(--text)'
            }}
          >
            Explore the Five MELD Initiatives
          </h1>
          <p
            className="body-lg"
            style={{
              maxWidth: '680px',
              margin: '0 auto 2rem auto',
              color: 'var(--text-muted)'
            }}
          >
            Each module addresses a crucial imbalance in our neighborhoods.
            Select a pathway below to discover how you can participate as a contributor or beneficiary.
          </p>

          {/* Filter Chips */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              flexWrap: 'wrap'
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid',
                  borderColor: activeFilter === cat ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: activeFilter === cat ? 'var(--primary)' : '#FFFFFF',
                  color: activeFilter === cat ? '#FFFFFF' : 'var(--text)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE DETAIL TILES */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {filteredModules.map((mod) => (
              <div
                key={mod.id}
                id={mod.id}
                className="card-surface"
                style={{
                  borderLeft: `6px solid ${mod.accentColor}`,
                  padding: '2.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2.5rem',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: `${mod.accentColor}18`,
                        color: mod.accentColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span className="material-symbols-outlined fill" style={{ fontSize: '24px' }}>
                        {mod.iconName}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: `${mod.accentColor}15`,
                        color: mod.accentColor
                      }}
                    >
                      {mod.category}
                    </span>
                  </div>

                  <h2 className="headline-md" style={{ marginBottom: '0.35rem' }}>
                    {mod.title}
                  </h2>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: mod.accentColor,
                      textTransform: 'uppercase',
                      marginBottom: '1rem'
                    }}
                  >
                    {mod.tagline}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                    {mod.description}
                  </p>

                  <Link to="/register">
                    <Button variant="primary" size="md" iconRight={<ArrowRight size={16} />}>
                      Join {mod.title}
                    </Button>
                  </Link>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--surface-alt)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.75rem',
                    border: '1px solid var(--border)'
                  }}
                >
                  <h4
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      marginBottom: '1rem',
                      color: 'var(--text)'
                    }}
                  >
                    How You Can Participate:
                  </h4>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: mod.accentColor, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      What you can offer:
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {mod.canOffer.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text)' }}>
                          <Check size={15} style={{ color: mod.accentColor }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      What you receive:
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {mod.canReceive.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text)' }}>
                          <Check size={15} style={{ color: 'var(--primary)' }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Explore;
