import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Search,
  Plus,
  Clock,
  Thermometer,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Heart,
  Users,
  MapPin,
  Calendar
} from 'lucide-react';
import secondServeService from '../../../services/user/secondServeService';
import ScrollReveal from '../../../components/user/ScrollReveal';

const DIETARY_FILTERS = ['All', 'Vegetarian', 'Vegan', 'Non-Vegetarian', 'Dry Rations'];

export function SecondServeHub({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('board'); // 'board' | 'my-donations' | 'safety'
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('All');
  const [urgentOnly, setUrgentOnly] = useState(false);

  // Claim Food Modal
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimData, setClaimData] = useState({
    beneficiaryOrg: 'Sneha Care Shelter',
    volunteerCount: 2,
    etaMinutes: 45,
    contactPhone: ''
  });
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Donate Food Modal
  const [isListingOpen, setIsListingOpen] = useState(false);
  const [newDonation, setNewDonation] = useState({
    title: '',
    foodType: 'Cooked Meals',
    dietary: 'Vegetarian',
    portions: 50,
    temperatureType: 'hot_cooked', // 'hot_cooked' | 'chilled' | 'ambient'
    preparedAt: new Date().toISOString(),
    expiresInHours: 4,
    location: 'Indiranagar, Bengaluru',
    donorOrg: 'Wedding Banquet Catering',
    safetyNotes: 'Packed hot in insulated steel catering containers.'
  });

  // My Donations & Incoming Claims
  const [myDonations, setMyDonations] = useState([]);
  const [incomingClaims, setIncomingClaims] = useState([]);

  useEffect(() => {
    fetchDonations();
    fetchMyDonations();
  }, [selectedDiet, urgentOnly]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedDiet !== 'All') params.dietary = selectedDiet;
      if (urgentOnly) params.urgent = 'true';
      if (search) params.search = search;
      const res = await secondServeService.getDonations(params);
      if (res && res.donations) {
        setDonations(res.donations);
      }
    } catch {
      // Mock fallback
      setDonations([
        {
          _id: 'f1',
          title: 'Surplus Banquet Veg Biryani & Paneer Gravy',
          foodType: 'Cooked Meals',
          dietary: 'Vegetarian',
          portions: 85,
          temperatureType: 'hot_cooked',
          expiresAt: new Date(Date.now() + 2 * 3600000).toISOString(), // 2h left (Urgent!)
          location: 'Whitefield Banquet Hall, Bengaluru',
          donorName: 'Grand Heritage Events',
          safetyNotes: 'Maintained at 65°C in chafing warmers since preparation. Packed clean.',
          imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
        },
        {
          _id: 'f2',
          title: 'Fresh Packaged Sandwiches & Fruit Bowls',
          foodType: 'Snacks & Fruit',
          dietary: 'Vegetarian',
          portions: 45,
          temperatureType: 'chilled',
          expiresAt: new Date(Date.now() + 5 * 3600000).toISOString(),
          location: 'CyberCity Cafeteria, Hyderabad',
          donorName: 'Cisco Campus Dining',
          safetyNotes: 'Refrigerated at 4°C immediately after conference lunch.',
          imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80'
        },
        {
          _id: 'f3',
          title: 'Uncooked Rice, Lentils & Wheat Flour Sacks',
          foodType: 'Raw Staples',
          dietary: 'Dry Rations',
          portions: 250,
          temperatureType: 'ambient',
          expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
          location: 'APMC Market Yard, Navi Mumbai',
          donorName: 'Shri Ganesh Traders',
          safetyNotes: 'Sealed wholesale sacks, moisture-free storage.',
          imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyDonations = async () => {
    try {
      const res = await secondServeService.getMyDonations();
      if (res && res.donations) setMyDonations(res.donations);
      const claimsRes = await secondServeService.getIncomingClaims();
      if (claimsRes && claimsRes.claims) setIncomingClaims(claimsRes.claims);
    } catch {
      // Handled
    }
  };

  const isUrgent = (expiresAt) => {
    const diffHours = (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 3;
  };

  const getTimeRemaining = (expiresAt) => {
    const diffMs = new Date(expiresAt).getTime() - Date.now();
    if (diffMs <= 0) return 'Expired';
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    return `${hours}h ${mins}m left`;
  };

  const handleOpenClaim = (donation) => {
    setSelectedDonation(donation);
    setClaimData({
      beneficiaryOrg: 'Community Food Kitchen',
      volunteerCount: 2,
      etaMinutes: 30,
      contactPhone: ''
    });
    setClaimSuccess(false);
    setClaimModalOpen(true);
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    setClaimLoading(true);
    try {
      await secondServeService.claimDonation(selectedDonation._id, claimData);
      setClaimSuccess(true);
      fetchDonations();
      setTimeout(() => {
        setClaimModalOpen(false);
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to claim surplus food');
    } finally {
      setClaimLoading(false);
    }
  };

  const handleCreateDonation = async (e) => {
    e.preventDefault();
    try {
      const expiresAt = new Date(Date.now() + newDonation.expiresInHours * 3600000).toISOString();
      await secondServeService.createDonation({
        ...newDonation,
        expiresAt,
        images: ['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80']
      });
      setIsListingOpen(false);
      fetchDonations();
      fetchMyDonations();
      alert('Surplus food lot dispatched to rescue board successfully!');
    } catch (err) {
      alert(err.message || 'Failed to list food');
    }
  };

  const handleRespondClaim = async (claimId, status) => {
    try {
      await secondServeService.respondToClaim(claimId, { status });
      fetchMyDonations();
      fetchDonations();
    } catch (err) {
      alert(err.message || 'Failed to respond to claim');
    }
  };

  const getTempBadge = (type) => {
    switch (type) {
      case 'hot_cooked':
        return (
          <span style={{ fontSize: '0.72rem', color: '#BA1A1A', backgroundColor: 'rgba(186, 26, 26, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Thermometer size={12} /> Hot Cooked (&gt;60°C)
          </span>
        );
      case 'chilled':
        return (
          <span style={{ fontSize: '0.72rem', color: '#368F88', backgroundColor: 'rgba(54, 143, 136, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Thermometer size={12} /> Chilled (&lt;5°C)
          </span>
        );
      case 'ambient':
      default:
        return (
          <span style={{ fontSize: '0.72rem', color: '#70975D', backgroundColor: 'rgba(112, 151, 93, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Thermometer size={12} /> Ambient Stored
          </span>
        );
    }
  };

  return (
    <div className="second-serve-container">
      {/* Banner */}
      <ScrollReveal direction="down">
        <div
          className="card-surface"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(112, 151, 93, 0.3)',
            background: 'linear-gradient(135deg, rgba(112, 151, 93, 0.1) 0%, rgba(220, 235, 225, 0.3) 100%)',
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
                  backgroundColor: '#70975D',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  textTransform: 'uppercase'
                }}
              >
                Module 05
              </span>
              <span style={{ fontSize: '0.85rem', color: '#70975D', fontWeight: 600 }}>
                Surplus Food Rescue & Fast Dispatch
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text)' }}>
              Second Serve
            </h1>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '580px', lineHeight: 1.5 }}>
              Rapid matching of banquet, restaurant, and event surplus food with verified shelter kitchens before safe consumption windows close.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setIsListingOpen(true)}
              className="btn btn-primary hover-lift"
              style={{
                backgroundColor: '#70975D',
                borderColor: '#70975D',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <Plus size={16} />
              <span>Donate Surplus Meals</span>
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
          onClick={() => setActiveSubTab('board')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'board' ? 700 : 500,
            color: activeSubTab === 'board' ? '#70975D' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'board' ? '3px solid #70975D' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          Live Dispatch Board
        </button>
        <button
          onClick={() => setActiveSubTab('my-donations')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'my-donations' ? 700 : 500,
            color: activeSubTab === 'my-donations' ? '#70975D' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'my-donations' ? '3px solid #70975D' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>My Food Listings</span>
          {myDonations.length > 0 && (
            <span
              style={{
                backgroundColor: 'rgba(112, 151, 93, 0.2)',
                color: '#70975D',
                fontSize: '0.7rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                fontWeight: 700
              }}
            >
              {myDonations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('safety')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'safety' ? 700 : 500,
            color: activeSubTab === 'safety' ? '#70975D' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'safety' ? '3px solid #70975D' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          Safety Protocols
        </button>
      </div>

      {/* SUB-VIEW 1: DISPATCH BOARD */}
      {activeSubTab === 'board' && (
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
                placeholder="Search surplus lots, locality..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchDonations()}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
                {DIETARY_FILTERS.map((diet) => (
                  <button
                    key={diet}
                    onClick={() => setSelectedDiet(diet)}
                    style={{
                      border: '1px solid',
                      borderColor: selectedDiet === diet ? '#70975D' : 'var(--border)',
                      backgroundColor: selectedDiet === diet ? 'rgba(112, 151, 93, 0.15)' : 'var(--surface-alt)',
                      color: selectedDiet === diet ? '#70975D' : 'var(--text)',
                      borderRadius: '999px',
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {diet}
                  </button>
                ))}
              </div>

              {/* Urgent Filter Toggle */}
              <button
                onClick={() => setUrgentOnly(!urgentOnly)}
                style={{
                  border: '1px solid',
                  borderColor: urgentOnly ? '#BA1A1A' : 'var(--border)',
                  backgroundColor: urgentOnly ? 'rgba(186, 26, 26, 0.12)' : 'transparent',
                  color: urgentOnly ? '#BA1A1A' : 'var(--text)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <AlertTriangle size={14} />
                <span>Urgent (&lt;3h)</span>
              </button>
            </div>
          </div>

          {/* Donations Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {donations.map((item, idx) => {
              const urgent = isUrgent(item.expiresAt);
              return (
                <ScrollReveal key={item._id || idx} delay={idx * 70} direction="up">
                  <div
                    className="card-surface hover-lift"
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      border: urgent ? '1.5px solid #BA1A1A' : '1px solid var(--border)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      position: 'relative'
                    }}
                  >
                    <div style={{ position: 'relative', height: '170px', backgroundColor: 'var(--surface-alt)' }}>
                      <img
                        src={item.imageUrl || item.images?.[0] || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />

                      {/* Urgent Time Countdown Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: urgent ? '#BA1A1A' : 'rgba(40, 53, 46, 0.85)',
                          backdropFilter: 'blur(4px)',
                          color: '#fff',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.6rem',
                          borderRadius: '999px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }}
                      >
                        <Clock size={12} />
                        <span>{getTimeRemaining(item.expiresAt)}</span>
                      </div>

                      <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                        {getTempBadge(item.temperatureType)}
                      </div>
                    </div>

                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.72rem', color: '#70975D', fontWeight: 700, textTransform: 'uppercase' }}>
                          {item.dietary} • {item.foodType}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)' }}>
                          ~{item.portions} Servings
                        </span>
                      </div>

                      <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
                        {item.title}
                      </h3>

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 0.85rem', flex: 1 }}>
                        {item.safetyNotes}
                      </p>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                        📍 {item.location} • By {item.donorName || 'Hospitality Donor'}
                      </div>

                      <div
                        style={{
                          paddingTop: '0.75rem',
                          borderTop: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                          Free Shelter Allocation
                        </span>

                        <button
                          onClick={() => handleOpenClaim(item)}
                          className="btn btn-primary"
                          style={{
                            backgroundColor: urgent ? '#BA1A1A' : '#70975D',
                            borderColor: urgent ? '#BA1A1A' : '#70975D',
                            color: '#fff',
                            fontSize: '0.8rem',
                            padding: '0.4rem 0.85rem',
                            fontWeight: 700
                          }}
                        >
                          Claim Food Lot
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MY DONATIONS */}
      {activeSubTab === 'my-donations' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-surface" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '1.75rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: '0 0 1rem' }}>
              My Food Donations ({myDonations.length})
            </h3>
            {myDonations.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                You have not posted any food donations. Hosting a party or banquet? Post surplus food here!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {myDonations.map((d) => (
                  <div
                    key={d._id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface-alt)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{d.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {d.portions} Portions • Expiry: {new Date(d.expiresAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <span className="badge badge-mint">{d.status || 'Active Board'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Incoming Shelter Claims */}
          <div className="card-surface" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: '0 0 1rem' }}>
              Incoming Shelter Claims ({incomingClaims.length})
            </h3>
            {incomingClaims.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                No active shelter claims right now.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {incomingClaims.map((claim) => (
                  <div
                    key={claim._id}
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
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        Surplus Lot: {claim.targetItem?.title || 'Food Lot'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#70975D', fontWeight: 600 }}>
                        Shelter: {claim.beneficiaryOrg || 'Community Shelter'} • ETA: {claim.etaMinutes || 30} mins
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Volunteers dispatched: {claim.volunteerCount || 1}
                      </div>
                    </div>

                    {claim.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleRespondClaim(claim._id, 'accepted')}
                          className="btn btn-primary"
                          style={{ backgroundColor: '#70975D', borderColor: '#70975D', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                        >
                          Authorize Pickup
                        </button>
                        <button
                          onClick={() => handleRespondClaim(claim._id, 'rejected')}
                          className="btn btn-outline"
                          style={{ color: 'var(--error)', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="badge badge-mint">{claim.status}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: SAFETY PROTOCOLS */}
      {activeSubTab === 'safety' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-surface" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <ShieldCheck size={28} color="#70975D" />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Second Serve Food Safety & Cold-Chain Standards
              </h2>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              In compliance with FSSAI (Food Safety and Standards Authority of India) Good Food Share regulations, all food diverted through Second Serve follows strict time-temperature logs.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.35rem', color: '#BA1A1A', fontSize: '0.95rem' }}>1. Hot Cooked Meals</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Maintained above 60°C. Must be claimed, transported in insulated carriers, and served within 4 hours of preparation.
                </p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.35rem', color: '#368F88', fontSize: '0.95rem' }}>2. Chilled & Dairy</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Held below 5°C. Temperature checks mandatory at both donor handover and shelter receiving counter.
                </p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.35rem', color: '#70975D', fontSize: '0.95rem' }}>3. Packaging Integrity</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Food must be packed in food-grade stainless steel or single-use compostable containers with clear preparation time tags.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLAIM SURPLUS MODAL */}
      {claimModalOpen && selectedDonation && (
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
              maxWidth: '460px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '1.75rem'
            }}
          >
            {claimSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={44} color="#70975D" style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-heading)' }}>
                  Food Lot Claim Dispatched!
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Donor has been alerted. Please ensure insulated transport is en route.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitClaim}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
                    Claim Food for Shelter Kitchen
                  </h3>
                  <button type="button" onClick={() => setClaimModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Lot: <strong>{selectedDonation.title}</strong> (~{selectedDonation.portions} portions)
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Shelter / Kitchen / Beneficiary Org Name
                  </label>
                  <input
                    type="text"
                    required
                    value={claimData.beneficiaryOrg}
                    onChange={(e) => setClaimData({ ...claimData, beneficiaryOrg: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Pickup ETA (Mins)
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={claimData.etaMinutes}
                      onChange={(e) => setClaimData({ ...claimData, etaMinutes: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Volunteers
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={claimData.volunteerCount}
                      onChange={(e) => setClaimData({ ...claimData, volunteerCount: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Coordinator Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={claimData.contactPhone}
                    onChange={(e) => setClaimData({ ...claimData, contactPhone: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={claimLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', backgroundColor: '#70975D', borderColor: '#70975D', color: '#fff', padding: '0.7rem' }}
                >
                  {claimLoading ? 'Authorizing...' : 'Authorize Food Rescue'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DONATE FOOD MODAL */}
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
                Donate Surplus Food
              </h3>
              <button type="button" onClick={() => setIsListingOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDonation}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Meal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 Packs Dal Makhani, Jeera Rice & Rotis"
                  value={newDonation.title}
                  onChange={(e) => setNewDonation({ ...newDonation, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Dietary</label>
                  <select
                    value={newDonation.dietary}
                    onChange={(e) => setNewDonation({ ...newDonation, dietary: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Dry Rations">Dry Rations</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Approx. Servings</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={newDonation.portions}
                    onChange={(e) => setNewDonation({ ...newDonation, portions: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Temperature State</label>
                  <select
                    value={newDonation.temperatureType}
                    onChange={(e) => setNewDonation({ ...newDonation, temperatureType: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  >
                    <option value="hot_cooked">Hot Cooked (&gt;60°C)</option>
                    <option value="chilled">Chilled / Refrigerated (&lt;5°C)</option>
                    <option value="ambient">Ambient / Dry Staples</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Safe Window (Hours)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={72}
                    value={newDonation.expiresInHours}
                    onChange={(e) => setNewDonation({ ...newDonation, expiresInHours: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Pickup Locality / Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Palace Hall, J.P. Nagar, Bengaluru"
                  value={newDonation.location}
                  onChange={(e) => setNewDonation({ ...newDonation, location: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Packaging & Safety Notes</label>
                <textarea
                  rows={2}
                  required
                  value={newDonation.safetyNotes}
                  onChange={(e) => setNewDonation({ ...newDonation, safetyNotes: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem', resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', backgroundColor: '#70975D', borderColor: '#70975D', color: '#fff', padding: '0.75rem' }}
              >
                Broadcast to Food Rescue Board
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SecondServeHub;
