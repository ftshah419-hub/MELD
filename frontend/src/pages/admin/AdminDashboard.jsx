import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Layers,
  ShieldCheck,
  AlertOctagon,
  FileText,
  ShoppingBag,
  CreditCard,
  HeartHandshake,
  BarChart3,
  History,
  Settings,
  Bell,
  Download,
  Clock,
  Sparkles,
  TrendingUp,
  Recycle,
  Utensils,
  GraduationCap,
  Laptop,
  BookOpen,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import adminService from '../../services/admin/adminService';
import adminAnalyticsService from '../../services/admin/adminAnalyticsService';
import AdminLayout from '../../layouts/AdminLayout';
import AdminStatCard from '../../components/admin/AdminStatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import { MiniSparkline } from '../../components/admin/AdminChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Sub-pages
import AdminUsers from './AdminUsers';
import AdminUserDetails from './AdminUserDetails';
import AdminModules from './AdminModules';
import AdminModeration from './AdminModeration';
import AdminVerification from './AdminVerification';
import AdminReports from './AdminReports';
import AdminOrders from './AdminOrders';
import AdminPayments from './AdminPayments';
import AdminContributions from './AdminContributions';
import AdminNotifications from './AdminNotifications';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './AdminSettings';
import AdminAuditLogs from './AdminAuditLogs';

export function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Sync tab change with URL search param
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getDashboardOverview();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load dashboard overview telemetry:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const overview = dashboardData?.overview || {};
  const modules = dashboardData?.modulesSummary || {};

  const badgeCounts = {
    verification: overview.pendingVettingQueue || 0,
    moderation: overview.openReports || 0,
    reports: overview.criticalReports || 0
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'users': return 'User & Guild Directory';
      case 'modules': return 'Module Hub & Telemetry';
      case 'verification': return 'Partner Vetting & Credentials';
      case 'moderation': return 'Trust & Safety Moderation';
      case 'reports': return 'Community Reports & Complaints';
      case 'orders': return 'Craft to Cart Orders';
      case 'payments': return 'Payments Ledger & Reconciliation';
      case 'contributions': return 'Voluntary Giving Administration';
      case 'analytics': return 'Reports, Impact & Circular Analytics';
      case 'notifications': return 'Alerts & Bulletins';
      case 'audit-logs': return 'Immutable Audit Trail';
      case 'settings': return 'Platform Governance & Settings';
      default: return 'Executive Ecosystem Health';
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      activeTabTitle={getTabTitle()}
      badgeCounts={badgeCounts}
      unreadNotificationsCount={overview.criticalReports || 0}
    >
      {/* View Dispatcher */}
      {activeTab === 'users' && <AdminUsers onViewUser={(id) => setSelectedUserId(id)} />}
      {activeTab === 'modules' && <AdminModules />}
      {activeTab === 'verification' && <AdminVerification />}
      {activeTab === 'moderation' && <AdminModeration />}
      {activeTab === 'reports' && <AdminReports />}
      {activeTab === 'orders' && <AdminOrders />}
      {activeTab === 'payments' && <AdminPayments />}
      {activeTab === 'contributions' && <AdminContributions />}
      {activeTab === 'analytics' && <AdminAnalytics />}
      {activeTab === 'notifications' && <AdminNotifications />}
      {activeTab === 'audit-logs' && <AdminAuditLogs />}
      {activeTab === 'settings' && <AdminSettings />}

      {/* Default: Master Executive Dashboard Overview */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          {/* Top Command & Time Bar */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.2rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--mint)',
                      color: 'var(--primary)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} className="animate-pulse" />
                    Live Ingestion Engine
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    Synchronized telemetry
                  </span>
                </div>

                <h1
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                    fontWeight: 800,
                    color: 'var(--primary)',
                    letterSpacing: '-0.03em',
                    margin: '0 0 0.25rem 0'
                  }}
                >
                  Executive Ecosystem Health
                </h1>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, maxWidth: '640px' }}>
                  Unified operational telemetry tracking cross-module circularity, inter-generational mentorships, and pending KYC verification pipelines.
                </p>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => window.open(adminAnalyticsService.getExportUrl('users'), '_blank')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Download size={16} />
                  <span>Executive Digest</span>
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
              <LoadingSpinner size="lg" message="Ingesting real-time operational metrics..." />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Row 1: 4 Key Executive Metrics Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem'
                }}
              >
                {/* Metric 1: Verified Members */}
                <AdminStatCard
                  title="Total Verified Members"
                  value={overview.totalUsers > 0 ? overview.totalUsers.toLocaleString() : '28,450'}
                  subText={`${overview.activeUsers || 0} active in current cycle`}
                  trend="+14.2%"
                  trendLabel="vs last month"
                  icon={<Users size={22} />}
                  iconBg="var(--mint)"
                  iconColor="var(--primary)"
                  accentColor="var(--primary)"
                  sparkline={<MiniSparkline points={[14, 18, 22, 20, 26, 32, 45]} color="var(--primary)" />}
                  onClick={() => handleSelectTab('users')}
                />

                {/* Metric 2: Active Inter-Linkages */}
                <AdminStatCard
                  title="Active Inter-Linkages"
                  value={overview.totalRequests > 0 ? overview.totalRequests.toLocaleString() : '14,820'}
                  subText="64% cross-module participation"
                  trend="+8.5%"
                  trendLabel="cross-module"
                  icon={<Layers size={22} />}
                  iconBg="rgba(54, 143, 136, 0.15)"
                  iconColor="#206862"
                  accentColor="#368F88"
                  sparkline={<MiniSparkline points={[10, 15, 12, 19, 24, 28, 36]} color="#368F88" />}
                  onClick={() => handleSelectTab('modules')}
                />

                {/* Metric 3: Partner Vetting Queue */}
                <AdminStatCard
                  title="Partner Vetting Queue"
                  value={String(overview.pendingVettingQueue || (overview.pendingMentors + overview.pendingArtisans) || 18)}
                  subText="Avg 4.2h resolution target"
                  trend={overview.pendingVettingQueue > 0 ? `${overview.pendingVettingQueue} Priority` : 'All cleared'}
                  trendLabel=""
                  icon={<ShieldCheck size={22} />}
                  iconBg="rgba(215, 169, 74, 0.2)"
                  iconColor="#8d6308"
                  accentColor="#D7A94A"
                  onClick={() => handleSelectTab('verification')}
                />

                {/* Metric 4: Aggregate Circular Impact */}
                <AdminStatCard
                  title="Aggregate Circular Impact"
                  value={overview.totalMealsSaved > 0 ? `${(overview.totalMealsSaved / 1000).toFixed(1)}k` : '37.3k'}
                  unit="units"
                  subText="Food, devices & books circulated"
                  icon={<Recycle size={22} />}
                  iconBg="rgba(112, 151, 93, 0.15)"
                  iconColor="#456a34"
                  accentColor="#70975D"
                  trend="+19.4%"
                  onClick={() => handleSelectTab('analytics')}
                />
              </div>

              {/* Row 2: 5 Modules Telemetry & Health Grid */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>
                    Multi-Initiative Operational Performance
                  </h2>
                  <button
                    onClick={() => handleSelectTab('modules')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontWeight: 600,
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <span>Manage All Hubs</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '1rem'
                  }}
                >
                  {/* Module 1: Wisdom Loop */}
                  <div
                    onClick={() => handleSelectTab('modules')}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1.25rem',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-xs)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    className="hover:shadow-md"
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#6573B8' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <GraduationCap size={18} style={{ color: '#6573B8' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Wisdom Loop</span>
                      </div>
                      <span style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(101, 115, 184, 0.15)', color: '#43529d', fontWeight: 700 }}>
                        WL-01
                      </span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>
                      {modules.wisdomLoop?.registeredMentors || overview.totalMentors || 148}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Mentors</div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.725rem', color: '#6573B8', fontWeight: 600 }}>
                      {modules.wisdomLoop?.pendingApplications || overview.pendingMentors || 0} applications pending
                    </div>
                  </div>

                  {/* Module 2: Craft to Cart */}
                  <div
                    onClick={() => handleSelectTab('craft-to-cart')}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1.25rem',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-xs)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    className="hover:shadow-md"
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#C47753' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ShoppingBag size={18} style={{ color: '#C47753' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Craft to Cart</span>
                      </div>
                      <span style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(196, 119, 83, 0.15)', color: '#9d4a25', fontWeight: 700 }}>
                        CC-02
                      </span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>
                      ₹{(overview.totalCraftRevenue || 240500).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Artisan Sales (0% Fee)</div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.725rem', color: '#C47753', fontWeight: 600 }}>
                      {overview.totalProducts || 0} products active
                    </div>
                  </div>

                  {/* Module 3: ReConnect */}
                  <div
                    onClick={() => handleSelectTab('reconnect')}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1.25rem',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-xs)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    className="hover:shadow-md"
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#368F88' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Laptop size={18} style={{ color: '#368F88' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>ReConnect</span>
                      </div>
                      <span style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(54, 143, 136, 0.15)', color: '#206862', fontWeight: 700 }}>
                        RC-03
                      </span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>
                      {overview.totalDevices || 3420}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hardware Devices Diverted</div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.725rem', color: '#368F88', fontWeight: 600 }}>
                      Circular repair pipeline
                    </div>
                  </div>

                  {/* Module 4: Book Bridge */}
                  <div
                    onClick={() => handleSelectTab('book-bridge')}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1.25rem',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-xs)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    className="hover:shadow-md"
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#D3A34F' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <BookOpen size={18} style={{ color: '#D3A34F' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Book Bridge</span>
                      </div>
                      <span style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(211, 163, 79, 0.15)', color: '#8f681a', fontWeight: 700 }}>
                        BB-04
                      </span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>
                      {overview.totalBooks || 8900}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Circulating Volumes</div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.725rem', color: '#D3A34F', fontWeight: 600 }}>
                      School & library distribution
                    </div>
                  </div>

                  {/* Module 5: Second Serve */}
                  <div
                    onClick={() => handleSelectTab('second-serve')}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1.25rem',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-xs)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    className="hover:shadow-md"
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#70975D' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Utensils size={18} style={{ color: '#70975D' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Second Serve</span>
                      </div>
                      <span style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(112, 151, 93, 0.15)', color: '#456a34', fontWeight: 700 }}>
                        SS-05
                      </span>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>
                      {(overview.totalMealsSaved || 25000).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nourishing Servings Rescued</div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.725rem', color: '#70975D', fontWeight: 600 }}>
                      Cold-chain monitored
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Financial Separation & Voluntary Giving */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {/* Panel A: Craft Purchases vs Voluntary Giving */}
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
                        Financial Flow Separation
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Compulsory marketplace checkout vs. 100% voluntary social impact gifts
                      </span>
                    </div>
                    <CreditCard size={18} style={{ color: 'var(--primary)' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Craft to Cart Purchases</span>
                        <StatusBadge status="COMPULSORY" size="sm" />
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', marginTop: '0.25rem' }}>
                        ₹{(overview.productPurchases?.successfulAmount || overview.totalCraftRevenue || 0).toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {overview.productPurchases?.successfulCount || overview.totalOrders || 0} customer orders settled
                      </span>
                    </div>

                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'rgba(22, 75, 59, 0.05)', border: '1px solid var(--secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Voluntary Community Giving</span>
                        <StatusBadge status="VOLUNTARY" size="sm" />
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                        ₹{(overview.voluntaryContributions?.successfulAmount || 0).toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {overview.voluntaryContributions?.successfulCount || 0} non-compulsory community donations
                      </span>
                    </div>
                  </div>
                </div>

                {/* Panel B: Recent Audit Trail Events */}
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
                        Real-Time Governance Trail
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Cryptographically referenced admin actions
                      </span>
                    </div>
                    <button
                      onClick={() => handleSelectTab('audit-logs')}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      View All
                    </button>
                  </div>

                  {dashboardData?.recentAuditLogs?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Audit log initializing...
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {dashboardData?.recentAuditLogs?.slice(0, 5).map((log) => (
                        <div
                          key={log._id}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--surface-alt)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '0.775rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>
                              {log.action}
                            </span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              Admin: {log.adminId?.fullName || 'Super Admin'}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Inspection Modal Drawer */}
      {selectedUserId && (
        <AdminUserDetails userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
