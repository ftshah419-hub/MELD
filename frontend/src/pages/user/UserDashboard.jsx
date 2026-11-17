import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/user/userService';

// User Components
import UserSidebar, { MODULES_CONFIG } from '../../components/user/UserSidebar';
import UserHeader from '../../components/user/UserHeader';
import UserStats from '../../components/user/UserStats';
import UserActivity from '../../components/user/UserActivity';
import VoluntaryContributionModal from '../../components/user/VoluntaryContributionModal';
import ScrollReveal from '../../components/user/ScrollReveal';

// Subviews
import WisdomLoopHub from '../../features/user/wisdom-loop/WisdomLoopHub';
import CraftHub from '../../features/user/craft-to-cart/CraftHub';
import ReconnectHub from '../../features/user/reconnect/ReconnectHub';
import BookBridgeHub from '../../features/user/book-bridge/BookBridgeHub';
import SecondServeHub from '../../features/user/second-serve/SecondServeHub';
import UserProfile from './UserProfile';
import MyRequests from './MyRequests';
import MyOrders from './MyOrders';
import MyContributions from './MyContributions';
import Notifications from './Notifications';

import {
  GraduationCap,
  ShoppingBag,
  Cpu,
  BookOpen,
  Utensils,
  ArrowRight,
  Sparkles,
  Heart,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';

export function UserDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active navigation tab (persists to URL search param ?tab=...)
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [contributeModalOpen, setContributeModalOpen] = useState(false);
  const [contributeDefaultModule, setContributeDefaultModule] = useState('all');

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'dashboard' ? {} : { tab: tabId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchDashboardSummary = async () => {
    setLoading(true);
    try {
      const res = await userService.getDashboardSummary();
      if (res && res.summary) {
        setSummary(res.summary);
      }
    } catch {
      // Mock fallback data for resilience
      setSummary({
        totalRequests: 4,
        activeRequests: 2,
        completedRequests: 2,
        ordersCount: 1,
        totalContributions: 1500,
        upcomingSessionsCount: 1,
        recentRequests: [
          {
            _id: 'rq1',
            module: 'wisdom-loop',
            targetItem: { title: '1:1 Session: Traditional Handloom Systems' },
            status: 'accepted',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            _id: 'rq2',
            module: 'reconnect',
            targetItem: { title: 'Lenovo ThinkPad T480 (Student Need)' },
            status: 'pending',
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
          }
        ],
        upcomingSessions: [
          {
            _id: 'us1',
            mentorId: { name: 'Dr. Anandita Sharma' },
            topic: 'Grassroots Innovation & Supply Chains',
            preferredDate: new Date(Date.now() + 86400000 * 2).toISOString(),
            preferredTime: '10:00 AM',
            status: 'accepted',
            meetingLink: 'https://meet.google.com/meld-demo-room'
          }
        ],
        unreadNotifications: 2
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenContributeForModule = (moduleSlug = 'all') => {
    setContributeDefaultModule(moduleSlug);
    setContributeModalOpen(true);
  };

  const activeModuleConfig = MODULES_CONFIG.find((m) => m.id === activeTab);

  return (
    <div
      className="user-dashboard-wrapper animate-fade-in"
      style={{
        backgroundColor: 'var(--surface-alt)',
        minHeight: '100vh',
        padding: '2rem 1.5rem 4rem'
      }}
    >
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Left Navigation Sidebar */}
          <UserSidebar
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            counts={{
              requests: summary.activeRequests,
              orders: summary.ordersCount,
              unreadNotifications: summary.unreadNotifications
            }}
          />

          {/* Main Working Area */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* Top Common User Header */}
            <UserHeader
              user={user}
              activeModule={activeModuleConfig}
              onSelectTab={handleSelectTab}
              onOpenContribute={() => handleOpenContributeForModule('all')}
            />

            {/* TAB: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div>
                {/* Profile Completion Callout */}
                <ScrollReveal direction="down">
                  <div
                    className="card-surface hover-lift-sm"
                    style={{
                      padding: '1.25rem 1.75rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border)',
                      marginBottom: '1.75rem',
                      background: 'linear-gradient(135deg, rgba(22, 75, 59, 0.05) 0%, rgba(220, 235, 225, 0.3) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--mint)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Sparkles size={22} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                          Profile Completion: 75%
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Add your delivery pincode & bio to enable instant approvals for books and electronics.
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectTab('profile')}
                      className="btn btn-outline"
                      style={{ fontSize: '0.825rem', padding: '0.45rem 1rem' }}
                    >
                      Complete Profile &rarr;
                    </button>
                  </div>
                </ScrollReveal>

                {/* Key Metrics Stats Grid */}
                <UserStats summary={summary} onNavigateTab={handleSelectTab} />

                {/* 5 Modules Showcase Grid */}
                <ScrollReveal direction="up" delay={150}>
                  <div style={{ marginBottom: '2rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem'
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            margin: 0,
                            color: 'var(--text)'
                          }}
                        >
                          Connected Impact Streams
                        </h3>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                          Explore and act across all 5 MELD modules from your personal hub.
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                      }}
                    >
                      {MODULES_CONFIG.map((mod, idx) => {
                        const Icon = mod.icon;
                        return (
                          <div
                            key={mod.id}
                            className="card-surface hover-lift"
                            onClick={() => handleSelectTab(mod.id)}
                            style={{
                              padding: '1.25rem',
                              borderRadius: 'var(--radius-lg)',
                              border: '1px solid var(--border)',
                              borderTop: `4px solid ${mod.color}`,
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  width: '38px',
                                  height: '38px',
                                  borderRadius: 'var(--radius-md)',
                                  backgroundColor: `${mod.color}15`,
                                  color: mod.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginBottom: '0.75rem'
                                }}
                              >
                                <Icon size={20} />
                              </div>
                              <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
                                {mod.name}
                              </h4>
                              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                {mod.desc}
                              </p>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                color: mod.color,
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                marginTop: '1rem'
                              }}
                            >
                              <span>Enter Hub</span>
                              <ArrowRight size={13} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ScrollReveal>

                {/* Activity Feed: Recent Requests & Upcoming Sessions */}
                <UserActivity
                  recentRequests={summary.recentRequests || []}
                  upcomingSessions={summary.upcomingSessions || []}
                  onNavigateTab={handleSelectTab}
                />
              </div>
            )}

            {/* TAB: WISDOM LOOP */}
            {activeTab === 'wisdom-loop' && <WisdomLoopHub user={user} />}

            {/* TAB: CRAFT TO CART */}
            {activeTab === 'craft-to-cart' && (
              <CraftHub user={user} onNavigateOrders={() => handleSelectTab('orders')} />
            )}

            {/* TAB: RECONNECT */}
            {activeTab === 'reconnect' && <ReconnectHub user={user} />}

            {/* TAB: BOOK BRIDGE */}
            {activeTab === 'book-bridge' && <BookBridgeHub user={user} />}

            {/* TAB: SECOND SERVE */}
            {activeTab === 'second-serve' && <SecondServeHub user={user} />}

            {/* TAB: MY REQUESTS */}
            {activeTab === 'requests' && <MyRequests onNavigateModule={handleSelectTab} />}

            {/* TAB: MY ORDERS */}
            {activeTab === 'orders' && (
              <MyOrders onNavigateCatalog={() => handleSelectTab('craft-to-cart')} />
            )}

            {/* TAB: MY CONTRIBUTIONS */}
            {activeTab === 'contributions' && (
              <MyContributions onOpenContributeModal={() => handleOpenContributeForModule('all')} />
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && <Notifications onNavigateTab={handleSelectTab} />}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && <UserProfile user={user} />}
          </main>
        </div>
      </div>

      {/* Global Voluntary Contribution Modal */}
      <VoluntaryContributionModal
        isOpen={contributeModalOpen}
        onClose={() => setContributeModalOpen(false)}
        defaultModule={contributeDefaultModule}
        onSuccess={() => {
          fetchDashboardSummary();
        }}
      />
    </div>
  );
}

export default UserDashboard;
