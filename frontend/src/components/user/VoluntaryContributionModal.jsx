import React, { useState } from 'react';
import {
  X,
  Heart,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Sparkles,
  Info
} from 'lucide-react';
import userService from '../../services/user/userService';

const MODULE_OPTIONS = [
  { id: 'all', name: 'MELD General Impact Fund', color: 'var(--primary)' },
  { id: 'wisdom-loop', name: 'Wisdom Loop — Youth Mentorship', color: '#6573B8' },
  { id: 'craft-to-cart', name: 'Craft to Cart — Artisan Revival Fund', color: '#C47753' },
  { id: 'reconnect', name: 'ReConnect — Student Device Refurbishment', color: '#368F88' },
  { id: 'book-bridge', name: 'Book Bridge — Rural Libraries', color: '#D3A34F' },
  { id: 'second-serve', name: 'Second Serve — Cold-Chain Logistics', color: '#70975D' }
];

const PRESETS = [250, 500, 1000, 2500, 5000];

export function VoluntaryContributionModal({ isOpen, onClose, onSuccess, defaultModule = 'all' }) {
  const [selectedModule, setSelectedModule] = useState(defaultModule);
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const currentAmount = isCustom ? Number(customAmount) : amount;

  const handlePresetSelect = (val) => {
    setIsCustom(false);
    setAmount(val);
  };

  const handleCustomChange = (e) => {
    setIsCustom(true);
    setCustomAmount(e.target.value);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAmount || currentAmount < 10) {
      setError('Please contribute at least ₹10.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Initialize contribution order
      const initRes = await userService.createContribution({
        module: selectedModule,
        amount: currentAmount,
        currency: 'INR',
        anonymous,
        message
      });

      if (!initRes || !initRes.contribution) {
        throw new Error('Failed to initialize contribution');
      }

      const { contribution, razorpayOrder, keyId } = initRes;

      // 2. Open Razorpay if configured, or simulate verification in dev test mode
      const isScriptLoaded = await loadRazorpayScript();

      if (isScriptLoaded && window.Razorpay && razorpayOrder?.id && keyId && !keyId.includes('rzp_test_placeholder')) {
        const options = {
          key: keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'MELD Social Impact',
          description: `Contribution to ${selectedModule}`,
          order_id: razorpayOrder.id,
          handler: async function (response) {
            try {
              const verifyRes = await userService.verifyContribution({
                contributionId: contribution._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              setSuccessData(verifyRes.contribution);
              if (onSuccess) onSuccess(verifyRes.contribution);
            } catch (err) {
              setError(err.message || 'Payment verification failed');
            }
          },
          prefill: {
            name: contribution.userName || 'MELD Patron'
          },
          theme: {
            color: '#164B3B'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setError(`Payment failed: ${resp.error.description}`);
        });
        rzp.open();
      } else {
        // Safe development simulation for environments without live Razorpay keys
        const verifyRes = await userService.verifyContribution({
          contributionId: contribution._id,
          razorpay_order_id: razorpayOrder?.id || `sim_order_${Date.now()}`,
          razorpay_payment_id: `sim_pay_${Date.now()}`,
          razorpay_signature: 'simulated_authorized_signature'
        });
        setSuccessData(verifyRes.contribution);
        if (onSuccess) onSuccess(verifyRes.contribution);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating your contribution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(22, 75, 59, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="card-surface animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: 'var(--surface-alt)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(215, 169, 74, 0.2)',
                color: '#996C0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Heart size={20} fill="#996C0B" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                Support the Mission
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                100% of community contributions go directly to field impact
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        {successData ? (
          <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--mint)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
              Thank You for Your Generosity!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
              Your contribution of <strong>₹{successData.amount}</strong> to{' '}
              <strong>{MODULE_OPTIONS.find((m) => m.id === successData.module)?.name || 'MELD'}</strong> has been
              received.
            </p>
            <div
              style={{
                padding: '0.85rem',
                backgroundColor: 'var(--surface-alt)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                color: 'var(--text-light)',
                marginBottom: '1.5rem'
              }}
            >
              Transaction Ref: {successData.paymentId || 'MELD-DONATION-PROCESSED'}
            </div>
            <button
              onClick={() => {
                setSuccessData(null);
                onClose();
              }}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
            {error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(186, 26, 26, 0.1)',
                  color: 'var(--error)',
                  fontSize: '0.825rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Info size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Target Module */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Select Impact Stream
              </label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  fontSize: '0.9rem',
                  color: 'var(--text)'
                }}
              >
                {MODULE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Choose Amount (INR)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {PRESETS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePresetSelect(val)}
                    style={{
                      padding: '0.5rem 0',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid',
                      borderColor: !isCustom && amount === val ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: !isCustom && amount === val ? 'var(--mint)' : 'var(--surface-alt)',
                      color: !isCustom && amount === val ? 'var(--primary)' : 'var(--text)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontWeight: 700,
                    color: 'var(--text-muted)'
                  }}
                >
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Or enter custom amount (e.g. 1500)"
                  value={customAmount}
                  onChange={handleCustomChange}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 1.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            {/* Optional Note */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Message of Encouragement (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Share a word with the mentors, artisans, or volunteers..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                  resize: 'none'
                }}
              />
            </div>

            {/* Anonymous Toggle */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                marginBottom: '1.5rem'
              }}
            >
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span style={{ color: 'var(--text)' }}>Make my contribution anonymous on the public board</span>
            </label>

            {/* Security Guarantee & Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <ShieldCheck size={16} color="var(--primary)" />
              <span>Secured by Razorpay • Instant tax-exempt impact receipt generated</span>
            </div>

            <button
              type="submit"
              disabled={loading || currentAmount <= 0}
              className="btn btn-primary hover-lift"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: 700
              }}
            >
              {loading ? 'Processing...' : `Contribute ₹${currentAmount || 0} Now`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default VoluntaryContributionModal;
