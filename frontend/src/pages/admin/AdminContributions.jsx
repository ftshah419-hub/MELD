import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Gift, Users, Info, ShieldCheck, Sparkles } from 'lucide-react';
import adminPaymentService from '../../services/admin/adminPaymentService';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminDataTable from '../../components/admin/AdminDataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminStatCard from '../../components/admin/AdminStatCard';

export function AdminContributions() {
  const [contributions, setContributions] = useState([]);
  const [summary, setSummary] = useState({ totalContributionsCount: 0, aggregateTotalAmount: 0, moduleBreakdown: {} });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [filterValues, setFilterValues] = useState({ module: 'all' });

  const fetchContributions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminPaymentService.getContributions({
        page: pagination.page,
        limit: pagination.limit,
        module: filterValues.module
      });
      setContributions(res.contributions || []);
      setSummary(res.summary || { totalContributionsCount: 0, aggregateTotalAmount: 0, moduleBreakdown: {} });
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch contributions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filterValues]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const filterOptions = [
    {
      key: 'module',
      options: [
        { label: 'Destination: All Initiatives', value: 'all' },
        { label: 'Wisdom Loop Giving', value: 'WISDOM_LOOP' },
        { label: 'Craft to Cart Guild Giving', value: 'CRAFT_TO_CART' },
        { label: 'ReConnect Circular Fund', value: 'RECONNECT' },
        { label: 'Book Bridge Literacy Fund', value: 'BOOK_BRIDGE' },
        { label: 'Second Serve Food Rescue Fund', value: 'SECOND_SERVE' }
      ]
    }
  ];

  const columns = [
    {
      header: 'Contribution ID',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
            #{String(r._id).slice(-8).toUpperCase()}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            {new Date(r.createdAt).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      header: 'Impact Beneficiary Initiative',
      render: (r) => <StatusBadge status={r.module} size="sm" />
    },
    {
      header: 'Supporter / Donor',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.userId?.fullName || 'Anonymous Philanthropist'}</div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{r.userId?.email}</div>
        </div>
      )
    },
    {
      header: 'Voluntary Contribution',
      render: (r) => (
        <span style={{ fontWeight: 800, color: '#2e7d32', fontSize: '0.95rem' }}>
          ₹{r.amount?.toLocaleString()} INR
        </span>
      )
    },
    {
      header: 'Gateway Reference',
      render: (r) => (
        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
          {r.razorpayPaymentId || r.razorpayOrderId}
        </span>
      )
    },
    {
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />
    }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
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
          Voluntary Social Impact Contributions
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Tracking 100% voluntary social impact contributions supporting community programs across all five modules.
        </p>
      </div>

      {/* Non-Compulsory Notice Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'rgba(22, 75, 59, 0.08)',
          border: '1px solid var(--secondary)',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--primary)'
        }}
      >
        <Info size={18} style={{ flexShrink: 0 }} />
        <span>
          <strong>Social Impact Policy:</strong> Voluntary contributions are completely optional donations towards community initiatives. MELD does not charge commission fees, nor claim tax-exempt status without verified statutory NGO accreditation.
        </span>
      </div>

      {/* Module-Wise Giving Breakdown (5-up) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <AdminStatCard
          title="Wisdom Loop Giving"
          value={`₹${(summary.moduleBreakdown?.WISDOM_LOOP || 0).toLocaleString()}`}
          subText="Mentorship materials & equipment"
          icon={<Heart size={18} />}
          iconBg="rgba(101, 115, 184, 0.15)"
          iconColor="#43529d"
          accentColor="#6573B8"
        />
        <AdminStatCard
          title="Craft to Cart Guild Fund"
          value={`₹${(summary.moduleBreakdown?.CRAFT_TO_CART || 0).toLocaleString()}`}
          subText="Raw materials & tools"
          icon={<Heart size={18} />}
          iconBg="rgba(196, 119, 83, 0.15)"
          iconColor="#9d4a25"
          accentColor="#C47753"
        />
        <AdminStatCard
          title="ReConnect Refurb Fund"
          value={`₹${(summary.moduleBreakdown?.RECONNECT || 0).toLocaleString()}`}
          subText="Repair parts & batteries"
          icon={<Heart size={18} />}
          iconBg="rgba(54, 143, 136, 0.15)"
          iconColor="#206862"
          accentColor="#368F88"
        />
        <AdminStatCard
          title="Book Bridge Literacy Fund"
          value={`₹${(summary.moduleBreakdown?.BOOK_BRIDGE || 0).toLocaleString()}`}
          subText="School libraries & binding"
          icon={<Heart size={18} />}
          iconBg="rgba(211, 163, 79, 0.15)"
          iconColor="#8f681a"
          accentColor="#D3A34F"
        />
        <AdminStatCard
          title="Second Serve Cold Chain"
          value={`₹${(summary.moduleBreakdown?.SECOND_SERVE || 0).toLocaleString()}`}
          subText="Insulated crates & delivery fuel"
          icon={<Heart size={18} />}
          iconBg="rgba(112, 151, 93, 0.15)"
          iconColor="#456a34"
          accentColor="#70975D"
        />
      </div>

      <AdminFilters
        filterOptions={filterOptions}
        filterValues={filterValues}
        onFilterChange={(key, val) => {
          setFilterValues((p) => ({ ...p, [key]: val }));
          setPagination((p) => ({ ...p, page: 1 }));
        }}
        onReset={() => {
          setFilterValues({ module: 'all' });
          setPagination((p) => ({ ...p, page: 1 }));
        }}
      />

      <AdminDataTable
        columns={columns}
        data={contributions}
        isLoading={isLoading}
        emptyMessage="No voluntary contributions registered matching criteria."
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />
    </div>
  );
}

export default AdminContributions;
