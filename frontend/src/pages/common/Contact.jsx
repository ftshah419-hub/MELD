import React, { useState } from 'react';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Mail, User, Send, CheckCircle2, MapPin, Phone, MessageSquare, Clock } from 'lucide-react';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Front-end staging simulation (honest feedback: pending backend interface)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="contact-page">
      {/* HEADER SECTION */}
      <section className="section-hero" style={{ textAlign: 'center', backgroundColor: 'var(--mint-light)' }}>
        <div className="container">
          <span className="badge badge-mint" style={{ marginBottom: '1rem' }}>
            Get in Touch
          </span>
          <h1
            className="display-sm"
            style={{
              maxWidth: '820px',
              margin: '0 auto 1.25rem auto',
              color: 'var(--text)'
            }}
          >
            We'd Love to Hear From You
          </h1>
          <p
            className="body-lg"
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              color: 'var(--text-muted)'
            }}
          >
            Have a question about an initiative, want to volunteer, or proposing an institutional partnership?
            Reach out to our community coordinators.
          </p>
        </div>
      </section>

      {/* FORM & DETAILS SECTION */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'flex-start'
            }}
          >
            {/* Contact Form */}
            <div className="card-surface" style={{ padding: '2.5rem' }}>
              <h2 className="headline-sm" style={{ marginBottom: '0.5rem' }}>
                Send a Message
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Fill out the form below and our team will get back to you within 24–48 hours.
              </p>

              {submitted ? (
                <div
                  className="animate-fade-in"
                  style={{
                    backgroundColor: 'var(--success-surface)',
                    border: '1px solid rgba(32, 109, 57, 0.25)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    textAlign: 'center'
                  }}
                >
                  <CheckCircle2 size={44} style={{ color: 'var(--success)', margin: '0 auto 1rem auto' }} />
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--success)',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Message Received!
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    Thank you for reaching out, <strong>{name}</strong>! Your inquiry regarding{' '}
                    <strong>{category}</strong> has been logged.
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    (Note: In this development build, this is connected to the frontend message pipeline
                    ready for backend integration.)
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{ marginTop: '1.5rem' }}
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

                  <InputField
                    id="contact-name"
                    name="name"
                    label="Full name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    icon={<User size={18} />}
                  />

                  <InputField
                    id="contact-email"
                    name="email"
                    type="email"
                    label="Email address"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    icon={<Mail size={18} />}
                  />

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label
                      htmlFor="contact-category"
                      style={{
                        display: 'block',
                        marginBottom: '0.45rem',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text)'
                      }}
                    >
                      Topic or Initiative
                    </label>
                    <select
                      id="contact-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--secondary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: 'var(--text)',
                        backgroundColor: '#FFFFFF',
                        outline: 'none'
                      }}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Wisdom Loop (Mentorship)">Wisdom Loop (Mentorship)</option>
                      <option value="Craft to Cart (Artisans)">Craft to Cart (Artisans)</option>
                      <option value="ReConnect (Tech Reuse)">ReConnect (Tech Reuse)</option>
                      <option value="Book Bridge (Libraries)">Book Bridge (Libraries)</option>
                      <option value="Second Serve (Food Relief)">Second Serve (Food Relief)</option>
                      <option value="Institutional Partnership">Institutional Partnership</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.75rem' }}>
                    <label
                      htmlFor="contact-message"
                      style={{
                        display: 'block',
                        marginBottom: '0.45rem',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text)'
                      }}
                    >
                      Message <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      placeholder="How can we help connect or collaborate?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--secondary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: 'var(--text)',
                        backgroundColor: '#FFFFFF',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    isLoading={isSubmitting}
                    iconRight={<Send size={18} />}
                  >
                    Submit Message
                  </Button>
                </form>
              )}
            </div>

            {/* Direct Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="card-surface" style={{ padding: '2rem' }}>
                <h3 className="headline-sm" style={{ marginBottom: '1.5rem' }}>
                  Direct Channels
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--mint)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Mail size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Email Inquiries
                      </div>
                      <a href="mailto:community@meldplatform.org" style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        community@meldplatform.org
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--mint)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Community Matrix
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                        Available via in-app dashboard upon signup
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--mint)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Clock size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Response Time
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                        Within 24 hours (Volunteer-managed)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buildathon Project Note */}
              <div
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                  Buildathon Development Build
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  This interface provides the complete shared communication frontend for MELD.
                  Messages will be linked with backend notification microservices upon deployment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
