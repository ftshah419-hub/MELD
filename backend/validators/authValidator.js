import { ApiError } from '../utils/ApiError.js';

export const validateRegister = (req, res, next) => {
  const { fullName, name, email, password } = req.body;
  const targetName = fullName || name;
  const errors = [];

  if (!targetName || typeof targetName !== 'string' || targetName.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters long.');
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
    errors.push('Password must contain both letters and numbers.');
  }

  // Prevent users from trying to set role via registration payload
  if (req.body.role) {
    delete req.body.role;
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Registration validation failed', errors));
  }

  // Normalize
  req.body.fullName = targetName.trim();
  req.body.email = email.trim().toLowerCase();
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Login validation failed', errors));
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

export default { validateRegister, validateLogin };
