import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { sendResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc Get immutable audit logs with filtering and pagination
 * @route GET /api/admin/audit-logs
 * @access Private (Admin)
 */
export const getAuditLogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const { action, targetType, search, startDate, endDate } = req.query;

  const query = {};

  if (action && action !== 'all') {
    query.action = action.toUpperCase();
  }

  if (targetType && targetType !== 'all') {
    query.targetType = targetType.toUpperCase();
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (search && search.trim()) {
    query.action = { $regex: search.trim(), $options: 'i' };
  }

  const [total, logs] = await Promise.all([
    AdminAuditLog.countDocuments(query),
    AdminAuditLog.find(query)
      .populate('adminId', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  return sendResponse(res, 200, 'Audit logs retrieved successfully', {
    logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
});

export default {
  getAuditLogs
};
