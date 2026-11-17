import { ApiError } from '../utils/ApiError.js';

export const notFoundMiddleware = (req, res, next) => {
  next(ApiError.notFound(`Endpoint '${req.method} ${req.originalUrl}' does not exist on this server.`));
};

export default notFoundMiddleware;
