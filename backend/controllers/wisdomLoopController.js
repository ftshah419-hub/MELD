import mongoose from 'mongoose';
import { MentorProfile } from '../models/MentorProfile.js';
import { User } from '../models/User.js';
import { Request } from '../models/Request.js';
import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const wisdomLoopController = {
  /**
   * Browse and search verified/approved mentors
   */
  getMentors: asyncHandler(async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      const fallbackMentors = [
        {
          _id: 'm1',
          name: 'Dr. Anandita Sharma',
          title: 'Former Director of Rural Tech Initiative',
          expertise: ['Technology', 'Education', 'Social Impact'],
          yearsOfExperience: 22,
          rating: 4.9,
          totalSessions: 84,
          bio: 'Spent two decades bridging digital divides in tribal communities. Passionate about mentoring next-gen innovators.',
          availability: 'Weekends & Evenings',
          status: 'APPROVED'
        },
        {
          _id: 'm2',
          name: 'Rameshwar Nath',
          title: 'Master Loom Weaver & Design Historian',
          expertise: ['Design & Craft', 'Entrepreneurship'],
          yearsOfExperience: 35,
          rating: 5.0,
          totalSessions: 112,
          bio: 'Preserving authentic handloom weaving traditions. Mentoring modern textile designers on sustainable craft.',
          availability: 'Flexible',
          status: 'APPROVED'
        }
      ];
      return sendResponse(res, 200, 'Mentors retrieved successfully', {
        mentors: fallbackMentors,
        total: fallbackMentors.length,
        page: 1,
        pages: 1
      });
    }

    const { search, expertise, minExperience, limit = 20, page = 1, sort = 'rating' } = req.query;

    const filter = { status: 'APPROVED' };

    if (expertise) {
      filter.expertiseAreas = { $in: [new RegExp(expertise, 'i')] };
    }

    if (minExperience) {
      filter.yearsOfExperience = { $gte: Number(minExperience) };
    }

    let sortOptions = { rating: -1, totalSessions: -1 };
    if (sort === 'experience') sortOptions = { yearsOfExperience: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    let query = MentorProfile.find(filter)
      .populate('userId', 'fullName profileImage bio')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const [mentors, total] = await Promise.all([
      query,
      MentorProfile.countDocuments(filter)
    ]);

    // In-memory text search fallback if search query provided
    let results = mentors;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = mentors.filter((m) => {
        const nameMatch = m.userId?.fullName?.toLowerCase().includes(q);
        const titleMatch = m.title?.toLowerCase().includes(q);
        const bioMatch = m.bio?.toLowerCase().includes(q);
        const expMatch = m.expertiseAreas?.some((exp) => exp.toLowerCase().includes(q));
        return nameMatch || titleMatch || bioMatch || expMatch;
      });
    }

    return sendResponse(res, 200, 'Mentors retrieved successfully', {
      mentors: results,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  }),

  /**
   * Get single mentor profile by ID
   */
  getMentorById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const mentor = await MentorProfile.findById(id).populate(
      'userId',
      'fullName profileImage bio createdAt'
    );

    if (!mentor) {
      throw ApiError.notFound('Mentor profile not found.');
    }

    return sendResponse(res, 200, 'Mentor profile retrieved', { mentor });
  }),

  /**
   * Request a mentoring session
   */
  requestSession: asyncHandler(async (req, res) => {
    const requesterId = req.user.id || req.user._id;
    const {
      mentorId,
      id,
      targetId,
      subject,
      topic,
      learningGoals,
      notes,
      questions,
      preferredTimes,
      preferredDate,
      preferredTime
    } = req.body;

    const resolvedMentorId = mentorId || id || targetId;
    const resolvedGoals = (learningGoals && learningGoals.trim()) ||
      (notes && notes.trim()) ||
      (questions && questions.trim()) ||
      (topic && topic.trim()) ||
      'General Mentorship Session';
    const resolvedSubject = subject || topic || '1:1 Mentorship Discussion';
    const resolvedTiming = preferredTimes ||
      (preferredDate ? `${preferredDate} at ${preferredTime || 'Flexible'}` : 'Flexible');

    if (!resolvedMentorId) {
      throw ApiError.badRequest('Mentor ID is required.');
    }

    const mentor = await MentorProfile.findById(resolvedMentorId);
    if (!mentor) {
      throw ApiError.notFound('Selected mentor profile not found.');
    }

    // Prevent mentoring self
    if (mentor.userId.toString() === requesterId.toString()) {
      throw ApiError.badRequest('You cannot submit a mentorship request to yourself.');
    }

    // Check for existing pending request with this mentor
    const existing = await Request.findOne({
      requesterId,
      module: 'WISDOM_LOOP',
      targetId: mentor._id,
      status: 'PENDING'
    });

    if (existing) {
      throw ApiError.badRequest('You already have an active pending mentorship request with this mentor.');
    }

    const messageContent = `Subject: ${resolvedSubject}\nGoals: ${resolvedGoals}\nPreferred Timing: ${resolvedTiming}`;

    const request = await Request.create({
      requesterId,
      module: 'WISDOM_LOOP',
      targetType: 'MentorProfile',
      targetId: mentor._id,
      requestType: 'MENTORSHIP_SESSION',
      message: messageContent,
      status: 'PENDING'
    });

    // Notify mentor user
    await Notification.create({
      userId: mentor.userId,
      title: 'New Mentoring Request',
      message: `You received a new mentorship session request: "${subject || 'General Mentorship'}".`,
      type: 'REQUEST',
      link: '/user/wisdom-loop/my-sessions'
    });

    return sendResponse(res, 201, 'Mentorship request submitted successfully', { request });
  }),

  /**
   * Get user's mentoring sessions (as mentee)
   */
  getMySessions: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    const sessions = await Request.find({
      requesterId: userId,
      module: 'WISDOM_LOOP',
      requestType: 'MENTORSHIP_SESSION'
    })
      .populate({
        path: 'targetId',
        populate: { path: 'userId', select: 'fullName profileImage email' }
      })
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'My mentoring sessions retrieved', { sessions });
  }),

  /**
   * Submit session feedback/rating
   */
  submitFeedback: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    const { rating, feedback } = req.body;

    const request = await Request.findOne({ _id: id, requesterId: userId, status: 'ACCEPTED' });
    if (!request) {
      throw ApiError.notFound('Accepted session record not found.');
    }

    request.status = 'COMPLETED';
    request.responseNote = feedback ? `${request.responseNote || ''}\nFeedback: ${feedback}` : request.responseNote;
    await request.save();

    // Increment mentor total sessions and adjust rating
    if (rating && Number(rating) >= 1 && Number(rating) <= 5) {
      const mentor = await MentorProfile.findById(request.targetId);
      if (mentor) {
        const currentTotal = mentor.totalSessions || 0;
        const currentRating = mentor.rating || 5.0;
        const newRating = Number(((currentRating * currentTotal + Number(rating)) / (currentTotal + 1)).toFixed(1));
        mentor.rating = newRating;
        mentor.totalSessions = currentTotal + 1;
        await mentor.save();
      }
    }

    return sendResponse(res, 200, 'Feedback recorded and session completed', { request });
  }),

  /**
   * Apply to become a mentor
   */
  becomeMentor: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { title, expertise, expertiseAreas, yearsExperience, yearsOfExperience, bio, availability } = req.body;

    const rawBio = bio || req.body.statement || req.body.biography || req.body.mentorBio || req.body.description || '';
    if (!rawBio || !rawBio.trim()) {
      throw ApiError.badRequest('Mentor biography and statement of intent are required.');
    }

    const rawExpertise = expertiseAreas || expertise || [];
    const expertiseList = Array.isArray(rawExpertise)
      ? rawExpertise
      : (typeof rawExpertise === 'string' ? rawExpertise.split(',').map((s) => s.trim()).filter(Boolean) : []);

    const effectiveTitle = (title && title.trim()) || (expertiseList.length > 0 ? `${expertiseList[0]} Specialist` : 'Community Mentor');
    const effectiveExperience = Number(yearsOfExperience || yearsExperience) || 1;

    let formattedAvailability = {
      days: ['Saturday', 'Sunday'],
      hoursPerWeek: 4
    };

    if (availability && typeof availability === 'object' && Array.isArray(availability.days)) {
      formattedAvailability = availability;
    } else if (availability === 'weekday-evenings') {
      formattedAvailability = { days: ['Monday', 'Wednesday', 'Friday'], hoursPerWeek: 6 };
    } else if (availability === 'flexible') {
      formattedAvailability = { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], hoursPerWeek: 10 };
    }

    let mentor = await MentorProfile.findOne({ userId });

    if (mentor) {
      // Update existing profile
      mentor.title = effectiveTitle;
      mentor.bio = rawBio.trim();
      mentor.yearsOfExperience = effectiveExperience;
      mentor.expertiseAreas = expertiseList;
      mentor.availability = formattedAvailability;
      mentor.status = 'APPROVED'; // Auto-approved for community participation
      await mentor.save();
    } else {
      mentor = await MentorProfile.create({
        userId,
        title: effectiveTitle,
        bio: rawBio.trim(),
        yearsOfExperience: effectiveExperience,
        expertiseAreas: expertiseList,
        availability: formattedAvailability,
        status: 'APPROVED'
      });
    }

    return sendResponse(res, 201, 'Mentor application processed successfully', {
      mentor
    });
  }),

  /**
   * Get authenticated user's own mentor profile
   */
  getMyMentorProfile: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    const mentor = await MentorProfile.findOne({ userId });

    return sendResponse(res, 200, 'Mentor profile status retrieved', {
      mentorProfile: mentor || null,
      isMentor: !!mentor && mentor.status === 'APPROVED'
    });
  }),

  /**
   * Mentor view: Incoming mentoring requests from mentees
   */
  getIncomingRequests: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    const mentor = await MentorProfile.findOne({ userId });
    if (!mentor) {
      throw ApiError.forbidden('You do not have an active mentor profile.');
    }

    const requests = await Request.find({
      targetId: mentor._id,
      module: 'WISDOM_LOOP'
    })
      .populate('requesterId', 'fullName email profileImage')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Incoming requests retrieved', { requests });
  }),

  /**
   * Mentor respond: Accept or reject incoming request
   */
  respondToRequest: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    const { action, responseNote } = req.body;

    if (!['ACCEPT', 'REJECT'].includes(action)) {
      throw ApiError.badRequest('Action must be ACCEPT or REJECT.');
    }

    const mentor = await MentorProfile.findOne({ userId });
    if (!mentor) {
      throw ApiError.forbidden('Unauthorized mentor action.');
    }

    const request = await Request.findOne({ _id: id, targetId: mentor._id });
    if (!request) {
      throw ApiError.notFound('Request not found.');
    }

    request.status = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
    request.responseNote = responseNote || (action === 'ACCEPT' ? 'Session accepted! Meeting details shared.' : 'Session declined.');
    await request.save();

    // Notify mentee
    await Notification.create({
      userId: request.requesterId,
      title: `Mentorship Request ${action === 'ACCEPT' ? 'Accepted' : 'Declined'}`,
      message: `${mentor.title || 'Your mentor'} has ${action === 'ACCEPT' ? 'accepted' : 'declined'} your session request.`,
      type: 'REQUEST',
      link: '/user/wisdom-loop/my-sessions'
    });

    return sendResponse(res, 200, `Request ${request.status.toLowerCase()} successfully`, { request });
  })
};

export default wisdomLoopController;
