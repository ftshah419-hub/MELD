import { Router } from 'express';
import { wisdomLoopController } from '../controllers/wisdomLoopController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Module root info endpoint
router.get('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Wisdom Loop Mentorship Module. Use /mentors to discover mentors, /requests to submit mentoring sessions, or /my-sessions.',
    owner: 'Person 2 — User Backend'
  });
});

// Public discovery endpoints
router.get('/mentors', wisdomLoopController.getMentors);
router.get('/mentors/:id', wisdomLoopController.getMentorById);

// Protected user mentoring endpoints
router.post('/requests', authenticate, wisdomLoopController.requestSession);
router.get('/my-sessions', authenticate, wisdomLoopController.getMySessions);
router.post('/sessions/:id/feedback', authenticate, wisdomLoopController.submitFeedback);

// Mentor onboarding and management
router.post('/become-mentor', authenticate, wisdomLoopController.becomeMentor);
router.get('/my-mentor-profile', authenticate, wisdomLoopController.getMyMentorProfile);
router.get('/incoming-requests', authenticate, wisdomLoopController.getIncomingRequests);
router.patch('/requests/:id/respond', authenticate, wisdomLoopController.respondToRequest);

export default router;
