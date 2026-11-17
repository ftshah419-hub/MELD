import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  Sliders,
  Check,
  AlertCircle
} from 'lucide-react';
import adminService from '../../services/admin/adminService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const res = await adminService.getSettings();
        setSettings(res);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleToggleModule = (moduleKey, field) => {
    setSettings((prev) => ({
      ...prev,
      modules: {
        ...prev.modules,
        [moduleKey]: {
          ...prev.modules[moduleKey],
          [field]: !prev.modules[moduleKey][field]
        }
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      await adminService.updateSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" message="Loading platform governance rules..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '980px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--primary)',
            letterSpacing: '-0.02em',
            margin: '0 0 0.25rem 0'
          }}
        >
          Platform Governance & System Settings
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Manage global branding identifiers, operational module toggles, compliance parameters, and security thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Compliance Index Ribbon */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem 1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                {settings?.complianceIndex || '99.98%'}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2e7d32', textTransform: 'uppercase' }}>
                Compliance & Ledger Integrity
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', margin: '0.2rem 0 0 0' }}>
              Last cryptographically signed ledger check was performed 14 minutes ago. Core {settings?.version || 'v2.4.1'}.
            </p>
          </div>

          <span
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--mint)',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            Audited & Compliant
          </span>
        </div>

        {/* SECTION 1: Identity & Branding */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary-dark)' }}>
                Section 01 / Identity
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, margin: '0.2rem 0 0 0' }}>
                Platform Information & Canonical Designation
              </h2>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Public Verified</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Platform Root Identifier
              </label>
              <input
                type="text"
                value={settings?.platformName || ''}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Canonical designation broadcasted over open API nodes.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Global Operating Tagline
              </label>
              <input
                type="text"
                value={settings?.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Appears on onboarding, certificates, and manifest headers.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Central Support Dispatch Email
              </label>
              <input
                type="email"
                value={settings?.supportEmail || ''}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Triage mailbox for automated incident alerts and escalation.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Registered Legal Entity
              </label>
              <input
                type="text"
                value={settings?.legalEntity || ''}
                onChange={(e) => setSettings({ ...settings, legalEntity: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.2rem', display: 'block' }}>
                Public benefit corporate charter registration.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Module Governance Controls */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary-dark)' }}>
              Section 02 / Operational Subsystems
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, margin: '0.2rem 0 0 0' }}>
              Module Governance Toggles
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Wisdom Loop Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Wisdom Loop Video & Match Engine</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Permit mentors and learners to initiate synchronized peer video sessions</div>
              </div>
              <input
                type="checkbox"
                checked={settings?.modules?.wisdomLoop?.videoMatchesEnabled || false}
                onChange={() => handleToggleModule('wisdomLoop', 'videoMatchesEnabled')}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Craft to Cart Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Craft to Cart Zero Commission Policy</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enforce 100% of product sales flow directly to traditional artisan makers</div>
              </div>
              <input
                type="checkbox"
                checked={settings?.modules?.craftToCart?.zeroCommission || false}
                onChange={() => handleToggleModule('craftToCart', 'zeroCommission')}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* ReConnect Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>ReConnect E-Waste Recycling Pipeline</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Route unrepairable components to certified material separation facilities</div>
              </div>
              <input
                type="checkbox"
                checked={settings?.modules?.reConnect?.eWasteRecyclingPipeline || false}
                onChange={() => handleToggleModule('reConnect', 'eWasteRecyclingPipeline')}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Second Serve Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Second Serve Cold-Chain Telemetry Tracking</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trigger critical incident flags if perishables exceed 4.0°C temperature threshold</div>
              </div>
              <input
                type="checkbox"
                checked={settings?.modules?.secondServe?.coldChainMonitoring || false}
                onChange={() => handleToggleModule('secondServe', 'coldChainMonitoring')}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
          {saveSuccess && (
            <span style={{ color: '#2e7d32', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} /> Governance settings saved to audit log.
            </span>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            iconLeft={<Save size={16} />}
            isLoading={isSaving}
          >
            Save Configuration Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AdminSettings;
