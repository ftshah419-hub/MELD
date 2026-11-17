import { ApiError } from '../utils/ApiError.js';

export const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Transform Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = ApiError.badRequest(message);
  }

  // Transform Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    error = ApiError.conflict(message);
  }

  // Transform Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = ApiError.unprocessable('Validation failed', messages);
  }

  // Transform Multer File Upload Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = ApiError.badRequest('File size exceeds the 5MB limit.');
    } else {
      error = ApiError.badRequest(`File upload error: ${err.message}`);
    }
  }

  // If not already an ApiError, normalize to 500
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message =
      process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'An unexpected internal server error occurred.'
        : error.message || 'Server error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const statusCode = error.statusCode || 500;
  const responsePayload = {
    success: false,
    message: error.message,
    errors: error.errors || []
  };

  // Only attach stack trace in development
  if (process.env.NODE_ENV === 'development') {
    responsePayload.stack = error.stack;
  }

  return res.status(statusCode).json(responsePayload);
};

export default errorMiddleware;
