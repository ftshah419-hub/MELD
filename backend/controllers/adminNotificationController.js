import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { ApiError } from '../utils/ApiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc Get admin notifications and alerts
 * @route GET /api/admin/notifications
 * @access Private (Admin)
 */
export const getAdminNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const { type, isRead } = req.query;

  const query = { userId: req.user._id };

  if (type && type !== 'all') {
    query.type = type.toUpperCase();
  }

  if (isRead !== undefined && isRead !== 'all') {
    query.isRead = isRead === 'true';
  }

  const [total, unreadCount, notifications] = await Promise.all([
    Notification.countDocuments(query),
    Notification.countDocuments({ userId: req.user._id, isRead: false }),
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  return sendResponse(res, 200, 'Admin notifications retrieved', {
    notifications,
    unreadCount,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
});

/**
 * @desc Mark notification as read
 * @route PATCH /api/admin/notifications/:id/read
 * @access Private (Admin)
 */
export const markNotificationRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw ApiError.notFound('Notification not found.');
  }

  return sendResponse(res, 200, 'Notification marked as read', notification);
});

/**
 * @desc Broadcast platform announcement to users
 * @route POST /api/admin/notifications/broadcast
 * @access Private (Admin)
 */
export const broadcastAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, targetRole = 'ALL' } = req.body;

  if (!title || !message) {
    throw ApiError.badRequest('Announcement title and message copy are required.');
  }

  const userQuery = {};
  if (targetRole !== 'ALL') {
    userQuery.role = targetRole.toUpperCase();
  }

  const users = await User.find(userQuery).select('_id').lean();

  const notificationsToCreate = users.map((u) => ({
    userId: u._id,
    title,
    message,
    type: 'SYSTEM',
    isRead: false
  }));

  if (notificationsToCreate.length > 0) {
    await Notification.insertMany(notificationsToCreate);
  }

  // Record audit log
  await AdminAuditLog.create({
    adminId: req.user._id,
    action: 'PLATFORM_ANNOUNCEMENT_BROADCAST',
    targetType: 'SYSTEM',
    details: {
      title,
      recipientsCount: notificationsToCreate.length,
      targetRole
    },
    ipAddress: req.ip
  });

  return sendResponse(res, 201, `Announcement broadcasted to ${notificationsToCreate.length} members.`, {
    recipientsCount: notificationsToCreate.length
  });
});

export default {
  getAdminNotifications,
  markNotificationRead,
  broadcastAnnouncement
};
