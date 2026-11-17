import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Truck,
  Heart,
  Palette,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  UserCheck
} from 'lucide-react';
import craftService from '../../../services/user/craftService';
import ScrollReveal from '../../../components/user/ScrollReveal';
import PhotoUploadField from '../../../components/user/PhotoUploadField';

const CRAFT_CATEGORIES = ['All', 'Handloom', 'Pottery', 'Woodwork', 'Metalcraft', 'Natural Fibers', 'Jewelry'];

export function CraftHub({ user, onNavigateOrders }) {
  const [activeSubTab, setActiveSubTab] = useState('catalog'); // 'catalog' | 'cart' | 'artisan-studio'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Product Detail Modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cart State (Persisted in localStorage for convenience)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('meld_craft_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Checkout State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '124 Heritage Way',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    phone: '9876543210'
  });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);

  // Artisan Studio State
  const [artisanProfile, setArtisanProfile] = useState(null);
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [artisanOrders, setArtisanOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'Handloom',
    price: 1200,
    stock: 5,
    craftOrigin: '',
    artisanStory: '',
    materials: '',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80'
  });
  const [isListingOpen, setIsListingOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('meld_craft_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetchProducts();
    fetchArtisanData();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (search) params.search = search;
      const res = await craftService.getProducts(params);
      if (res && res.products) {
        setProducts(res.products);
      }
    } catch {
      // Mock curated fallback
      setProducts([
        {
          _id: 'p1',
          title: 'Hand-thrown Terracotta Water Urn',
          category: 'Pottery',
          price: 850,
          stock: 12,
          craftOrigin: 'Alwar, Rajasthan',
          artisanName: 'Bhanwar Lal Kumhar',
          artisanStory: 'Crafted using porous natural river clay, seasoned with red ochre and wood ash over a 4-day slow kiln firing.',
          materials: ['Terracotta', 'Natural Red Ochre', 'Wood Ash'],
          images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80']
        },
        {
          _id: 'p2',
          title: 'Ikat Silk-Cotton Stole',
          category: 'Handloom',
          price: 1850,
          stock: 7,
          craftOrigin: 'Pochampally, Telangana',
          artisanName: 'Lakshmi & Weaver Collective',
          artisanStory: 'Tie-dyed warp yarns aligned by hand on ancestral pit looms. Dyed exclusively with natural pomegranate peel and indigo.',
          materials: ['Mulberry Silk', 'Organic Cotton', 'Vegetable Dyes'],
          images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80']
        },
        {
          _id: 'p3',
          title: 'Carved Sheesham Wood Spice Box',
          category: 'Woodwork',
          price: 1450,
          stock: 9,
          craftOrigin: 'Saharanpur, Uttar Pradesh',
          artisanName: 'Mohammad Yusuf',
          artisanStory: 'Reclaimed seasoned sheesham hardwood with hand-chiseled floral lattice work and brass inlay hinges.',
          materials: ['Reclaimed Sheesham', 'Brass Inlay', 'Natural Beeswax'],
          images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80']
        },
        {
          _id: 'p4',
          title: 'Woven Golden Grass Storage Basket',
          category: 'Natural Fibers',
          price: 650,
          stock: 15,
          craftOrigin: 'Kendrapara, Odisha',
          artisanName: 'Maa Durga SHG Collective',
          artisanStory: 'Hand-split golden wild river reed woven by women artisans, completely biodegradable and water-resistant.',
          materials: ['Golden Kaincha Grass', 'Palm Leaves'],
          images: ['https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtisanData = async () => {
    try {
      const pRes = await craftService.getArtisanProfile();
      if (pRes && pRes.artisanProfile) {
        setArtisanProfile(pRes.artisanProfile);
        const myProdRes = await craftService.getArtisanProducts();
        if (myProdRes && myProdRes.products) setArtisanProducts(myProdRes.products);
        const ordersRes = await craftService.getArtisanOrders();
        if (ordersRes && ordersRes.orders) setArtisanOrders(ordersRes.orders);
      }
    } catch {
      // Handled
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product._id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await craftService.createProduct({
        ...newProduct,
        description: newProduct.artisanStory || newProduct.title,
        materials: (newProduct.materials || '').split(',').map((s) => s.trim()).filter(Boolean),
        images: newProduct.imageUrl
          ? [newProduct.imageUrl]
          : ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80']
      });
      setIsListingOpen(false);
      fetchArtisanData();
      fetchProducts();
      alert('Product listed successfully!');
    } catch (err) {
      alert(err.message || 'Failed to list product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await craftService.updateOrderStatus(orderId, { status: newStatus });
      fetchArtisanData();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    try {
      const orderPayload = {
        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress
      };

      const orderRes = await craftService.createOrder(orderPayload);
      if (!orderRes || !orderRes.order) throw new Error('Order creation failed');

      const { order, razorpayOrder, keyId } = orderRes;

      // Simulate payment verification
      const verifyRes = await craftService.verifyOrderPayment({
        orderId: order._id,
        razorpay_order_id: razorpayOrder?.id || `rzp_order_${Date.now()}`,
        razorpay_payment_id: `rzp_pay_${Date.now()}`,
        razorpay_signature: 'simulated_craft_signature'
      });

      setCheckoutSuccess(verifyRes.order);
      setCart([]);
      localStorage.removeItem('meld_craft_cart');
    } catch (err) {
      alert(err.message || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="craft-container">
      {/* Banner */}
      <ScrollReveal direction="down">
        <div
          className="card-surface"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(196, 119, 83, 0.25)',
            background: 'linear-gradient(135deg, rgba(196, 119, 83, 0.08) 0%, rgba(246, 243, 233, 0.6) 100%)',
            marginBottom: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  backgroundColor: '#C47753',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  textTransform: 'uppercase'
                }}
              >
                Module 02
              </span>
              <span style={{ fontSize: '0.85rem', color: '#C47753', fontWeight: 600 }}>
                Heritage Artisan Marketplace
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text)' }}>
              Craft to Cart
            </h1>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '580px', lineHeight: 1.5 }}>
              Direct-from-source authentic handcrafted goods. Fair prices directly to artisans with complete cultural provenance and material honesty.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveSubTab('artisan-studio')}
              className="btn btn-outline hover-lift"
              style={{ borderColor: '#C47753', color: '#C47753', fontWeight: 600 }}
            >
              <Palette size={16} style={{ marginRight: '0.35rem' }} />
              <span>{artisanProfile ? 'Artisan Studio' : 'Artisan Onboarding'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('cart')}
              className="btn btn-primary hover-lift"
              style={{
                backgroundColor: '#C47753',
                borderColor: '#C47753',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <ShoppingBag size={18} />
              <span>Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Sub Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1.5rem',
          paddingBottom: '0.25rem'
        }}
      >
        <button
          onClick={() => setActiveSubTab('catalog')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'catalog' ? 700 : 500,
            color: activeSubTab === 'catalog' ? '#C47753' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'catalog' ? '3px solid #C47753' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          Artisan Catalog
        </button>
        <button
          onClick={() => setActiveSubTab('cart')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'cart' ? 700 : 500,
            color: activeSubTab === 'cart' ? '#C47753' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'cart' ? '3px solid #C47753' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>Shopping Cart</span>
          {cart.length > 0 && (
            <span
              style={{
                backgroundColor: 'rgba(196, 119, 83, 0.15)',
                color: '#C47753',
                fontSize: '0.7rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                fontWeight: 700
              }}
            >
              {cart.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('artisan-studio')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'artisan-studio' ? 700 : 500,
            color: activeSubTab === 'artisan-studio' ? '#C47753' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'artisan-studio' ? '3px solid #C47753' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          Artisan Studio
        </button>
      </div>

      {/* SUB-VIEW 1: CATALOG */}
      {activeSubTab === 'catalog' && (
        <div>
          {/* Controls */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }}
              />
              <input
                type="text"
                placeholder="Search pottery, silk, woodwork..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {CRAFT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? '#C47753' : 'var(--border)',
                    backgroundColor: selectedCategory === cat ? 'rgba(196, 119, 83, 0.12)' : 'var(--surface-alt)',
                    color: selectedCategory === cat ? '#C47753' : 'var(--text)',
                    borderRadius: '999px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {products.map((item, idx) => (
              <ScrollReveal key={item._id || idx} delay={idx * 70} direction="up">
                <div
                  className="card-surface hover-lift"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%'
                  }}
                >
                  <div style={{ position: 'relative', height: '190px', backgroundColor: 'var(--surface-alt)' }}>
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: 'rgba(40, 53, 46, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {item.craftOrigin || 'Handcrafted'}
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: '#C47753', fontWeight: 700, textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                    <h3 style={{ margin: '0.25rem 0 0.5rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 1rem', flex: 1 }}>
                      {item.artisanStory?.slice(0, 90)}...
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>
                          ₹{item.price}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>
                          Fair-Trade Direct
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setSelectedProduct(item)}
                          className="btn btn-outline"
                          style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
                        >
                          Story
                        </button>
                        <button
                          onClick={() => addToCart(item)}
                          className="btn btn-primary"
                          style={{
                            backgroundColor: '#C47753',
                            borderColor: '#C47753',
                            padding: '0.4rem 0.85rem',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <ShoppingBag size={14} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: CART */}
      {activeSubTab === 'cart' && (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          {cart.length === 0 ? (
            <div
              className="card-surface"
              style={{ textAlign: 'center', padding: '3.5rem 1.5rem', borderRadius: 'var(--radius-lg)' }}
            >
              <ShoppingBag size={48} color="#C47753" style={{ opacity: 0.4, marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem' }}>Your Basket is Empty</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Support traditional master artisans by exploring authentic handmade treasures.
              </p>
              <button
                onClick={() => setActiveSubTab('catalog')}
                className="btn btn-primary"
                style={{ backgroundColor: '#C47753', borderColor: '#C47753' }}
              >
                Browse Craft Catalog
              </button>
            </div>
          ) : (
            <div
              className="card-surface"
              style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, margin: '0 0 1.25rem' }}>
                Review Artisan Order ({cart.length} unique items)
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                {cart.map((item) => (
                  <div
                    key={item.product._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface-alt)',
                      border: '1px solid var(--border)',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=150&q=80'}
                        alt={item.product.title}
                        style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.product.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          ₹{item.product.price} each • By {item.product.artisanName || 'Master Artisan'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          backgroundColor: 'var(--surface)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          padding: '0.2rem 0.5rem'
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.product._id, -1)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, 1)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '1rem', minWidth: '70px', textAlign: 'right' }}>
                        ₹{item.product.price * item.quantity}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Checkout */}
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'rgba(196, 119, 83, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Delivery (Free)</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>
                    Shipped securely via India Post Artisan Express
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order Total:</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#C47753' }}>
                    ₹{cartSubtotal}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="btn btn-primary hover-lift"
                style={{ width: '100%', backgroundColor: '#C47753', borderColor: '#C47753', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
              >
                Proceed to Checkout (₹{cartSubtotal})
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: ARTISAN STUDIO */}
      {activeSubTab === 'artisan-studio' && (
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div
            className="card-surface"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              marginBottom: '1.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <span className="badge badge-gold">Artisan Heritage Partner</span>
              <h2 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.35rem', fontFamily: 'var(--font-heading)' }}>
                Artisan Studio & Workbench
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Publish new handcrafted lots and manage direct patron dispatches.
              </p>
            </div>

            <button
              onClick={() => setIsListingOpen(true)}
              className="btn btn-primary hover-lift"
              style={{ backgroundColor: '#C47753', borderColor: '#C47753', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Plus size={16} />
              <span>List New Creation</span>
            </button>
          </div>

          {/* Artisan Orders / Dispatches */}
          <div className="card-surface" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)', margin: '0 0 1rem' }}>
              Incoming Customer Orders ({artisanOrders.length})
            </h3>
            {artisanOrders.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                No active orders pending shipment. New buyer purchases will be queued here.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {artisanOrders.map((ord) => (
                  <div
                    key={ord._id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface-alt)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Order #{ord._id?.slice(-6)}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Items: {ord.items?.length || 1} • Total: ₹{ord.totalAmount}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                        Ship to: {ord.shippingAddress?.city}, {ord.shippingAddress?.state} ({ord.shippingAddress?.phone})
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="badge badge-mint">{ord.status}</span>
                      {ord.status === 'processing' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord._id, 'shipped')}
                          className="btn btn-outline"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                        >
                          Mark Shipped
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCT STORY MODAL */}
      {selectedProduct && (
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
              maxWidth: '540px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              overflow: 'hidden'
            }}
          >
            <div style={{ height: '220px', position: 'relative' }}>
              <img
                src={selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'}
                alt={selectedProduct.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#C47753', fontWeight: 700, textTransform: 'uppercase' }}>
                {selectedProduct.category} • {selectedProduct.craftOrigin}
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, margin: '0.25rem 0 0.75rem' }}>
                {selectedProduct.title}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                Master Artisan: {selectedProduct.artisanName || 'Traditional Guild'}
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                {selectedProduct.artisanStory}
              </p>

              {selectedProduct.materials && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>Raw Materials:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {selectedProduct.materials.map((m, i) => (
                      <span key={i} className="badge badge-surface" style={{ fontSize: '0.75rem' }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>
                  ₹{selectedProduct.price}
                </div>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#C47753', borderColor: '#C47753' }}
                >
                  Add to Basket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutModalOpen && (
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
              maxWidth: '480px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '1.75rem'
            }}
          >
            {checkoutSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={48} color="#C47753" style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
                  Artisan Order Confirmed!
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Your order #{checkoutSuccess._id?.slice(-6)} has been dispatched to the artisan workshop.
                </p>
                <button
                  onClick={() => {
                    setCheckoutModalOpen(false);
                    setCheckoutSuccess(null);
                    if (onNavigateOrders) onNavigateOrders();
                  }}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#C47753', borderColor: '#C47753', width: '100%' }}
                >
                  Track in My Orders
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckout}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
                    Complete Artisan Purchase
                  </h3>
                  <button type="button" onClick={() => setCheckoutModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>City</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Pincode</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={16} color="var(--primary)" />
                  <span>Razorpay escrow holds payment until verified delivery.</span>
                </div>

                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', backgroundColor: '#C47753', borderColor: '#C47753', padding: '0.75rem', fontWeight: 700 }}
                >
                  {checkoutLoading ? 'Processing...' : `Pay ₹${cartSubtotal} via Razorpay`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* LIST PRODUCT MODAL */}
      {isListingOpen && (
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
              maxWidth: '500px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
                Publish New Handcrafted Item
              </h3>
              <button type="button" onClick={() => setIsListingOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  >
                    {CRAFT_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Craft Origin (Region)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madhubani, Bihar"
                  value={newProduct.craftOrigin}
                  onChange={(e) => setNewProduct({ ...newProduct, craftOrigin: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Artisan Provenance Story</label>
                <textarea
                  rows={3}
                  required
                  value={newProduct.artisanStory}
                  onChange={(e) => setNewProduct({ ...newProduct, artisanStory: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem', resize: 'none' }}
                />
              </div>

              <PhotoUploadField
                label="Craft Product Photograph"
                value={newProduct.imageUrl}
                onChange={(url) => setNewProduct({ ...newProduct, imageUrl: url })}
                folder="meld/craft"
              />

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', backgroundColor: '#C47753', borderColor: '#C47753', padding: '0.75rem' }}
              >
                Publish Creation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CraftHub;
