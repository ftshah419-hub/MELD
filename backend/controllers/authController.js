import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { ApiError } from '../utils/ApiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/generateToken.js';

export const authController = {
  /**
   * Register a new community user
   * Public registrations are strictly assigned USER role
   */
  register: asyncHandler(async (req, res) => {
    const { fullName, name, email, password } = req.body;
    const resolvedName = (fullName || name || '').trim();

    if (!resolvedName) {
      throw ApiError.badRequest('Full name is required.');
    }

    // Check for existing account
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists.');
    }

    // Always enforce USER role for public registration
    const newUser = await User.create({
      fullName: resolvedName,
      email,
      passwordHash: password,
      role: 'USER',
      accountStatus: 'ACTIVE'
    });

    // Generate JWT token
    const token = signToken({
      id: newUser._id,
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role
    });

    // Set HttpOnly cookie
    setAuthCookie(res, token, false);

    // Record session
    try {
      await Session.create({
        userId: newUser._id,
        token,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
    } catch {
      // Non-blocking session record error
    }

    const safeUser = newUser.toSafeObject();

    return res.status(201).json({
      success: true,
      message: 'User account registered successfully',
      token,
      user: safeUser,
      data: {
        user: safeUser,
        token
      }
    });
  }),

  /**
   * Authenticate user with email and password
   */
  login: asyncHandler(async (req, res) => {
    const { email, password, rememberMe = false } = req.body;

    // Fetch user including the passwordHash field
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    if (user.accountStatus === 'SUSPENDED') {
      throw ApiError.forbidden('Your account is currently suspended. Please contact community support.');
    }

    // Compare bcrypt password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate JWT token
    const token = signToken({
      id: user._id,
      _id: user._id,
      email: user.email,
      role: user.role
    });

    // Attach HttpOnly cookie
    setAuthCookie(res, token, rememberMe);

    // Save session in DB
    const sessionDurationDays = rememberMe ? 30 : 7;
    try {
      await Session.create({
        userId: user._id,
        token,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || null,
        expiresAt: new Date(Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000)
      });
    } catch {
      // Non-blocking
    }

    const safeUser = user.toSafeObject();

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser,
      data: {
        user: safeUser,
        token
      }
    });
  }),

  /**
   * Restore and verify active session profile
   * Returns user object if logged in, or user: null for unauthenticated visitors without 401 error
   */
  getCurrentUser: asyncHandler(async (req, res) => {
    if (!req.user) {
      return res.status(200).json({
        success: true,
        message: 'No active session',
        user: null,
        data: {
          user: null
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User session verified',
      user: req.user,
      data: {
        user: req.user
      }
    });
  }),

  /**
   * Log out user and terminate session
   */
  logout: asyncHandler(async (req, res) => {
    const token = req.token || (req.cookies && req.cookies.meld_token);

    if (token) {
      // Invalidate session in DB
      await Session.updateMany({ token }, { isValid: false });
    }

    // Clear HttpOnly cookie
    clearAuthCookie(res);

    return sendResponse(res, 200, 'Logged out successfully');
  })
};

export default authController;
