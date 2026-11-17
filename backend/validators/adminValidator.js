import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

/**
 * Validate MongoDB ObjectId
 */
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Middleware: Validate ID parameter in route
 */
export const validateIdParam = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !isValidObjectId(id)) {
      return next(ApiError.badRequest(`Invalid ${paramName} identifier provided.`));
    }
    next();
  };
};

/**
 * Middleware: Validate user status update
 */
export const validateUserStatusUpdate = (req, res, next) => {
  const { status, reason } = req.body;
  const allowedStatuses = ['ACTIVE', 'SUSPENDED', 'INACTIVE'];

  if (!status || !allowedStatuses.includes(status.toUpperCase())) {
    return next(
      ApiError.badRequest(`Invalid status. Allowed values: ${allowedStatuses.join(', ')}`)
    );
  }

  req.body.status = status.toUpperCase();

  if (req.body.status === 'SUSPENDED' && (!reason || reason.trim().length < 5)) {
    return next(
      ApiError.badRequest('A justification reason (at least 5 characters) is required when suspending an account.')
    );
  }

  next();
};

/**
 * Middleware: Validate moderation decision
 */
export const validateModerationDecision = (req, res, next) => {
  const { action, reason } = req.body;
  const allowedActions = ['APPROVE', 'REJECT', 'SUSPEND', 'REQUEST_CHANGES'];

  if (!action || !allowedActions.includes(action.toUpperCase())) {
    return next(
      ApiError.badRequest(`Invalid action. Allowed values: ${allowedActions.join(', ')}`)
    );
  }

  req.body.action = action.toUpperCase();

  if (['REJECT', 'SUSPEND'].includes(req.body.action) && (!reason || reason.trim().length < 5)) {
    return next(
      ApiError.badRequest(`A justification reason (at least 5 characters) is required for ${req.body.action.toLowerCase()} action.`)
    );
  }

  next();
};

/**
 * Middleware: Validate report status update
 */
export const validateReportStatusUpdate = (req, res, next) => {
  const { status, resolutionNotes } = req.body;
  const allowedStatuses = ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'ESCALATED'];

  if (!status || !allowedStatuses.includes(status.toUpperCase())) {
    return next(
      ApiError.badRequest(`Invalid status. Allowed values: ${allowedStatuses.join(', ')}`)
    );
  }

  req.body.status = status.toUpperCase();

  if (['RESOLVED', 'REJECTED'].includes(req.body.status) && (!resolutionNotes || resolutionNotes.trim().length < 5)) {
    return next(
      ApiError.badRequest('Resolution notes (at least 5 characters) are required when resolving or rejecting a report.')
    );
  }

  next();
};

/**
 * Middleware: Validate pagination parameters
 */
export const validatePagination = (req, res, next) => {
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;

  req.pagination = { page, limit, skip: (page - 1) * limit };
  next();
};

export default {
  isValidObjectId,
  validateIdParam,
  validateUserStatusUpdate,
  validateModerationDecision,
  validateReportStatusUpdate,
  validatePagination
};
