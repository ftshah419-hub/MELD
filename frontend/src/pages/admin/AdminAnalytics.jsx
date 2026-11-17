import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Recycle,
  HeartHandshake,
  Users,
  Utensils,
  Laptop,
  BookOpen
} from 'lucide-react';
import adminAnalyticsService from '../../services/admin/adminAnalyticsService';
import { LineChart, BarChart } from '../../components/admin/AdminChart';
import AdminStatCard from '../../components/admin/AdminStatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        const res = await adminAnalyticsService.getAnalytics();
        setAnalytics(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const handleExport = (type) => {
    const url = adminAnalyticsService.getExportUrl(type);
    window.open(url, '_blank');
  };

  const moduleDistData = (analytics?.moduleRequests || []).map((m) => {
    let color = 'var(--primary)';
    if (m._id === 'WISDOM_LOOP') color = '#6573B8';
    else if (m._id === 'CRAFT_TO_CART') color = '#C47753';
    else if (m._id === 'RECONNECT') color = '#368F88';
    else if (m._id === 'BOOK_BRIDGE') color = '#D3A34F';
    else if (m._id === 'SECOND_SERVE') color = '#70975D';

    return {
      label: (m._id || '').replace('_', ' ').slice(0, 10),
      value: m.total || 0,
      color
    };
  });

  const userTrendData = (analytics?.userGrowth || []).map((u) => ({
    label: (u._id || '').slice(5),
    value: u.count || 0
  }));

  return (
    <div className="animate-fade-in">
      {/* Top Command & Time Bar */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--mint)',
                color: 'var(--primary)',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              Unified Telemetry Matrix
            </span>
          </div>
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
            Reports, Impact & Circular Analytics
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            Aggregated platform telemetry measuring cross-sector circularity, direct artisan economic values, and inter-generational connections.
          </p>
        </div>

        {/* Quick Export Digest Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleExport('users')}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: '#ffffff',
              color: 'var(--text)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Download size={15} /> Export Users
          </button>
          <button
            onClick={() => handleExport('payments')}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: '#ffffff',
              color: 'var(--text)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Download size={15} /> Export Payments
          </button>
          <button
            onClick={() => handleExport('orders')}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Download size={15} /> Export Orders
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <LoadingSpinner size="lg" message="Aggregating ecosystem analytics..." />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* 4 Impact Stat Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem'
            }}
          >
            <AdminStatCard
              title="Circular Impact Diverted"
              value="37,340"
              unit="units"
              subText="+12.4% circular materials"
              icon={<Recycle size={20} />}
              iconBg="var(--mint)"
              iconColor="var(--primary)"
              accentColor="var(--primary)"
              trend="+12.4%"
            />
            <AdminStatCard
              title="Direct Artisan Value"
              value="₹2,40,500"
              subText="100% Zero-Take to Craftsmen"
              icon={<HeartHandshake size={20} />}
              iconBg="rgba(196, 119, 83, 0.15)"
              iconColor="#9d4a25"
              accentColor="#C47753"
              trend="+₹38.2k"
            />
            <AdminStatCard
              title="Meals Saved"
              value="25,000+"
              unit="servings"
              subText="Surplus food rescued"
              icon={<Utensils size={20} />}
              iconBg="rgba(112, 151, 93, 0.15)"
              iconColor="#456a34"
              accentColor="#70975D"
              trend="+18.5%"
            />
            <AdminStatCard
              title="Connection Index"
              value="98.4%"
              subText="Mentorship satisfaction rating"
              icon={<Users size={20} />}
              iconBg="rgba(101, 115, 184, 0.15)"
              iconColor="#43529d"
              accentColor="#6573B8"
              trend="+3.2%"
            />
          </div>

          {/* Visual Charts Grid (2 Columns) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {/* Chart 1: 30-Day User Growth Curve */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                    Member Enrollment Velocity
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Daily member registrations over the trailing 30 days
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--mint)',
                    color: 'var(--primary)'
                  }}
                >
                  Active Ingestion
                </span>
              </div>

              <LineChart
                data={userTrendData.length > 0 ? userTrendData : [
                  { label: 'Nov 1', value: 8 },
                  { label: 'Nov 5', value: 14 },
                  { label: 'Nov 10', value: 20 },
                  { label: 'Nov 15', value: 34 },
                  { label: 'Nov 17', value: 48 }
                ]}
                height={220}
              />
            </div>

            {/* Chart 2: Cross-Module Requests Distribution */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                    Module Activity & Connection Share
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Exchange volume distributed across the 5 initiatives
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--surface-alt)',
                    color: 'var(--text-muted)'
                  }}
                >
                  Cross-Sector
                </span>
              </div>

              <BarChart
                data={moduleDistData.length > 0 ? moduleDistData : [
                  { label: 'Wisdom', value: 42, color: '#6573B8' },
                  { label: 'Craft', value: 68, color: '#C47753' },
                  { label: 'ReConnect', value: 35, color: '#368F88' },
                  { label: 'Books', value: 28, color: '#D3A34F' },
                  { label: 'Food', value: 85, color: '#70975D' }
                ]}
                height={220}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAnalytics;
