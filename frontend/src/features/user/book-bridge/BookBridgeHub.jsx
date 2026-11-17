import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Bookmark,
  CheckCircle,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Library
} from 'lucide-react';
import bookBridgeService from '../../../services/user/bookBridgeService';
import ScrollReveal from '../../../components/user/ScrollReveal';
import PhotoUploadField from '../../../components/user/PhotoUploadField';

const GENRES = ['All', 'Science & Tech', 'Literature & Fiction', 'Competitive Exams', 'Children & Early Learning', 'Philosophy', 'History'];
const DROPBOX_HUBS = [
  { name: 'City Central Library Community Shelf', city: 'Bengaluru', address: 'Cubbon Park Road, Tasker Town', openHours: '9 AM - 7 PM' },
  { name: 'Green Tree Social Youth Centre', city: 'Delhi', address: 'Hauz Khas Village, Near Deer Park', openHours: '10 AM - 6 PM' },
  { name: 'Kala Ghoda Cultural Reading Kiosk', city: 'Mumbai', address: 'Fort Arts District', openHours: '8 AM - 8 PM' }
];

export function BookBridgeHub({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('catalog'); // 'catalog' | 'my-donations' | 'dropboxes'
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Request Book Modal
  const [selectedBook, setSelectedBook] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestData, setRequestData] = useState({
    pickupMethod: 'dropbox', // 'dropbox' | 'handoff'
    readerNotes: '',
    contactPhone: ''
  });
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Donate Book Modal
  const [isListingOpen, setIsListingOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: 'Science & Tech',
    gradeLevel: 'Secondary',
    language: 'English',
    condition: 'good',
    location: 'Bengaluru, Karnataka',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  });

  // My Donations & Incoming Requests
  const [myListings, setMyListings] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchMyDonations();
  }, [selectedGenre]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (search) params.search = search;
      const res = await bookBridgeService.getBooks(params);
      if (res && res.books) {
        setBooks(res.books);
      }
    } catch {
      // Mock fallback
      setBooks([
        {
          _id: 'b1',
          title: 'NCERT Class 11 & 12 Physics Set (Complete)',
          author: 'Prof. H.C. Verma & NCERT Board',
          genre: 'Competitive Exams',
          gradeLevel: 'Higher Secondary',
          language: 'English',
          condition: 'good',
          location: 'Jayanagar, Bengaluru',
          donorName: 'Ananya Rao',
          coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
        },
        {
          _id: 'b2',
          title: 'Malgudi Days & Selected Stories',
          author: 'R.K. Narayan',
          genre: 'Literature & Fiction',
          gradeLevel: 'General Reader',
          language: 'English',
          condition: 'like_new',
          location: 'Mysuru, Karnataka',
          donorName: 'Govind Swamy',
          coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
        },
        {
          _id: 'b3',
          title: 'Illustrated Encyclopedia of World Geography',
          author: 'National Geographic Kids',
          genre: 'Children & Early Learning',
          gradeLevel: 'Primary',
          language: 'English',
          condition: 'good',
          location: 'Pune, Maharashtra',
          donorName: 'Kavita Menon',
          coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyDonations = async () => {
    try {
      const res = await bookBridgeService.getMyListings();
      if (res && res.books) setMyListings(res.books);
      const incRes = await bookBridgeService.getIncomingRequests();
      if (incRes && incRes.requests) setIncomingRequests(incRes.requests);
    } catch {
      // Handled
    }
  };

  const handleOpenRequest = (book) => {
    setSelectedBook(book);
    setRequestData({ pickupMethod: 'dropbox', readerNotes: '', contactPhone: '' });
    setRequestSuccess(false);
    setRequestModalOpen(true);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    try {
      await bookBridgeService.requestBook(selectedBook._id, requestData);
      setRequestSuccess(true);
      fetchBooks();
      setTimeout(() => {
        setRequestModalOpen(false);
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to submit book request');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      await bookBridgeService.createBook({
        ...newBook,
        images: newBook.coverUrl
          ? [newBook.coverUrl]
          : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80']
      });
      setIsListingOpen(false);
      fetchBooks();
      fetchMyDonations();
      alert('Book listed on Book Bridge shelves successfully!');
    } catch (err) {
      alert(err.message || 'Failed to list book');
    }
  };

  const handleRespondRequest = async (requestId, status) => {
    try {
      await bookBridgeService.respondToRequest(requestId, { status });
      fetchMyDonations();
      fetchBooks();
    } catch (err) {
      alert(err.message || 'Failed to update request');
    }
  };

  return (
    <div className="book-bridge-container">
      {/* Banner */}
      <ScrollReveal direction="down">
        <div
          className="card-surface"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(211, 163, 79, 0.3)',
            background: 'linear-gradient(135deg, rgba(211, 163, 79, 0.1) 0%, rgba(246, 243, 233, 0.7) 100%)',
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
                  backgroundColor: '#D3A34F',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  textTransform: 'uppercase'
                }}
              >
                Module 04
              </span>
              <span style={{ fontSize: '0.85rem', color: '#996C0B', fontWeight: 600 }}>
                Community Knowledge Shelves
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text)' }}>
              Book Bridge
            </h1>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '580px', lineHeight: 1.5 }}>
              Pass along textbooks, literature, and children's stories to keep pages turning for avid learners and grassroots libraries.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setIsListingOpen(true)}
              className="btn btn-primary hover-lift"
              style={{
                backgroundColor: '#D3A34F',
                borderColor: '#D3A34F',
                color: '#fff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <Plus size={16} />
              <span>Donate Books</span>
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
            color: activeSubTab === 'catalog' ? '#996C0B' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'catalog' ? '3px solid #D3A34F' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          Book Catalog
        </button>
        <button
          onClick={() => setActiveSubTab('my-donations')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'my-donations' ? 700 : 500,
            color: activeSubTab === 'my-donations' ? '#996C0B' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'my-donations' ? '3px solid #D3A34F' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>My Donated Books</span>
          {myListings.length > 0 && (
            <span
              style={{
                backgroundColor: 'rgba(211, 163, 79, 0.2)',
                color: '#996C0B',
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
        <button
          onClick={() => setActiveSubTab('dropboxes')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'dropboxes' ? 700 : 500,
            color: activeSubTab === 'dropboxes' ? '#996C0B' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'dropboxes' ? '3px solid #D3A34F' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          Drop-box Hubs
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
                placeholder="Search by title, author, exam..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchBooks()}
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
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  style={{
                    border: '1px solid',
                    borderColor: selectedGenre === g ? '#D3A34F' : 'var(--border)',
                    backgroundColor: selectedGenre === g ? 'rgba(211, 163, 79, 0.15)' : 'var(--surface-alt)',
                    color: selectedGenre === g ? '#996C0B' : 'var(--text)',
                    borderRadius: '999px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Book Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {books.map((book, idx) => (
              <ScrollReveal key={book._id || idx} delay={idx * 70} direction="up">
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
                  <div style={{ position: 'relative', height: '170px', backgroundColor: 'var(--surface-alt)' }}>
                    <img
                      src={book.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                      alt={book.title}
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
                      {book.condition?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.72rem', color: '#996C0B', fontWeight: 700, textTransform: 'uppercase' }}>
                      {book.genre} • {book.gradeLevel}
                    </span>
                    <h3 style={{ margin: '0.25rem 0 0.2rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
                      {book.title}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      by {book.author}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '1rem', marginTop: 'auto' }}>
                      📍 {book.location || 'Local Community Library'}
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
                        Free Community Loan
                      </span>

                      <button
                        onClick={() => handleOpenRequest(book)}
                        className="btn btn-primary"
                        style={{ backgroundColor: '#D3A34F', borderColor: '#D3A34F', color: '#fff', fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                      >
                        Borrow / Request
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MY DONATIONS */}
      {activeSubTab === 'my-donations' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-surface" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '1.75rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: '0 0 1rem' }}>
              My Donated Books ({myListings.length})
            </h3>
            {myListings.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                You have not shared any books yet. Clean out your shelves and give a book new life!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {myListings.map((b) => (
                  <div
                    key={b._id}
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
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{b.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>by {b.author}</div>
                    </div>
                    <span className="badge badge-mint">{b.status || 'Available'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Incoming Borrower Requests */}
          <div className="card-surface" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: '0 0 1rem' }}>
              Incoming Borrower Requests ({incomingRequests.length})
            </h3>
            {incomingRequests.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                No active borrowing requests at this time.
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
                        Book: {req.targetItem?.title || 'Book Title'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#996C0B', fontWeight: 600 }}>
                        Reader: {req.userId?.name || 'Student'} • Method: {req.pickupMethod?.toUpperCase()}
                      </div>
                      {req.readerNotes && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          "{req.readerNotes}"
                        </div>
                      )}
                    </div>

                    {req.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleRespondRequest(req._id, 'accepted')}
                          className="btn btn-primary"
                          style={{ backgroundColor: '#D3A34F', borderColor: '#D3A34F', color: '#fff', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                        >
                          Approve Loan
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

      {/* SUB-VIEW 3: DROPBOX HUBS */}
      {activeSubTab === 'dropboxes' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-surface" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <Library size={24} color="#996C0B" />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                Official Book Bridge Drop-Box Network
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Convenient 24/7 public book drop cabinets maintained by volunteer librarians. Drop off books here anytime with your generated donation transit slip.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {DROPBOX_HUBS.map((hub, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1.15rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                      {hub.name}
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      📍 {hub.address}, {hub.city}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#996C0B', fontWeight: 600, marginTop: '0.25rem' }}>
                      Open: {hub.openHours}
                    </div>
                  </div>

                  <span className="badge badge-mint">Active Hub</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REQUEST BOOK MODAL */}
      {requestModalOpen && selectedBook && (
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
                <CheckCircle size={44} color="#D3A34F" style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-heading)' }}>
                  Borrow Request Confirmed!
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Your book transit slip has been issued. Donor will confirm shelf placement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
                    Borrow from Book Bridge
                  </h3>
                  <button type="button" onClick={() => setRequestModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Book: <strong>{selectedBook.title}</strong> by {selectedBook.author}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Preferred Pickup Format
                  </label>
                  <select
                    value={requestData.pickupMethod}
                    onChange={(e) => setRequestData({ ...requestData, pickupMethod: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  >
                    <option value="dropbox">Community Drop-Box Locker</option>
                    <option value="handoff">Direct Contactless Hand-off</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Intended Reading Period / Notes
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Preparing for JEE 2026, will return to shelf in 3 months..."
                    value={requestData.readerNotes}
                    onChange={(e) => setRequestData({ ...requestData, readerNotes: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem', resize: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Contact Phone
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
                  style={{ width: '100%', backgroundColor: '#D3A34F', borderColor: '#D3A34F', color: '#fff', padding: '0.7rem' }}
                >
                  {requestLoading ? 'Reserving...' : 'Submit Borrow Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DONATE BOOK MODAL */}
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
                Donate Books to Book Bridge
              </h3>
              <button type="button" onClick={() => setIsListingOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBook}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fundamentals of Electric Circuits"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Author</label>
                  <input
                    type="text"
                    required
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Genre</label>
                  <select
                    value={newBook.genre}
                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  >
                    {GENRES.filter((g) => g !== 'All').map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Academic Level</label>
                  <select
                    value={newBook.gradeLevel}
                    onChange={(e) => setNewBook({ ...newBook, gradeLevel: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  >
                    <option value="Primary">Primary School</option>
                    <option value="Secondary">Secondary / High School</option>
                    <option value="Higher Secondary">Higher Secondary (11-12)</option>
                    <option value="Undergraduate">College / University</option>
                    <option value="General Reader">General Reader</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Condition</label>
                  <select
                    value={newBook.condition}
                    onChange={(e) => setNewBook({ ...newBook, condition: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                  >
                    <option value="like_new">Like New</option>
                    <option value="good">Good (Clean pages)</option>
                    <option value="readable">Readable (Annotations/Worn)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Locality / City</label>
                <input
                  type="text"
                  required
                  value={newBook.location}
                  onChange={(e) => setNewBook({ ...newBook, location: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                />
              </div>

              <PhotoUploadField
                label="Book Cover Photograph"
                value={newBook.coverUrl}
                onChange={(url) => setNewBook({ ...newBook, coverUrl: url })}
                folder="meld/books"
              />

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', backgroundColor: '#D3A34F', borderColor: '#D3A34F', color: '#fff', padding: '0.75rem' }}
              >
                Place on Community Shelf
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookBridgeHub;
