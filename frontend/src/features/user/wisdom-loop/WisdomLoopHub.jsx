import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Video,
  UserPlus,
  Send,
  MessageSquare,
  Award,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import wisdomLoopService from '../../../services/user/wisdomLoopService';
import ScrollReveal from '../../../components/user/ScrollReveal';

const EXPERTISE_TAGS = ['All', 'Technology', 'Social Impact', 'Design & Craft', 'Entrepreneurship', 'Education', 'Leadership'];

export function WisdomLoopHub({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('mentors'); // 'mentors' | 'my-sessions' | 'mentor-studio'
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Modals
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    topic: '',
    preferredDate: '',
    preferredTime: '10:00 AM',
    notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // My Sessions
  const [sessions, setSessions] = useState([]);
  const [feedbackSession, setFeedbackSession] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: '' });

  // Mentor Studio (incoming requests & application)
  const [myMentorProfile, setMyMentorProfile] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [mentorApp, setMentorApp] = useState({
    title: '',
    expertise: '',
    yearsExperience: 5,
    bio: '',
    availability: 'weekends'
  });
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchMentors();
    fetchMySessions();
    fetchMyMentorProfile();
  }, [selectedTag]);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedTag !== 'All') params.expertise = selectedTag;
      if (search) params.search = search;
      const res = await wisdomLoopService.getMentors(params);
      if (res && res.mentors) {
        setMentors(res.mentors);
      }
    } catch {
      // Mock fallback if offline
      setMentors([
        {
          _id: 'm1',
          name: 'Dr. Anandita Sharma',
          title: 'Former Director of Rural Tech Initiative',
          expertise: ['Technology', 'Education', 'Social Impact'],
          yearsExperience: 22,
          rating: 4.9,
          totalSessions: 84,
          bio: 'Spent two decades bridging digital divides in tribal communities. Passionate about mentoring next-gen innovators.',
          availability: 'Weekends & Evenings',
          hourlyRate: 0 // Free social mentorship
        },
        {
          _id: 'm2',
          name: 'Rameshwar Nath',
          title: 'Master Loom Weaver & Design Historian',
          expertise: ['Design & Craft', 'Entrepreneurship'],
          yearsExperience: 35,
          rating: 5.0,
          totalSessions: 112,
          bio: 'Preserving authentic handloom weaving traditions. Mentoring modern textile designers on sustainable craft.',
          availability: 'Flexible',
          hourlyRate: 0
        },
        {
          _id: 'm3',
          name: 'Sarah Joseph',
          title: 'Head of Circular Logistics at EcoTrack',
          expertise: ['Social Impact', 'Leadership', 'Technology'],
          yearsExperience: 14,
          rating: 4.8,
          totalSessions: 46,
          bio: 'Specialist in cold-chain logistics, zero-waste supply systems, and impact startup governance.',
          availability: 'Weekday Evenings',
          hourlyRate: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySessions = async () => {
    try {
      const res = await wisdomLoopService.getMySessions();
      if (res && res.sessions) setSessions(res.sessions);
    } catch {
      // Handled
    }
  };

  const fetchMyMentorProfile = async () => {
    try {
      const res = await wisdomLoopService.getMyMentorProfile();
      if (res && res.mentorProfile) {
        setMyMentorProfile(res.mentorProfile);
        const reqRes = await wisdomLoopService.getIncomingRequests();
        if (reqRes && reqRes.requests) setIncomingRequests(reqRes.requests);
      }
    } catch {
      // Handled
    }
  };

  const handleOpenBooking = (mentor) => {
    setSelectedMentor(mentor);
    setBookingData({
      topic: `1:1 Mentorship in ${mentor.expertise?.[0] || 'Domain Knowledge'}`,
      preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      preferredTime: '06:00 PM',
      notes: ''
    });
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      await wisdomLoopService.requestSession({
        mentorId: selectedMentor._id,
        subject: bookingData.topic,
        topic: bookingData.topic,
        learningGoals: bookingData.notes || bookingData.topic || '1:1 Mentorship Session',
        notes: bookingData.notes,
        preferredTimes: `${bookingData.preferredDate} at ${bookingData.preferredTime}`,
        preferredDate: bookingData.preferredDate,
        preferredTime: bookingData.preferredTime
      });
      setBookingSuccess(true);
      fetchMySessions();
      setTimeout(() => {
        setBookingModalOpen(false);
        setActiveSubTab('my-sessions');
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to request session');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await wisdomLoopService.submitFeedback(feedbackSession._id, feedbackData);
      setFeedbackSession(null);
      fetchMySessions();
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    }
  };

  const handleBecomeMentor = async (e) => {
    e.preventDefault();
    try {
      const expertiseList = mentorApp.expertise
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const effectiveTitle = mentorApp.title.trim() ||
        (expertiseList.length > 0 ? `${expertiseList[0]} Specialist` : 'Mentor');

      await wisdomLoopService.becomeMentor({
        title: effectiveTitle,
        expertiseAreas: expertiseList,
        yearsOfExperience: Number(mentorApp.yearsExperience),
        bio: mentorApp.bio,
        availability: mentorApp.availability
      });
      setActionMessage('Mentor application submitted successfully! Your mentor profile is active.');
      fetchMyMentorProfile();
    } catch (err) {
      alert(err.message || 'Failed to apply as mentor');
    }
  };

  const handleRespondToRequest = async (requestId, status) => {
    try {
      await wisdomLoopService.respondToSessionRequest(requestId, {
        status,
        meetingLink: status === 'accepted' ? 'https://meet.google.com/meld-session' : ''
      });
      fetchMyMentorProfile();
    } catch (err) {
      alert(err.message || 'Failed to respond');
    }
  };

  return (
    <div className="wisdom-loop-container">
      {/* Banner */}
      <ScrollReveal direction="down">
        <div
          className="card-surface"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(101, 115, 184, 0.25)',
            background: 'linear-gradient(135deg, rgba(101, 115, 184, 0.08) 0%, rgba(220, 235, 225, 0.2) 100%)',
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
                  backgroundColor: '#6573B8',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  textTransform: 'uppercase'
                }}
              >
                Module 01
              </span>
              <span style={{ fontSize: '0.85rem', color: '#6573B8', fontWeight: 600 }}>
                Intergenerational Knowledge Loop
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text)' }}>
              Wisdom Loop
            </h1>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '580px', lineHeight: 1.5 }}>
              Connecting seasoned masters, retired scholars, and industry stalwarts with passionate learners and social innovators for 1:1 wisdom transfer.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveSubTab('mentor-studio')}
              className="btn btn-outline hover-lift"
              style={{
                borderColor: '#6573B8',
                color: '#6573B8',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <UserPlus size={16} />
              <span>{myMentorProfile ? 'Mentor Studio' : 'Become a Mentor'}</span>
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
          onClick={() => setActiveSubTab('mentors')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'mentors' ? 700 : 500,
            color: activeSubTab === 'mentors' ? '#6573B8' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'mentors' ? '3px solid #6573B8' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          Find Mentors
        </button>
        <button
          onClick={() => setActiveSubTab('my-sessions')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'my-sessions' ? 700 : 500,
            color: activeSubTab === 'my-sessions' ? '#6573B8' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'my-sessions' ? '3px solid #6573B8' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>My Sessions</span>
          {sessions.length > 0 && (
            <span
              style={{
                backgroundColor: 'rgba(101, 115, 184, 0.15)',
                color: '#6573B8',
                fontSize: '0.7rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                fontWeight: 700
              }}
            >
              {sessions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('mentor-studio')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.65rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: activeSubTab === 'mentor-studio' ? 700 : 500,
            color: activeSubTab === 'mentor-studio' ? '#6573B8' : 'var(--text-muted)',
            borderBottom: activeSubTab === 'mentor-studio' ? '3px solid #6573B8' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          Mentor Studio
        </button>
      </div>

      {/* SUB-VIEW 1: MENTORS DISCOVERY */}
      {activeSubTab === 'mentors' && (
        <div>
          {/* Filters & Search Bar */}
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
                placeholder="Search mentors by topic, name, craft..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchMentors()}
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

            {/* Tag Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {EXPERTISE_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    border: '1px solid',
                    borderColor: selectedTag === tag ? '#6573B8' : 'var(--border)',
                    backgroundColor: selectedTag === tag ? 'rgba(101, 115, 184, 0.12)' : 'var(--surface-alt)',
                    color: selectedTag === tag ? '#6573B8' : 'var(--text)',
                    borderRadius: '999px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Mentors Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {mentors.map((mentor, idx) => (
              <ScrollReveal key={mentor._id || idx} delay={idx * 80} direction="up">
                <div
                  className="card-surface hover-lift"
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Mentor Header */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'rgba(101, 115, 184, 0.15)',
                          color: '#6573B8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.25rem'
                        }}
                      >
                        {mentor.name?.charAt(0) || 'M'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
                          {mentor.name}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                          {mentor.title || 'Master Mentor'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.35rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#D7A94A', fontSize: '0.8rem', fontWeight: 700 }}>
                            <Star size={14} fill="#D7A94A" />
                            {mentor.rating || '5.0'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                            • {mentor.yearsExperience || 10}+ yrs exp
                          </span>
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                      {mentor.bio}
                    </p>

                    {/* Expertise Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      {(mentor.expertise || []).map((exp, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(101, 115, 184, 0.08)',
                            color: '#6573B8'
                          }}
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
                      Pro Bono Impact
                    </span>
                    <button
                      onClick={() => handleOpenBooking(mentor)}
                      className="btn btn-primary hover-lift"
                      style={{
                        backgroundColor: '#6573B8',
                        borderColor: '#6573B8',
                        fontSize: '0.85rem',
                        padding: '0.45rem 1rem'
                      }}
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MY SESSIONS */}
      {activeSubTab === 'my-sessions' && (
        <div>
          {sessions.length === 0 ? (
            <div
              className="card-surface"
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)'
              }}
            >
              <Calendar size={36} color="#6573B8" style={{ opacity: 0.5, marginBottom: '0.75rem' }} />
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>No Mentorship Sessions Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                Connect with an experienced mentor in business, craft, or social development to book your first wisdom session.
              </p>
              <button
                onClick={() => setActiveSubTab('mentors')}
                className="btn btn-primary"
                style={{ backgroundColor: '#6573B8', borderColor: '#6573B8' }}
              >
                Find a Mentor
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sessions.map((sess) => (
                <div
                  key={sess._id}
                  className="card-surface"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(101, 115, 184, 0.12)',
                        color: '#6573B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Video size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                        {sess.topic || 'Mentorship Dialogue'}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        Mentor: <strong>{sess.mentorId?.name || 'Mentor'}</strong>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#6573B8', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} />
                        {new Date(sess.preferredDate).toLocaleDateString()} at {sess.preferredTime}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: sess.status === 'completed' ? 'var(--mint)' : 'rgba(101, 115, 184, 0.15)',
                        color: sess.status === 'completed' ? 'var(--primary)' : '#6573B8',
                        textTransform: 'capitalize'
                      }}
                    >
                      {sess.status}
                    </span>

                    {sess.meetingLink && sess.status !== 'completed' && (
                      <a
                        href={sess.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                        style={{ backgroundColor: '#6573B8', borderColor: '#6573B8', fontSize: '0.825rem', padding: '0.4rem 0.85rem' }}
                      >
                        Join Call
                      </a>
                    )}

                    {sess.status === 'completed' && !sess.feedbackGiven && (
                      <button
                        onClick={() => setFeedbackSession(sess)}
                        className="btn btn-outline"
                        style={{ borderColor: '#D7A94A', color: '#996C0B', fontSize: '0.825rem', padding: '0.4rem 0.85rem' }}
                      >
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: MENTOR STUDIO */}
      {activeSubTab === 'mentor-studio' && (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {myMentorProfile ? (
            <div>
              <div
                className="card-surface"
                style={{
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  marginBottom: '1.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <span className="badge badge-mint">Active Certified Mentor</span>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '1.35rem', fontFamily: 'var(--font-heading)' }}>
                      Welcome, Mentor {user?.name}
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D7A94A' }}>
                      ★ {myMentorProfile.rating || '5.0'}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {myMentorProfile.totalSessions || 0} Sessions Delivered
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                  {myMentorProfile.bio}
                </p>
              </div>

              {/* Incoming Session Requests */}
              <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
                Incoming Session Requests ({incomingRequests.length})
              </h3>
              {incomingRequests.length === 0 ? (
                <div className="card-surface" style={{ padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No pending requests right now. New learner requests will appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {incomingRequests.map((req) => (
                    <div
                      key={req._id}
                      className="card-surface"
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{req.topic}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Learner: {req.userId?.name || 'MELD Member'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6573B8', marginTop: '0.2rem' }}>
                          Preferred: {new Date(req.preferredDate).toLocaleDateString()} at {req.preferredTime}
                        </div>
                        {req.notes && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                            "{req.notes}"
                          </div>
                        )}
                      </div>

                      {req.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleRespondToRequest(req._id, 'accepted')}
                            className="btn btn-primary"
                            style={{ backgroundColor: 'var(--primary)', fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRespondToRequest(req._id, 'rejected')}
                            className="btn btn-outline"
                            style={{ color: 'var(--error)', borderColor: 'rgba(186,26,26,0.3)', fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
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
          ) : (
            /* Mentor Application Form */
            <div
              className="card-surface"
              style={{
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(101, 115, 184, 0.15)',
                    color: '#6573B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem'
                  }}
                >
                  <Award size={26} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.35rem' }}>
                  Become a Wisdom Loop Mentor
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Share your life's work, craft, and insights with eager students and grassroots innovators.
                </p>
              </div>

              {actionMessage && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--mint)',
                    color: 'var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  {actionMessage}
                </div>
              )}

              <form onSubmit={handleBecomeMentor}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Professional Title / Designation
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Assistant Professor / Head of Department / Senior Consultant"
                    value={mentorApp.title}
                    onChange={(e) => setMentorApp({ ...mentorApp, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Areas of Expertise (Comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Traditional Weaving, Social Entrepreneurship, Supply Chain"
                    value={mentorApp.expertise}
                    onChange={(e) => setMentorApp({ ...mentorApp, expertise: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={mentorApp.yearsExperience}
                      onChange={(e) => setMentorApp({ ...mentorApp, yearsExperience: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Availability
                    </label>
                    <select
                      value={mentorApp.availability}
                      onChange={(e) => setMentorApp({ ...mentorApp, availability: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="weekends">Weekends only</option>
                      <option value="weekday-evenings">Weekday evenings</option>
                      <option value="flexible">Flexible hours</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Mentor Biography & Statement of Intent
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe your career, accomplishments, and what motivates you to give back..."
                    value={mentorApp.bio}
                    onChange={(e) => setMentorApp({ ...mentorApp, bio: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      fontSize: '0.875rem',
                      resize: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary hover-lift"
                  style={{ width: '100%', backgroundColor: '#6573B8', borderColor: '#6573B8', padding: '0.75rem' }}
                >
                  Submit Mentor Application
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* BOOKING MODAL */}
      {bookingModalOpen && selectedMentor && (
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
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={44} color="#6573B8" style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-heading)' }}>
                  Session Request Sent!
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedMentor.name} has been notified and will confirm the session link.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
                    Book 1:1 Wisdom Session
                  </h3>
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Connecting with <strong>{selectedMentor.name}</strong> • Pro Bono Impact Dialogue
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Discussion Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.topic}
                    onChange={(e) => setBookingData({ ...bookingData, topic: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.preferredDate}
                      onChange={(e) => setBookingData({ ...bookingData, preferredDate: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Preferred Time
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 05:00 PM"
                      value={bookingData.preferredTime}
                      onChange={(e) => setBookingData({ ...bookingData, preferredTime: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Questions / Context for Mentor
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specific challenges or questions you would like advice on..."
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      fontSize: '0.85rem',
                      resize: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', backgroundColor: '#6573B8', borderColor: '#6573B8', padding: '0.7rem' }}
                >
                  {bookingLoading ? 'Submitting...' : 'Confirm Session Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {feedbackSession && (
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
              maxWidth: '440px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '1.75rem'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-heading)' }}>
              Rate Your Session
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              How was your exchange with {feedbackSession.mentorId?.name}?
            </p>

            <form onSubmit={handleSubmitFeedback}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                  >
                    <Star
                      size={28}
                      fill={star <= feedbackData.rating ? '#D7A94A' : 'none'}
                      color="#D7A94A"
                    />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder="Write a brief thank you or review..."
                value={feedbackData.comment}
                onChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  resize: 'none'
                }}
              />

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setFeedbackSession(null)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, backgroundColor: '#6573B8', borderColor: '#6573B8' }}
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WisdomLoopHub;
