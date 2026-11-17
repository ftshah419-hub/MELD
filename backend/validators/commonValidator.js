import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

export const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(ApiError.badRequest(`Invalid ${paramName} identifier parameter.`));
  }
  next();
};

export const sanitizeQueryParams = (req, res, next) => {
  // Prevent NoSQL operator injection in query params
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key] === 'object' && req.query[key] !== null) {
        // Strip keys containing $ operators
        for (const subKey of Object.keys(req.query[key])) {
          if (subKey.startsWith('$')) {
            delete req.query[key][subKey];
          }
        }
      }
    }
  }
  next();
};

export default { validateObjectId, sanitizeQueryParams };
