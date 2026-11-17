import { verifyToken, COOKIE_NAME, clearAuthCookie } from '../utils/generateToken.js';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Strict Authentication Middleware
 * Enforces authenticated session; throws 401 if token is missing, invalid, or expired
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Check HttpOnly cookie
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME];
  }
  // 2. Check Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication required. Please log in.');
  }

  try {
    const decoded = verifyToken(token);

    // Check session validity in DB if active session record exists
    const activeSession = await Session.findOne({ token, isValid: true });
    if (activeSession && !activeSession.isValid) {
      throw ApiError.unauthorized('Session has been terminated. Please log in again.');
    }

    // Find active user
    const user = await User.findById(decoded.id || decoded._id);

    if (!user) {
      throw ApiError.unauthorized('The user account associated with this session no longer exists.');
    }

    if (user.accountStatus === 'SUSPENDED') {
      throw ApiError.forbidden('Your account has been suspended. Please contact community support.');
    }

    // Attach authenticated identity to request
    req.user = user.toSafeObject();
    req.rawUser = user;
    req.token = token;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Your session has expired. Please sign in again.');
    }
    if (err.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid authentication token.');
    }
    throw err;
  }
});

/**
 * Optional Authentication Middleware
 * Used for session restoration endpoints (like /api/auth/me) so unauthenticated visitors
 * cleanly receive user: null with 200 OK rather than generating false red 401 errors in DevTools.
 */
export const authenticateOptional = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.cookies && req.cookies[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME];
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id || decoded._id);

    if (user && user.accountStatus !== 'SUSPENDED') {
      req.user = user.toSafeObject();
      req.rawUser = user;
      req.token = token;
    } else {
      req.user = null;
    }
    next();
  } catch {
    // If token is expired or invalid, clear cookie and treat as guest
    clearAuthCookie(res);
    req.user = null;
    next();
  }
});

export default { authenticate, authenticateOptional };
