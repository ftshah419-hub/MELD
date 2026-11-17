import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Eye, Truck, CheckCircle2, Clock } from 'lucide-react';
import adminPaymentService from '../../services/admin/adminPaymentService';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminDataTable from '../../components/admin/AdminDataTable';
import StatusBadge from '../../components/admin/StatusBadge';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({ orderStatus: 'all', paymentStatus: 'all' });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminPaymentService.getOrders({
        page: pagination.page,
        limit: pagination.limit,
        orderStatus: filterValues.orderStatus,
        paymentStatus: filterValues.paymentStatus,
        search: searchTerm
      });
      setOrders(res.orders || []);
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filterValues, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterChange = (key, val) => {
    setFilterValues((prev) => ({ ...prev, [key]: val }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterValues({ orderStatus: 'all', paymentStatus: 'all' });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const filterOptions = [
    {
      key: 'orderStatus',
      options: [
        { label: 'Order: All Statuses', value: 'all' },
        { label: 'Order Placed', value: 'PLACED' },
        { label: 'Processing at Guild', value: 'PROCESSING' },
        { label: 'In Transit (Shipped)', value: 'SHIPPED' },
        { label: 'Delivered to Buyer', value: 'DELIVERED' },
        { label: 'Cancelled Orders', value: 'CANCELLED' }
      ]
    },
    {
      key: 'paymentStatus',
      options: [
        { label: 'Payment: All', value: 'all' },
        { label: 'Payment Completed', value: 'COMPLETED' },
        { label: 'Payment Pending', value: 'PENDING' },
        { label: 'Payment Failed', value: 'FAILED' }
      ]
    }
  ];

  const columns = [
    {
      header: 'Order Reference',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
            #{String(r._id).slice(-8).toUpperCase()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {new Date(r.createdAt).toLocaleString()}
          </div>
        </div>
      )
    },
    {
      header: 'Buyer Details',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.buyerId?.fullName || 'Community Buyer'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.buyerId?.email}</div>
        </div>
      )
    },
    {
      header: 'Purchased Items',
      render: (r) => (
        <span style={{ fontSize: '0.825rem' }}>
          {r.items?.length || 0} item(s) • {r.items?.[0]?.productId?.title || 'Artisan Goods'}
        </span>
      )
    },
    {
      header: 'Total Value',
      render: (r) => (
        <span style={{ fontWeight: 700, color: 'var(--text)' }}>
          ₹{r.totalAmount?.toLocaleString()}
        </span>
      )
    },
    { header: 'Payment', render: (r) => <StatusBadge status={r.paymentStatus} size="sm" /> },
    { header: 'Fulfillment', render: (r) => <StatusBadge status={r.orderStatus} /> },
    {
      header: 'Inspection',
      align: 'right',
      render: (r) => (
        <button
          onClick={() => setSelectedOrder(r)}
          style={{
            padding: '0.35rem 0.65rem',
            borderRadius: '4px',
            backgroundColor: 'var(--mint)',
            color: 'var(--primary)',
            border: '1px solid var(--border)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <Eye size={13} /> Details
        </button>
      )
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
          Craft to Cart Orders & Fulfillment
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Live monitoring of handmade artisanal purchases, fulfillment pipelines, and delivery confirmations.
        </p>
      </div>

      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter orders by ID or buyer name..."
        filterOptions={filterOptions}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <AdminDataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        emptyMessage="No artisan orders found matching criteria."
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      {/* Order Snapshot Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(18, 30, 24, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                  Order Snapshot #{String(selectedOrder._id).slice(-8).toUpperCase()}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <StatusBadge status={selectedOrder.orderStatus} />
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.825rem' }}>
              <div><strong>Buyer:</strong> {selectedOrder.buyerId?.fullName} ({selectedOrder.buyerId?.email})</div>
              <div style={{ marginTop: '0.25rem' }}>
                <strong>Shipping Destination:</strong> {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Purchased Line Items
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span>{item.productId?.title || 'Handmade Product'} (x{item.quantity})</span>
                    <span style={{ fontWeight: 600 }}>₹{item.priceAtPurchase * item.quantity}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700, paddingTop: '0.5rem', color: 'var(--primary)' }}>
                  <span>Total Amount Paid</span>
                  <span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Close Snapshot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
