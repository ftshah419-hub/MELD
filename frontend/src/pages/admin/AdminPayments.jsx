import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, CheckCircle, Clock, AlertTriangle, ShieldCheck, Download, Heart } from 'lucide-react';
import adminPaymentService from '../../services/admin/adminPaymentService';
import adminAnalyticsService from '../../services/admin/adminAnalyticsService';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminDataTable from '../../components/admin/AdminDataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminStatCard from '../../components/admin/AdminStatCard';

export function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({ totalVolume: 0, successVolume: 0, successCount: 0, pendingCount: 0, failedCount: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({ paymentType: 'all', module: 'all', status: 'all' });

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminPaymentService.getPayments({
        page: pagination.page,
        limit: pagination.limit,
        paymentType: filterValues.paymentType,
        module: filterValues.module,
        status: filterValues.status,
        search: searchTerm
      });
      setPayments(res.payments || []);
      setSummary(res.summary || {});
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filterValues, searchTerm]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleFilterChange = (key, val) => {
    setFilterValues((prev) => ({ ...prev, [key]: val }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterValues({ paymentType: 'all', module: 'all', status: 'all' });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const filterOptions = [
    {
      key: 'paymentType',
      options: [
        { label: 'Type: All Payments', value: 'all' },
        { label: 'Craft to Cart Purchases (Compulsory)', value: 'PRODUCT_PURCHASE' },
        { label: 'Social Contributions (Voluntary)', value: 'VOLUNTARY_CONTRIBUTION' }
      ]
    },
    {
      key: 'module',
      options: [
        { label: 'Module: All Hubs', value: 'all' },
        { label: 'Wisdom Loop', value: 'WISDOM_LOOP' },
        { label: 'Craft to Cart', value: 'CRAFT_TO_CART' },
        { label: 'ReConnect', value: 'RECONNECT' },
        { label: 'Book Bridge', value: 'BOOK_BRIDGE' },
        { label: 'Second Serve', value: 'SECOND_SERVE' }
      ]
    },
    {
      key: 'status',
      options: [
        { label: 'Status: All', value: 'all' },
        { label: 'Successful (Verified)', value: 'SUCCESS' },
        { label: 'Pending Settlement', value: 'PENDING' },
        { label: 'Failed Gateway Transactions', value: 'FAILED' },
        { label: 'Refunded Transactions', value: 'REFUNDED' }
      ]
    }
  ];

  const columns = [
    {
      header: 'Gateway Reference',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>
            {r.razorpayPaymentId || r.razorpayOrderId}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            Internal ID: {String(r._id).slice(-8)} • {new Date(r.createdAt).toLocaleString()}
          </div>
        </div>
      )
    },
    {
      header: 'Category / Purpose',
      render: (r) => (
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: r.paymentType === 'PRODUCT_PURCHASE' ? 'rgba(196, 119, 83, 0.15)' : 'var(--mint)',
              color: r.paymentType === 'PRODUCT_PURCHASE' ? '#9d4a25' : 'var(--primary)'
            }}
          >
            {r.paymentType === 'PRODUCT_PURCHASE' ? 'Craft Purchase' : 'Voluntary Gift'}
          </span>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Module: {r.module?.replace('_', ' ')}
          </div>
        </div>
      )
    },
    {
      header: 'Transactor',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.userId?.fullName || 'Community Member'}</div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{r.userId?.email}</div>
        </div>
      )
    },
    {
      header: 'Amount',
      render: (r) => (
        <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.95rem' }}>
          ₹{r.amount?.toLocaleString()} {r.currency || 'INR'}
        </span>
      )
    },
    {
      header: 'Ledger Status',
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
          Consolidated Payments Ledger & Reconciliation
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Cryptographically verified transactions via Razorpay webhook synchronization. Product orders and voluntary giving are strictly demarcated.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <AdminStatCard
          title="Verified Volume"
          value={`₹${(summary.successVolume || 0).toLocaleString()}`}
          subText={`${summary.successCount || 0} settled transactions`}
          icon={<CheckCircle size={20} />}
          iconBg="rgba(32, 109, 57, 0.15)"
          iconColor="#2e7d32"
          accentColor="#2e7d32"
        />
        <AdminStatCard
          title="Total Gross Transacted"
          value={`₹${(summary.totalVolume || 0).toLocaleString()}`}
          subText="Across all active modules"
          icon={<CreditCard size={20} />}
          iconBg="var(--mint)"
          iconColor="var(--primary)"
          accentColor="var(--primary)"
        />
        <AdminStatCard
          title="Pending Gateways"
          value={String(summary.pendingCount || 0)}
          subText="Awaiting bank callback"
          icon={<Clock size={20} />}
          iconBg="rgba(215, 169, 74, 0.2)"
          iconColor="#8d6308"
          accentColor="#8d6308"
        />
        <AdminStatCard
          title="Failed Attempts"
          value={String(summary.failedCount || 0)}
          subText="Customer dropoff or decline"
          icon={<AlertTriangle size={20} />}
          iconBg="var(--error-surface)"
          iconColor="var(--error)"
          accentColor="var(--error)"
        />
      </div>

      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter by Razorpay order, payment, or receipt number..."
        filterOptions={filterOptions}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        onExport={() => window.open(adminAnalyticsService.getExportUrl('payments'), '_blank')}
        exportLabel="Export Ledger CSV"
      />

      <AdminDataTable
        columns={columns}
        data={payments}
        isLoading={isLoading}
        emptyMessage="No payment transactions found matching ledger criteria."
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />
    </div>
  );
}

export default AdminPayments;
