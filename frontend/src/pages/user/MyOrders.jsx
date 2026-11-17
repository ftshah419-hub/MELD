import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  ExternalLink,
  MapPin,
  Calendar
} from 'lucide-react';
import userService from '../../services/user/userService';
import ScrollReveal from '../../components/user/ScrollReveal';

export function MyOrders({ onNavigateCatalog }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await userService.getMyOrders();
      if (res && res.orders) {
        setOrders(res.orders);
      }
    } catch {
      // Mock fallback
      setOrders([
        {
          _id: 'ord_918231',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          totalAmount: 1850,
          status: 'shipped',
          items: [
            {
              title: 'Ikat Silk-Cotton Stole',
              quantity: 1,
              price: 1850,
              imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=150&q=80'
            }
          ],
          shippingAddress: {
            city: 'Bengaluru',
            state: 'Karnataka'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this artisan order?')) return;
    try {
      await userService.cancelOrder(orderId);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    }
  };

  const getOrderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="badge badge-mint">Delivered</span>;
      case 'shipped':
        return <span className="badge" style={{ backgroundColor: 'rgba(54, 143, 136, 0.15)', color: '#368F88' }}>In Transit</span>;
      case 'processing':
      case 'paid':
        return <span className="badge badge-gold">Artisan Preparing</span>;
      case 'cancelled':
        return <span className="badge" style={{ backgroundColor: 'rgba(186, 26, 26, 0.12)', color: 'var(--error)' }}>Cancelled</span>;
      default:
        return <span className="badge badge-surface">{status}</span>;
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <ScrollReveal direction="down">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.35rem', color: 'var(--text)' }}>
            My Artisan Orders
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Direct fair-trade purchases supporting traditional craft guilds and rural master makers.
          </p>
        </div>
      </ScrollReveal>

      {orders.length === 0 ? (
        <div
          className="card-surface"
          style={{ textAlign: 'center', padding: '3.5rem 1.5rem', borderRadius: 'var(--radius-lg)' }}
        >
          <Package size={44} style={{ opacity: 0.35, color: '#C47753', marginBottom: '0.75rem' }} />
          <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.2rem' }}>No Orders Placed Yet</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Discover unique handmade treasures from verified artisan families across India.
          </p>
          <button
            onClick={onNavigateCatalog}
            className="btn btn-primary"
            style={{ backgroundColor: '#C47753', borderColor: '#C47753' }}
          >
            Explore Craft Catalog
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((ord, idx) => (
            <ScrollReveal key={ord._id || idx} delay={idx * 70} direction="up">
              <div
                className="card-surface hover-lift"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden'
                }}
              >
                {/* Order Top Bar */}
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    backgroundColor: 'var(--surface-alt)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      Order #{ord._id?.slice(-8).toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={13} />
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#C47753', fontFamily: 'var(--font-heading)' }}>
                      ₹{ord.totalAmount}
                    </div>
                    {getOrderStatusBadge(ord.status)}
                  </div>
                </div>

                {/* Items */}
                <div style={{ padding: '1.25rem' }}>
                  {(ord.items || []).map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        marginBottom: i < (ord.items?.length || 1) - 1 ? '1rem' : 0
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            style={{ width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Qty: {item.quantity} • ₹{item.price} each
                          </div>
                        </div>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}

                  {/* Order Footer & Actions */}
                  <div
                    style={{
                      marginTop: '1.25rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} />
                      Shipping destination: {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                    </div>

                    {ord.status === 'processing' && (
                      <button
                        onClick={() => handleCancelOrder(ord._id)}
                        className="btn btn-outline"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', color: 'var(--error)', borderColor: 'rgba(186, 26, 26, 0.3)' }}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
