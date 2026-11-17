import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';
import { authenticateOptional } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (always USER role)
 * @access  Public
 */
router.post('/register', validateRegister, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & establish session
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Verify current session & retrieve safe profile (returns user: null if unauthenticated)
 * @access  Public (Optional Auth)
 */
router.get('/me', authenticateOptional, authController.getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Terminate session & clear authentication cookies
 * @access  Public / Private
 */
router.post('/logout', authController.logout);

export default router;
