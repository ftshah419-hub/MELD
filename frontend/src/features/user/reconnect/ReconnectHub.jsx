import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Search,
  Plus,
  CheckCircle,
  Clock,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  Wrench,
  Recycle,
  ShieldCheck,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import reconnectService from '../../../services/user/reconnectService';
import ScrollReveal from '../../../components/user/ScrollReveal';

const DEVICE_TYPES = ['All', 'Laptop', 'Tablet', 'Smartphone', 'Desktop', 'Accessories'];
const CONDITIONS = ['All', 'working', 'needs_repair', 'for_parts'];

export function ReconnectHub({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('browse'); // 'browse' | 'my-listings'
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Request Device Modal
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestData, setRequestData] = useState({
    purpose: 'student', // 'student' | 'repairer' | 'recycler'
    reason: '',
    contactPhone: ''
  });
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // List Device Modal
  const [isListingOpen, setIsListingOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    title: '',
    deviceType: 'Laptop',
    brand: '',
    model: '',
    specs: '',
    condition: 'working',
    location: 'Bengaluru, Karnataka',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
  });

  // My Listings & Incoming Requests
  const [myListings, setMyListings] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);

  useEffect(() => {
    fetchDevices();
    fetchMyListings();
  }, [selectedType]);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedType !== 'All') params.deviceType = selectedType;
      if (search) params.search = search;
      const res = await reconnectService.getDevices(params);
      if (res && res.devices) {
        setDevices(res.devices);
      }
    } catch {
      // Mock fallback
      setDevices([
        {
          _id: 'd1',
          title: 'Lenovo ThinkPad T480 (Core i5 / 8GB RAM)',
          deviceType: 'Laptop',
          brand: 'Lenovo',
          model: 'ThinkPad T480',
          condition: 'working',
          specs: 'Intel Core i5 8th Gen, 8GB DDR4, 256GB SSD, battery holds 3h',
          location: 'Koramangala, Bengaluru',
          donorName: 'Rahul Verma',
          imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80'
        },
        {
          _id: 'd2',
          title: 'iPad 7th Gen (32GB WiFi)',
          deviceType: 'Tablet',
          brand: 'Apple',
          model: 'iPad 10.2"',
          condition: 'working',
          specs: 'Fully functional, minor cosmetic scratch on back aluminum shell. Ideal for online classes.',
          location: 'Pune, Maharashtra',
          donorName: 'Dr. Meenakshi',
          imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80'
        },
        {
          _id: 'd3',
          title: 'Dell Inspiron Desktop Tower (Boot issue)',
          deviceType: 'Desktop',
          brand: 'Dell',
          model: 'Inspiron 3880',
          condition: 'needs_repair',
          specs: 'SMPS functional, beep error on POST. Perfect for technical student/repair trainee.',
          location: 'Hyderabad, Telangana',
          donorName: 'TechServe Solutions',
          imageUrl: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyListings = async () => {
    try {
      const res = await reconnectService.getMyListings();
      if (res && res.devices) setMyListings(res.devices);
      const incRes = await reconnectService.getIncomingRequests();
      if (incRes && incRes.requests) setIncomingRequests(incRes.requests);
    } catch {
      // Handled
    }
  };

  const handleOpenRequest = (device) => {
    setSelectedDevice(device);
    setRequestData({ purpose: 'student', reason: '', contactPhone: '' });
    setRequestSuccess(false);
    setRequestModalOpen(true);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    try {
      await reconnectService.requestDevice(selectedDevice._id, requestData);
      setRequestSuccess(true);
      fetchDevices();
      setTimeout(() => {
        setRequestModalOpen(false);
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to submit request');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleCreateDevice = async (e) => {
    e.preventDefault();
    try {
      await reconnectService.createDevice({
        ...newDevice,
        images: [newDevice.imageUrl]
      });
      setIsListingOpen(false);
      fetchDevices();
      fetchMyListings();
      alert('Device donated to ReConnect circular stream successfully!');
    } catch (err) {
      alert(err.message || 'Failed to list device');
    }
  };

  const handleRespondRequest = async (requestId, status) => {
    try {
      await reconnectService.respondToRequest(requestId, { status });
      fetchMyListings();
      fetchDevices();
    } catch (err) {
      alert(err.message || 'Failed to update request');
    }
  };

  const getConditionBadge = (cond) => {
    switch (cond) {
      case 'working':
        return <span className="badge badge-mint">Ready to Use</span>;
      case 'needs_repair':
        return <span className="badge badge-gold">Needs Fix</span>;
      case 'for_parts':
        return <span className="badge badge-surface">E-waste / Salvage</span>;
      default:
        return <span className="badge badge-surface">{cond}</span>;
    }
  };

  return (
    <div className="reconnect-container">
      {/* Banner */}
      <ScrollReveal direction="down">
        <div
          className="card-surface"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(54, 143, 136, 0.25)',
            background: 'linear-gradient(135deg, rgba(54, 143, 136, 0.08) 0%, rgba(220, 235, 225, 0.3) 100%)',
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
                  backgroundColor: '#368F88',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  textTransform: 'uppercase'
                }}
              >
                Module 03
              </span>
              <span style={{ fontSize: '0.85rem', color: '#368F88', fontWeight: 600 }}>
                Circular Electronics Lifeline
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text)' }}>
              ReConnect
            </h1>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '580px', lineHeight: 1.5 }}>
              Bridging the digital divide by diverting idle electronics to underserved students, repair apprentices, and responsible recyclers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setIsListingOpen(true)}
              className="btn btn-primary hover-lift"
              style={{
                backgroundColor: '#368F88',
                borderColor: '#368F88',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <Plus size={16} />
              <span>Donate Device</span>
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
          onClick={() => setActiveSubTab('browse')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'browse' ? 700 : 500,
            color: activeSubTab === 'browse' ? '#368F88' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'browse' ? '3px solid #368F88' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          Available Devices
        </button>
        <button
          onClick={() => setActiveSubTab('my-listings')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'my-listings' ? 700 : 500,
            color: activeSubTab === 'my-listings' ? '#368F88' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'my-listings' ? '3px solid #368F88' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>My Donated Devices</span>
          {myListings.length > 0 && (
            <span
              style={{
                backgroundColor: 'rgba(54, 143, 136, 0.15)',
                color: '#368F88',
                fontSize: '0.7rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                fontWeight: 700
              }}
            >
              {myListings.length}
            </span>
          )}
        </button>
      </div>

      {/* SUB-VIEW 1: BROWSE */}
      {activeSubTab === 'browse' && (
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
                placeholder="Search laptops, tablets, parts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchDevices()}
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
              {DEVICE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  style={{
                    border: '1px solid',
                    borderColor: selectedType === type ? '#368F88' : 'var(--border)',
                    backgroundColor: selectedType === type ? 'rgba(54, 143, 136, 0.12)' : 'var(--surface-alt)',
                    color: selectedType === type ? '#368F88' : 'var(--text)',
                    borderRadius: '999px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Device Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {devices.map((dev, idx) => (
              <ScrollReveal key={dev._id || idx} delay={idx * 70} direction="up">
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
                  <div style={{ position: 'relative', height: '180px', backgroundColor: 'var(--surface-alt)' }}>
                    <img
                      src={dev.images?.[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'}
                      alt={dev.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      {getConditionBadge(dev.condition)}
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.72rem', color: '#368F88', fontWeight: 700, textTransform: 'uppercase' }}>
                      {dev.brand} • {dev.deviceType}
                    </span>
                    <h3 style={{ margin: '0.25rem 0 0.5rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
                      {dev.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 0.75rem', flex: 1 }}>
                      {dev.specs}
                    </p>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                      📍 {dev.location || 'Local Community Hub'}
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
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Donor: <strong>{dev.donorName || 'Community Peer'}</strong>
                      </span>

                      <button
                        onClick={() => handleOpenRequest(dev)}
                        className="btn btn-primary"
                        style={{ backgroundColor: '#368F88', borderColor: '#368F88', fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                      >
                        Request Device
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MY LISTINGS & CLAIMS */}
      {activeSubTab === 'my-listings' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-surface" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '1.75rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: '0 0 1rem' }}>
              My Donated Devices ({myListings.length})
            </h3>
            {myListings.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                You have not listed any devices yet. Have an unused laptop or phone? Click "Donate Device" above!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {myListings.map((dev) => (
                  <div
                    key={dev._id}
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
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{dev.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dev.specs}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="badge badge-mint">{dev.status || 'Available'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Incoming Claim Requests */}
          <div className="card-surface" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: '0 0 1rem' }}>
              Incoming Student & Repairer Requests ({incomingRequests.length})
            </h3>
            {incomingRequests.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                No pending claims on your devices.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {incomingRequests.map((req) => (
                  <div
                    key={req._id}
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
                        Device: {req.targetItem?.title || 'Electronics Lot'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#368F88', fontWeight: 600 }}>
                        Purpose: {req.purpose?.toUpperCase()} • Requested by {req.userId?.name || 'Applicant'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        "{req.reason}"
                      </div>
                    </div>

                    {req.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleRespondRequest(req._id, 'accepted')}
                          className="btn btn-primary"
                          style={{ backgroundColor: '#368F88', borderColor: '#368F88', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRespondRequest(req._id, 'rejected')}
                          className="btn btn-outline"
                          style={{ color: 'var(--error)', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="badge badge-mint">{req.status}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* REQUEST DEVICE MODAL */}
      {requestModalOpen && selectedDevice && (
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
            {requestSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={44} color="#368F88" style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-heading)' }}>
                  Device Request Submitted!
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  The donor has been notified to confirm pickup / shipment details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
                    Request Circular Device
                  </h3>
                  <button type="button" onClick={() => setRequestModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Item: <strong>{selectedDevice.title}</strong>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Intended Purpose
                  </label>
                  <select
                    value={requestData.purpose}
                    onChange={(e) => setRequestData({ ...requestData, purpose: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  >
                    <option value="student">Student / Academic Need</option>
                    <option value="repairer">Vocational Repair Training</option>
                    <option value="recycler">Responsible E-Waste Recycling</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Statement of Need / Justification
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell the donor how this device will be put to meaningful use..."
                    value={requestData.reason}
                    onChange={(e) => setRequestData({ ...requestData, reason: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem', resize: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Direct Phone for Handover
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={requestData.contactPhone}
                    onChange={(e) => setRequestData({ ...requestData, contactPhone: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={requestLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', backgroundColor: '#368F88', borderColor: '#368F88', padding: '0.7rem' }}
                >
                  {requestLoading ? 'Submitting...' : 'Submit Device Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DONATE DEVICE MODAL */}
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
              maxWidth: '480px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
                Donate Electronics to ReConnect
              </h3>
              <button type="button" onClick={() => setIsListingOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDevice}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell Latitude 7490 Laptop"
                  value={newDevice.title}
                  onChange={(e) => setNewDevice({ ...newDevice, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Type</label>
                  <select
                    value={newDevice.deviceType}
                    onChange={(e) => setNewDevice({ ...newDevice, deviceType: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  >
                    {DEVICE_TYPES.filter((t) => t !== 'All').map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Condition</label>
                  <select
                    value={newDevice.condition}
                    onChange={(e) => setNewDevice({ ...newDevice, condition: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  >
                    <option value="working">Fully Functional</option>
                    <option value="needs_repair">Needs Repair</option>
                    <option value="for_parts">Salvage / For Parts</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Specs & Battery Condition</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. 8GB RAM, 256GB SSD, charger included, works plugged in..."
                  value={newDevice.specs}
                  onChange={(e) => setNewDevice({ ...newDevice, specs: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem', resize: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>City / Pickup Locality</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indiranagar, Bengaluru"
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', backgroundColor: '#368F88', borderColor: '#368F88', padding: '0.75rem' }}
              >
                Donate to Circular Hub
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReconnectHub;
