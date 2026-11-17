import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ShoppingBag,
  Laptop,
  BookOpen,
  Utensils,
  Check,
  X,
  AlertCircle,
  Clock,
  CheckCircle,
  Eye
} from 'lucide-react';
import adminService from '../../services/admin/adminService';
import adminModerationService from '../../services/admin/adminModerationService';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminDataTable from '../../components/admin/AdminDataTable';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog';

export function AdminModules() {
  const [activeModule, setActiveModule] = useState('wisdom-loop');
  const [moduleData, setModuleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Moderation action dialog
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: null,
    id: null,
    action: 'APPROVE',
    title: ''
  });

  const loadModuleData = async (mod) => {
    try {
      setIsLoading(true);
      let data = null;
      if (mod === 'wisdom-loop') data = await adminService.getWisdomLoopData();
      else if (mod === 'craft-to-cart') data = await adminService.getCraftToCartData();
      else if (mod === 'reconnect') data = await adminService.getReConnectData();
      else if (mod === 'book-bridge') data = await adminService.getBookBridgeData();
      else if (mod === 'second-serve') data = await adminService.getSecondServeData();
      setModuleData(data);
    } catch (err) {
      console.error(`Failed to load ${mod} data:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModuleData(activeModule);
  }, [activeModule]);

  const handleModerationSubmit = async (reason) => {
    const { type, id, action } = dialogState;
    if (type === 'mentor') {
      await adminModerationService.reviewMentor(id, action, reason);
    } else if (type === 'artisan') {
      await adminModerationService.reviewArtisan(id, action, reason);
    } else if (type === 'product') {
      await adminModerationService.reviewProduct(id, action, reason);
    } else if (['device', 'book', 'food'].includes(type)) {
      await adminModerationService.reviewListing(type, id, action, reason);
    }
    loadModuleData(activeModule);
  };

  const modulesNav = [
    { id: 'wisdom-loop', name: 'Wisdom Loop', tag: 'WL-01', subtitle: 'Intergenerational Mentorship', icon: <GraduationCap size={18} />, color: '#6573B8' },
    { id: 'craft-to-cart', name: 'Craft to Cart', tag: 'CC-02', subtitle: 'Artisan Guild Marketplace', icon: <ShoppingBag size={18} />, color: '#C47753' },
    { id: 'reconnect', name: 'ReConnect', tag: 'RC-03', subtitle: 'Electronics Circular Repair', icon: <Laptop size={18} />, color: '#368F88' },
    { id: 'book-bridge', name: 'Book Bridge', tag: 'BB-04', subtitle: 'Literacy Community Circulation', icon: <BookOpen size={18} />, color: '#D3A34F' },
    { id: 'second-serve', name: 'Second Serve', tag: 'SS-05', subtitle: 'Surplus Food Rescue & Safety', icon: <Utensils size={18} />, color: '#70975D' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Title */}
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
          Cross-Module Operational Governance
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Manage listings, verify participant credentials, monitor safety compliance, and oversee exchange activity across all five platform initiatives.
        </p>
      </div>

      {/* Module Selector Cards (5-up) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        {modulesNav.map((m) => {
          const isSelected = activeModule === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                border: isSelected ? `2px solid ${m.color}` : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-xs)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: m.color }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? m.color : 'var(--mint)',
                    color: isSelected ? '#ffffff' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {m.icon}
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {m.tag}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? m.color : 'var(--text)' }}>
                {m.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {m.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Module 1: Wisdom Loop View */}
      {activeModule === 'wisdom-loop' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: '#43529d' }}>
              Wisdom Loop Mentors & Applications
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total Mentors: <strong>{moduleData?.mentors?.length || 0}</strong>
            </span>
          </div>

          <AdminDataTable
            columns={[
              {
                header: 'Mentor',
                render: (r) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.userId?.fullName || 'Anonymous'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.userId?.email}</div>
                  </div>
                )
              },
              { header: 'Title / Role', accessor: 'title' },
              {
                header: 'Expertise',
                render: (r) => (
                  <span style={{ fontSize: '0.8rem' }}>{r.expertiseAreas?.join(', ') || 'General'}</span>
                )
              },
              { header: 'Experience', render: (r) => <span>{r.yearsOfExperience} yrs</span> },
              { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              {
                header: 'Actions',
                align: 'right',
                render: (r) => (
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                    {r.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => setDialogState({ isOpen: true, type: 'mentor', id: r._id, action: 'APPROVE', title: `Approve Mentor Application: ${r.userId?.fullName}` })}
                          style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(32,109,57,0.1)', color: '#2e7d32', border: '1px solid rgba(32,109,57,0.3)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setDialogState({ isOpen: true, type: 'mentor', id: r._id, action: 'REJECT', title: `Reject Mentor Application: ${r.userId?.fullName}` })}
                          style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', backgroundColor: 'var(--error-surface)', color: 'var(--error)', border: '1px solid rgba(186,26,26,0.3)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                )
              }
            ]}
            data={moduleData?.mentors || []}
            isLoading={isLoading}
            emptyMessage="No mentors currently registered in Wisdom Loop."
          />
        </div>
      )}

      {/* Module 2: Craft to Cart View */}
      {activeModule === 'craft-to-cart' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: '#9d4a25' }}>
              Craft to Cart Marketplace Inventory & Artisans
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Products Listed: <strong>{moduleData?.products?.length || 0}</strong> • Verified Artisans: <strong>{moduleData?.artisans?.length || 0}</strong>
            </span>
          </div>

          <AdminDataTable
            columns={[
              {
                header: 'Product',
                render: (r) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category: {r.category}</div>
                  </div>
                )
              },
              { header: 'Artisan', render: (r) => <span>{r.artisanId?.fullName || 'Guild Artisan'}</span> },
              { header: 'Price', render: (r) => <span style={{ fontWeight: 700 }}>₹{r.price}</span> },
              { header: 'Stock', render: (r) => <span>{r.stock} units</span> },
              { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              {
                header: 'Moderation',
                align: 'right',
                render: (r) => (
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                    {r.status === 'ACTIVE' ? (
                      <button
                        onClick={() => setDialogState({ isOpen: true, type: 'product', id: r._id, action: 'SUSPEND', title: `Archive Product Listing: ${r.title}` })}
                        style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', backgroundColor: 'var(--error-surface)', color: 'var(--error)', border: '1px solid rgba(186,26,26,0.3)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        Archive
                      </button>
                    ) : (
                      <button
                        onClick={() => setDialogState({ isOpen: true, type: 'product', id: r._id, action: 'APPROVE', title: `Approve Product Listing: ${r.title}` })}
                        style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(32,109,57,0.1)', color: '#2e7d32', border: '1px solid rgba(32,109,57,0.3)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                )
              }
            ]}
            data={moduleData?.products || []}
            isLoading={isLoading}
            emptyMessage="No products listed in Craft to Cart."
          />
        </div>
      )}

      {/* Module 3: ReConnect View */}
      {activeModule === 'reconnect' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: '#206862' }}>
              ReConnect Hardware Pipeline
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Hardware Devices: <strong>{moduleData?.devices?.length || 0}</strong>
            </span>
          </div>

          <AdminDataTable
            columns={[
              {
                header: 'Device Specification',
                render: (r) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.brand} {r.modelName} ({r.deviceType})</div>
                  </div>
                )
              },
              { header: 'Condition', render: (r) => <StatusBadge status={r.condition} size="sm" /> },
              { header: 'Lifecycle Status', render: (r) => <StatusBadge status={r.status} /> },
              { header: 'Donor', render: (r) => <span>{r.donorId?.fullName || 'Anonymous'}</span> },
              {
                header: 'Action',
                align: 'right',
                render: (r) => (
                  <button
                    onClick={() => setDialogState({ isOpen: true, type: 'device', id: r._id, action: 'REHOMED', title: `Mark Device as Rehomed: ${r.title}` })}
                    style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', backgroundColor: 'var(--mint)', color: 'var(--primary)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    Update State
                  </button>
                )
              }
            ]}
            data={moduleData?.devices || []}
            isLoading={isLoading}
            emptyMessage="No devices currently registered in ReConnect."
          />
        </div>
      )}

      {/* Module 4: Book Bridge View */}
      {activeModule === 'book-bridge' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: '#8f681a' }}>
              Book Bridge Circulation Catalog
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Books Catalogued: <strong>{moduleData?.books?.length || 0}</strong>
            </span>
          </div>

          <AdminDataTable
            columns={[
              {
                header: 'Book Title & Author',
                render: (r) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {r.author} • Genre: {r.genre || 'General'}</div>
                  </div>
                )
              },
              { header: 'Condition', render: (r) => <StatusBadge status={r.condition} size="sm" /> },
              { header: 'Circulation Status', render: (r) => <StatusBadge status={r.status} /> },
              { header: 'Donor', render: (r) => <span>{r.donorId?.fullName || 'Community Donor'}</span> },
              {
                header: 'Action',
                align: 'right',
                render: (r) => (
                  <button
                    onClick={() => setDialogState({ isOpen: true, type: 'book', id: r._id, action: 'DONATED', title: `Mark Book Transferred: ${r.title}` })}
                    style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', backgroundColor: 'var(--mint)', color: 'var(--primary)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    Transfer
                  </button>
                )
              }
            ]}
            data={moduleData?.books || []}
            isLoading={isLoading}
            emptyMessage="No books catalogued in Book Bridge."
          />
        </div>
      )}

      {/* Module 5: Second Serve View */}
      {activeModule === 'second-serve' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: '#456a34', margin: 0 }}>
                Second Serve Food Safety & Rescue
              </h2>
              {moduleData?.expiredAlertsCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--error)', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.25rem' }}>
                  <AlertCircle size={15} />
                  <span>{moduleData.expiredAlertsCount} listings require expiration/cold-chain triage</span>
                </div>
              )}
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Rescue Lots: <strong>{moduleData?.foodListings?.length || 0}</strong>
            </span>
          </div>

          <AdminDataTable
            columns={[
              {
                header: 'Food Lot',
                render: (r) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type: {r.foodType} • Dietary: {r.dietaryType}</div>
                  </div>
                )
              },
              { header: 'Portions', render: (r) => <span style={{ fontWeight: 700 }}>{r.quantityServings} servings</span> },
              {
                header: 'Best Before',
                render: (r) => {
                  const isExpired = new Date(r.bestBefore) < new Date();
                  return (
                    <span style={{ fontSize: '0.8rem', color: isExpired ? 'var(--error)' : 'var(--text)', fontWeight: isExpired ? 700 : 400 }}>
                      {new Date(r.bestBefore).toLocaleString()}
                      {isExpired && ' (EXPIRED)'}
                    </span>
                  );
                }
              },
              { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              {
                header: 'Action',
                align: 'right',
                render: (r) => (
                  <button
                    onClick={() => setDialogState({ isOpen: true, type: 'food', id: r._id, action: 'DELIVERED', title: `Mark Food Batch Delivered: ${r.title}` })}
                    style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', backgroundColor: 'var(--mint)', color: 'var(--primary)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    Log Collection
                  </button>
                )
              }
            ]}
            data={moduleData?.foodListings || []}
            isLoading={isLoading}
            emptyMessage="No active food donations registered in Second Serve."
          />
        </div>
      )}

      {/* Universal Moderation Dialog */}
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, type: null, id: null, action: 'APPROVE', title: '' })}
        onConfirm={handleModerationSubmit}
        title={dialogState.title}
        message="Reviewing this module record will record an administrative audit entry and alert the affected member."
        confirmText="Confirm Decision"
        requireReason={['REJECT', 'SUSPEND'].includes(dialogState.action)}
        reasonPlaceholder="Provide reason for moderation logs..."
      />
    </div>
  );
}

export default AdminModules;
