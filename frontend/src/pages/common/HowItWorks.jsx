import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import {
  Compass,
  FileEdit,
  UserCheck,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export function HowItWorks() {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    {
      num: '01',
      title: 'Discover Local Community Needs',
      subtitle: 'Identify opportunities matching your skills and resources',
      desc: 'Browse verified listings across your neighborhood or city. Whether a rural student needs laptop refurbishment, a young designer seeks mentorship, or a shelter needs evening meals, live needs are categorized by proximity and urgency.',
      icon: <Compass size={28} style={{ color: 'var(--wisdom)' }} />,
      color: 'var(--wisdom)'
    },
    {
      num: '02',
      title: 'Offer What You Have or Request Help',
      subtitle: 'Zero complex red tape, dignified direct listings',
      desc: 'Create an offering in under two minutes. List your mentorship availability, donate an idle gadget, share surplus event food, or register as a traditional artisan. If you are in need, submit a request with complete dignity.',
      icon: <FileEdit size={28} style={{ color: 'var(--craft)' }} />,
      color: 'var(--craft)'
    },
    {
      num: '03',
      title: 'Connect Through Direct Matching',
      subtitle: 'Verified members and community coordinators',
      desc: 'Our matching algorithm pairs donors with certified beneficiaries, students with mentors, and conscious consumers with craftspeople. In-app messaging and coordination tools ensure privacy and safety.',
      icon: <UserCheck size={28} style={{ color: 'var(--reconnect)' }} />,
      color: 'var(--reconnect)'
    },
    {
      num: '04',
      title: 'Create Verified Collective Impact',
      subtitle: 'Transparent outcomes and circular metrics',
      desc: 'Every completed exchange logs a verifiable milestone: kilograms of food saved from landfills, devices rehomed, mentorship hours completed, or artisan livelihood generated. Impact is shared with you in real time.',
      icon: <CheckCircle size={28} style={{ color: 'var(--food)' }} />,
      color: 'var(--food)'
    }
  ];

  const faqs = [
    {
      q: 'Is MELD free to use for community members?',
      a: 'Yes! MELD is 100% free for all community members, donors, mentors, students, and food shelters. Artisans on Craft to Cart receive direct customer payments for their crafts with no extortionate platform cuts.'
    },
    {
      q: 'How does MELD verify food safety in Second Serve?',
      a: 'All food donations must adhere to standard freshness guidelines and time limits. Donations are scheduled for prompt volunteer pickup (typically within 45 minutes) and distributed immediately to verified community kitchens.'
    },
    {
      q: 'What happens to my personal data on donated computers in ReConnect?',
      a: 'All donated computers and tablets undergo certified NIST-standard cryptographic data wiping by verified technical volunteers before refurbishment or school delivery.'
    },
    {
      q: 'How do I become a mentor in Wisdom Loop?',
      a: 'Simply register for a community account, indicate your areas of expertise (industry, craft, life advice, academics), and set your available hours. Mentees will be matched based on mutual interests.'
    },
    {
      q: 'Can organizations or college clubs participate as partners?',
      a: 'Absolutely! NGOs, university student chapters, corporate sustainability committees, and restaurant chains can partner with MELD to run localized drives.'
    }
  ];

  return (
    <div className="how-it-works-page">
      {/* HEADER SECTION */}
      <section className="section-hero" style={{ textAlign: 'center', backgroundColor: 'var(--mint-light)' }}>
        <div className="container">
          <span className="badge badge-mint" style={{ marginBottom: '1rem' }}>
            Seamless Workflow
          </span>
          <h1
            className="display-sm"
            style={{
              maxWidth: '820px',
              margin: '0 auto 1.25rem auto',
              color: 'var(--text)'
            }}
          >
            How MELD Bridges Two Worlds
          </h1>
          <p
            className="body-lg"
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              color: 'var(--text-muted)'
            }}
          >
            A dignified, transparent 4-step framework connecting untapped potential with real human need.
          </p>
        </div>
      </section>

      {/* 4 STEPS DEEP DIVE */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className="card-surface"
                style={{
                  padding: '3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  borderLeft: `6px solid ${step.color}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: `${step.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          color: step.color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}
                      >
                        Step {step.num}
                      </span>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.45rem',
                          fontWeight: 700,
                          color: 'var(--text)'
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '840px' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="section" style={{ backgroundColor: 'var(--surface-alt)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-mint" style={{ marginBottom: '0.85rem' }}>
              Common Inquiries
            </span>
            <h2 className="headline-lg">Frequently Asked Questions</h2>
          </div>

          <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="card-surface"
                  style={{
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'border-color var(--transition-fast)'
                  }}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <h4
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--text)'
                      }}
                    >
                      {faq.q}
                    </h4>
                    <ChevronDown
                      size={20}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform var(--transition-fast)',
                        color: 'var(--primary)',
                        flexShrink: 0
                      }}
                    />
                  </div>

                  {isOpen && (
                    <div
                      className="animate-slide-down"
                      style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                        fontSize: '0.925rem',
                        lineHeight: 1.65
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="headline-lg" style={{ marginBottom: '1rem' }}>
              Experience the Impact Today
            </h2>
            <p className="body-md" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Signing up takes less than a minute. No obligations, just genuine community connections.
            </p>
            <Link to="/register">
              <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
                Join the MELD Network
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HowItWorks;
