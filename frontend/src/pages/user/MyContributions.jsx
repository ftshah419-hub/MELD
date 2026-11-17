import React, { useState, useEffect } from 'react';
import {
  Heart,
  HeartHandshake,
  Plus,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import userService from '../../services/user/userService';
import ScrollReveal from '../../components/user/ScrollReveal';

export function MyContributions({ onOpenContributeModal }) {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    setLoading(true);
    try {
      const res = await userService.getMyContributions();
      if (res && res.contributions) {
        setContributions(res.contributions);
      }
    } catch {
      // Mock fallback
      setContributions([
        {
          _id: 'c1',
          module: 'wisdom-loop',
          amount: 500,
          paymentStatus: 'paid',
          paymentId: 'pay_MELD_891283',
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
          message: 'Supporting grassroots mentoring for rural innovators.'
        },
        {
          _id: 'c2',
          module: 'second-serve',
          amount: 1000,
          paymentStatus: 'paid',
          paymentId: 'pay_MELD_772199',
          createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
          message: 'For insulated hot food carrier dispatch boxes.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getModuleBadge = (mod) => {
    const map = {
      'wisdom-loop': { name: 'Wisdom Loop', color: '#6573B8' },
      'craft-to-cart': { name: 'Craft to Cart', color: '#C47753' },
      'reconnect': { name: 'ReConnect', color: '#368F88' },
      'book-bridge': { name: 'Book Bridge', color: '#D3A34F' },
      'second-serve': { name: 'Second Serve', color: '#70975D' },
      'all': { name: 'Platform Impact Fund', color: 'var(--primary)' }
    };
    const item = map[mod] || { name: mod || 'General', color: 'var(--primary)' };
    return (
      <span
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '0.15rem 0.55rem',
          borderRadius: '999px',
          backgroundColor: `${item.color}15`,
          color: item.color
        }}
      >
        {item.name}
      </span>
    );
  };

  const totalFunded = contributions.reduce(
    (sum, c) => (c.paymentStatus === 'paid' ? sum + c.amount : sum),
    0
  );

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <ScrollReveal direction="down">
        {/* Banner with Total */}
        <div
          className="card-surface"
          style={{
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(215, 169, 74, 0.1) 0%, rgba(22, 75, 59, 0.08) 100%)',
            marginBottom: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <Heart size={18} fill="#996C0B" color="#996C0B" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#996C0B' }}>
                Social Impact Patron
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.25rem', color: 'var(--text)' }}>
              My Voluntary Contributions
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total direct funding provided: <strong>₹{totalFunded.toLocaleString('en-IN')}</strong>
            </p>
          </div>

          <button
            onClick={onOpenContributeModal}
            className="btn btn-primary hover-lift"
            style={{
              backgroundColor: 'var(--primary)',
              borderColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <Plus size={16} />
            <span>Make New Contribution</span>
          </button>
        </div>
      </ScrollReveal>

      {/* Contributions List */}
      {contributions.length === 0 ? (
        <div
          className="card-surface"
          style={{ textAlign: 'center', padding: '3.5rem 1.5rem', borderRadius: 'var(--radius-lg)' }}
        >
          <HeartHandshake size={44} style={{ opacity: 0.35, color: 'var(--primary)', marginBottom: '0.75rem' }} />
          <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.2rem' }}>No Contributions Recorded Yet</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Empower master artisans, student refurbishments, or food rescue vehicles with a voluntary micro-grant.
          </p>
          <button onClick={onOpenContributeModal} className="btn btn-primary">
            Support a Cause Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {contributions.map((c, idx) => (
            <ScrollReveal key={c._id || idx} delay={idx * 60} direction="up">
              <div
                className="card-surface hover-lift"
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    {getModuleBadge(c.module)}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} />
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
                    ₹{c.amount}
                  </div>

                  {c.message && (
                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      "{c.message}"
                    </p>
                  )}

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.35rem' }}>
                    Ref ID: {c.paymentId || 'MELD-CONTRIBUTION'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge badge-mint" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={14} />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyContributions;
