import { ApiError } from '../utils/ApiError.js';

/**
 * Role-Based Authorization Middleware
 * Verifies that the authenticated user possesses one of the allowed roles
 * @param  {...string} roles - e.g. 'ADMIN', 'USER'
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(ApiError.unauthorized('Authentication required to verify permissions.'));
    }

    const userRole = req.user.role.toUpperCase();
    const normalizedAllowedRoles = roles.map((r) => r.toUpperCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
      return next(
        ApiError.forbidden(
          `Access restricted: '${userRole}' role is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

export default authorizeRoles;
