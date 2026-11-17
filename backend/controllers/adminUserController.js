import { User } from '../models/User.js';
import { MentorProfile } from '../models/MentorProfile.js';
import { ArtisanProfile } from '../models/ArtisanProfile.js';
import { Order } from '../models/Order.js';
import { Request } from '../models/Request.js';
import { Payment } from '../models/Payment.js';
import { Report } from '../models/Report.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { Notification } from '../models/Notification.js';
import { ApiError } from '../utils/ApiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc Get all registered users with filtering, search, and pagination
 * @route GET /api/admin/users
 * @access Private (Admin)
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const { role, status, search, sort = 'desc' } = req.query;

  const query = {};

  if (role && role !== 'all') {
    query.role = role.toUpperCase();
  }

  if (status && status !== 'all') {
    query.accountStatus = status.toUpperCase();
  }

  if (search && search.trim()) {
    const term = search.trim();
    query.$or = [
      { fullName: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } }
    ];
  }

  const sortOrder = sort === 'asc' ? 1 : -1;

  const [totalUsers, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  // Enrich user list with mentor/artisan affiliations
  const userIds = users.map((u) => u._id);
  const [mentors, artisans] = await Promise.all([
    MentorProfile.find({ userId: { $in: userIds } }).select('userId status title rating').lean(),
    ArtisanProfile.find({ userId: { $in: userIds } }).select('userId verificationStatus craftSpecialty region').lean()
  ]);

  const mentorMap = new Map(mentors.map((m) => [m.userId.toString(), m]));
  const artisanMap = new Map(artisans.map((a) => [a.userId.toString(), a]));

  const enrichedUsers = users.map((u) => ({
    ...u,
    mentorProfile: mentorMap.get(u._id.toString()) || null,
    artisanProfile: artisanMap.get(u._id.toString()) || null
  }));

  return sendResponse(res, 200, 'Users retrieved successfully', {
    users: enrichedUsers,
    pagination: {
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit)
    }
  });
});

/**
 * @desc Get single user comprehensive detail profile
 * @route GET /api/admin/users/:id
 * @access Private (Admin)
 */
export const getUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-passwordHash').lean();
  if (!user) {
    throw ApiError.notFound('User not found.');
  }

  // Fetch cross-module activities
  const [
    mentorProfile,
    artisanProfile,
    orders,
    requests,
    payments,
    reportsAgainst,
    reportsFiled,
    auditLogs
  ] = await Promise.all([
    MentorProfile.findOne({ userId: id }).lean(),
    ArtisanProfile.findOne({ userId: id }).lean(),
    Order.find({ buyerId: id }).populate('items.productId', 'title price images').limit(10).lean(),
    Request.find({ requesterId: id }).sort({ createdAt: -1 }).limit(10).lean(),
    Payment.find({ userId: id }).sort({ createdAt: -1 }).limit(10).lean(),
    Report.find({ reportedUserId: id }).sort({ createdAt: -1 }).limit(10).lean(),
    Report.find({ reporterId: id }).sort({ createdAt: -1 }).limit(10).lean(),
    AdminAuditLog.find({ targetType: 'USER', targetId: id })
      .populate('adminId', 'fullName email')
      .sort({ createdAt: -1 })
      .lean()
  ]);

  return sendResponse(res, 200, 'User details retrieved successfully', {
    user,
    mentorProfile,
    artisanProfile,
    orders,
    requests,
    payments,
    reportsAgainst,
    reportsFiled,
    auditLogs
  });
});

/**
 * @desc Update user account moderation status (Active, Suspended, Inactive)
 * @route PATCH /api/admin/users/:id/status
 * @access Private (Admin)
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw ApiError.notFound('User not found.');
  }

  // Safeguard: Cannot suspend own account
  if (user._id.toString() === req.user._id.toString()) {
    throw ApiError.badRequest('Administrators cannot alter their own account status.');
  }

  const previousStatus = user.accountStatus;
  user.accountStatus = status;
  await user.save();

  // Create immutable audit log
  await AdminAuditLog.create({
    adminId: req.user._id,
    action: `USER_STATUS_${status}`,
    targetType: 'USER',
    targetId: user._id,
    details: {
      previousStatus,
      newStatus: status,
      reason: reason || 'Administrative review'
    },
    ipAddress: req.ip
  });

  // Notify affected user
  await Notification.create({
    userId: user._id,
    title: `Account Status Update: ${status}`,
    message:
      status === 'SUSPENDED'
        ? `Your MELD account has been suspended by administration. Reason: ${reason}`
        : `Your MELD account status has been set to ${status}.`,
    type: 'SYSTEM'
  });

  return sendResponse(res, 200, `User account successfully updated to ${status}`, {
    id: user._id,
    accountStatus: user.accountStatus
  });
});

export default {
  getUsers,
  getUserDetails,
  updateUserStatus
};
