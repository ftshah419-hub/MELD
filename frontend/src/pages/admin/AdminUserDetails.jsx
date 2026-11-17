import React, { useState, useEffect } from 'react';
import { X, User, Shield, Calendar, Mail, Phone, ShoppingBag, MessageSquare, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import adminUserService from '../../services/admin/adminUserService';
import StatusBadge from '../../components/admin/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export function AdminUserDetails({ userId, onClose }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('overview');

  useEffect(() => {
    if (!userId) return;
    const loadDetails = async () => {
      try {
        setIsLoading(true);
        const res = await adminUserService.getUserDetails(userId);
        setData(res);
      } catch (err) {
        console.error('Failed to load user details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [userId]);

  if (!userId) return null;

  return (
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
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        className="animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-alt)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--mint)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.1rem'
              }}
            >
              {data?.user?.fullName ? data.user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  {data?.user?.fullName || 'Member Profile'}
                </h2>
                {data?.user?.role && <StatusBadge status={data.user.role} size="sm" />}
                {data?.user?.accountStatus && <StatusBadge status={data.user.accountStatus} size="sm" />}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                User ID: {userId}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Sub-tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.5rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: '#ffffff'
          }}
        >
          {['overview', 'modules', 'orders', 'requests', 'reports', 'audit'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: activeSubTab === tab ? 'var(--secondary-light)' : 'transparent',
                color: activeSubTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: activeSubTab === tab ? 700 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {isLoading ? (
            <div style={{ padding: '3rem 0', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner size="lg" message="Loading profile telemetry..." />
            </div>
          ) : !data?.user ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>User record not found.</div>
          ) : (
            <div>
              {/* Tab 1: Overview */}
              {activeSubTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--surface-alt)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</span>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{data.user.email}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone Contact</span>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{data.user.phone || 'Not provided'}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Joined Network</span>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{new Date(data.user.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Last Sign In</span>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {data.user.lastLogin ? new Date(data.user.lastLogin).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {data.user.bio && (
                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Personal Bio</span>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                        {data.user.bio}
                      </p>
                    </div>
                  )}

                  {/* Summary Metric Chips */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--mint)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{data.orders?.length || 0}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--secondary-dark)', fontWeight: 600 }}>Craft Orders</div>
                    </div>
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-alt)', textAlign: 'center', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{data.requests?.length || 0}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Requests</div>
                    </div>
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-alt)', textAlign: 'center', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{data.payments?.length || 0}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Payments</div>
                    </div>
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: data.reportsAgainst?.length > 0 ? 'var(--error-surface)' : 'var(--surface-alt)', textAlign: 'center', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: data.reportsAgainst?.length > 0 ? 'var(--error)' : 'var(--text)' }}>
                        {data.reportsAgainst?.length || 0}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: data.reportsAgainst?.length > 0 ? 'var(--error)' : 'var(--text-muted)', fontWeight: 600 }}>Reports Flagged</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Module Profiles */}
              {activeSubTab === 'modules' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {data.mentorProfile ? (
                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(101, 115, 184, 0.3)', backgroundColor: 'rgba(101, 115, 184, 0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#43529d' }}>Wisdom Loop Mentor Profile</span>
                        <StatusBadge status={data.mentorProfile.status} size="sm" />
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Title: {data.mentorProfile.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Expertise: {data.mentorProfile.expertiseAreas?.join(', ') || 'N/A'} • Experience: {data.mentorProfile.yearsOfExperience} years
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text)', marginTop: '0.5rem', lineHeight: 1.4 }}>
                        {data.mentorProfile.bio}
                      </p>
                    </div>
                  ) : (
                    <div style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No Wisdom Loop mentor profile enrolled.</div>
                  )}

                  {data.artisanProfile ? (
                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(196, 119, 83, 0.3)', backgroundColor: 'rgba(196, 119, 83, 0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#9d4a25' }}>Craft to Cart Artisan Guild</span>
                        <StatusBadge status={data.artisanProfile.verificationStatus} size="sm" />
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Specialty: {data.artisanProfile.craftSpecialty}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Region: {data.artisanProfile.region} • Recorded Sales: {data.artisanProfile.totalSales || 0}
                      </div>
                      {data.artisanProfile.heritageStory && (
                        <p style={{ fontSize: '0.825rem', color: 'var(--text)', marginTop: '0.5rem', lineHeight: 1.4 }}>
                          {data.artisanProfile.heritageStory}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No Craft to Cart artisan profile enrolled.</div>
                  )}
                </div>
              )}

              {/* Tab 3: Orders */}
              {activeSubTab === 'orders' && (
                <div>
                  {data.orders?.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No Craft to Cart orders placed.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {data.orders.map((o) => (
                        <div key={o._id} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Order #{String(o._id).slice(-8)}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Total: ₹{o.totalAmount} • {new Date(o.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <StatusBadge status={o.paymentStatus} size="sm" />
                            <StatusBadge status={o.orderStatus} size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Requests */}
              {activeSubTab === 'requests' && (
                <div>
                  {data.requests?.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No cross-module requests filed.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {data.requests.map((r) => (
                        <div key={r._id} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <StatusBadge status={r.module} size="sm" />
                            <StatusBadge status={r.status} size="sm" />
                          </div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text)' }}>{r.requestType}</div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>{r.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Reports */}
              {activeSubTab === 'reports' && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--error)' }}>
                    Reports Filed Against This Member
                  </h4>
                  {data.reportsAgainst?.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                      No safety reports or policy complaints recorded against this account.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {data.reportsAgainst.map((rep) => (
                        <div key={rep._id} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(186, 26, 26, 0.3)', backgroundColor: 'var(--error-surface)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--error)' }}>{rep.title}</span>
                            <StatusBadge status={rep.severity} size="sm" />
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text)', marginTop: '0.25rem' }}>{rep.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 6: Audit History */}
              {activeSubTab === 'audit' && (
                <div>
                  {data.auditLogs?.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No administrative audit events recorded for this user.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {data.auditLogs.map((log) => (
                        <div key={log._id} style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--surface-alt)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                            <span style={{ color: 'var(--primary)' }}>{log.action}</span>
                            <span style={{ color: 'var(--text-muted)' }}>{new Date(log.createdAt).toLocaleString()}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            Admin: {log.adminId?.fullName || 'System'} • {JSON.stringify(log.details)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUserDetails;
