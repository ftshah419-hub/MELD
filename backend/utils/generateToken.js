import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'meld_secure_jwt_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const COOKIE_NAME = process.env.COOKIE_NAME || 'meld_token';

/**
 * Sign a JWT token with user identity and role
 */
export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Attach HttpOnly authentication cookie to HTTP response
 */
export const setAuthCookie = (res, token, rememberMe = false) => {
  const maxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 7 * 24 * 60 * 60 * 1000;  // 7 days

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieSecure = process.env.COOKIE_SECURE === 'true' || isProduction;
  const sameSite = process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax');

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: sameSite,
    maxAge: maxAge,
    path: '/'
  });
};

/**
 * Clear authentication cookie upon logout
 */
export const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieSecure = process.env.COOKIE_SECURE === 'true' || isProduction;
  const sameSite = process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax');

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: sameSite,
    path: '/'
  });
};

export default { signToken, verifyToken, setAuthCookie, clearAuthCookie, COOKIE_NAME };
