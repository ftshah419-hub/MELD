import { User } from '../models/User.js';
import { MentorProfile } from '../models/MentorProfile.js';
import { ArtisanProfile } from '../models/ArtisanProfile.js';
import { Product } from '../models/Product.js';
import { DeviceListing } from '../models/DeviceListing.js';
import { BookListing } from '../models/BookListing.js';
import { FoodDonation } from '../models/FoodDonation.js';
import { Request } from '../models/Request.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { Report } from '../models/Report.js';
import { Notification } from '../models/Notification.js';
import { sendResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * In-memory or default platform governance settings
 * Backed by audit logs whenever modified
 */
let platformSettingsState = {
  platformName: 'MELD Network',
  tagline: 'Different Worlds. One Connected Future.',
  supportEmail: 'governance-relay@meld-system.org',
  legalEntity: 'MELD Circular Ecosystem Foundation, PBC',
  modules: {
    wisdomLoop: { enabled: true, videoMatchesEnabled: true, autoApproveMentors: false },
    craftToCart: { enabled: true, compulsoryPurchaseCheckout: true, zeroCommission: true },
    reConnect: { enabled: true, eWasteRecyclingPipeline: true, repairCertificationReq: false },
    bookBridge: { enabled: true, communityCirculation: true, schoolPriority: true },
    secondServe: { enabled: true, coldChainMonitoring: true, maxHoldingHours: 12 }
  },
  moderation: {
    autoEscalateCriticalReports: true,
    requireDecisionReason: true,
    auditTrailRetentionDays: 365
  },
  complianceIndex: 99.98,
  version: 'v2.4.1'
};

/**
 * @desc Get comprehensive administrative dashboard telemetry
 * @route GET /api/admin/dashboard
 * @access Private (Admin)
 */
export const getDashboardOverview = asyncHandler(async (req, res) => {
  // Execute concurrent aggregation queries for optimal performance
  const [
    totalUsers,
    activeUsers,
    suspendedUsers,
    totalMentors,
    pendingMentors,
    totalArtisans,
    pendingArtisans,
    totalProducts,
    activeProducts,
    totalDevices,
    rehomedDevices,
    totalBooks,
    circulatingBooks,
    totalFood,
    totalServingsAgg,
    totalRequests,
    pendingRequests,
    completedRequests,
    totalOrders,
    orderRevenueAgg,
    paymentStatsAgg,
    openReports,
    criticalReports,
    recentAuditLogs
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ accountStatus: 'ACTIVE' }),
    User.countDocuments({ accountStatus: 'SUSPENDED' }),
    MentorProfile.countDocuments(),
    MentorProfile.countDocuments({ status: 'PENDING' }),
    ArtisanProfile.countDocuments(),
    ArtisanProfile.countDocuments({ verificationStatus: 'PENDING' }),
    Product.countDocuments(),
    Product.countDocuments({ status: 'ACTIVE' }),
    DeviceListing.countDocuments(),
    DeviceListing.countDocuments({ status: { $in: ['REHOMED', 'RECYCLED'] } }),
    BookListing.countDocuments(),
    BookListing.countDocuments({ status: { $in: ['CIRCULATING', 'DONATED'] } }),
    FoodDonation.countDocuments(),
    FoodDonation.aggregate([
      { $group: { _id: null, totalServings: { $sum: '$quantityServings' } } }
    ]),
    Request.countDocuments(),
    Request.countDocuments({ status: 'PENDING' }),
    Request.countDocuments({ status: 'COMPLETED' }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'COMPLETED' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]),
    Payment.aggregate([
      {
        $group: {
          _id: '$paymentType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          successfulCount: {
            $sum: { $cond: [{ $eq: ['$status', 'SUCCESS'] }, 1, 0] }
          },
          successfulAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'SUCCESS'] }, '$amount', 0] }
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] }
          },
          failedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] }
          }
        }
      }
    ]),
    Report.countDocuments({ status: { $in: ['PENDING', 'UNDER_REVIEW'] } }),
    Report.countDocuments({ severity: 'CRITICAL', status: { $in: ['PENDING', 'UNDER_REVIEW'] } }),
    AdminAuditLog.find()
      .populate('adminId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean()
  ]);

  // Extract structured payment breakdown
  let productPurchases = { count: 0, totalAmount: 0, successfulCount: 0, successfulAmount: 0 };
  let voluntaryContributions = { count: 0, totalAmount: 0, successfulCount: 0, successfulAmount: 0 };

  paymentStatsAgg.forEach((stat) => {
    if (stat._id === 'PRODUCT_PURCHASE') {
      productPurchases = stat;
    } else if (stat._id === 'VOLUNTARY_CONTRIBUTION') {
      voluntaryContributions = stat;
    }
  });

  const totalMealsSaved = totalServingsAgg.length > 0 ? totalServingsAgg[0].totalServings : 0;
  const totalCraftRevenue = orderRevenueAgg.length > 0 ? orderRevenueAgg[0].totalRevenue : 0;

  // Module summaries
  const modulesSummary = {
    wisdomLoop: {
      registeredMentors: totalMentors,
      pendingApplications: pendingMentors,
      totalSessions: completedRequests
    },
    craftToCart: {
      registeredArtisans: totalArtisans,
      pendingArtisans,
      totalProducts,
      activeProducts,
      totalOrders,
      salesVolume: totalCraftRevenue
    },
    reConnect: {
      devicesListed: totalDevices,
      repurposed: rehomedDevices
    },
    bookBridge: {
      booksListed: totalBooks,
      circulating: circulatingBooks
    },
    secondServe: {
      foodListings: totalFood,
      mealsSaved: totalMealsSaved
    }
  };

  const payload = {
    overview: {
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalMentors,
      pendingMentors,
      totalArtisans,
      pendingArtisans,
      totalProducts,
      totalDevices,
      totalBooks,
      totalFood,
      totalMealsSaved,
      totalRequests,
      pendingRequests,
      completedRequests,
      totalOrders,
      totalCraftRevenue,
      productPurchases,
      voluntaryContributions,
      openReports,
      criticalReports,
      pendingVettingQueue: pendingMentors + pendingArtisans
    },
    modulesSummary,
    recentAuditLogs,
    systemOperational: true,
    lastSynced: new Date().toISOString()
  };

  return sendResponse(res, 200, 'Dashboard telemetry fetched successfully', payload);
});

/**
 * @desc Get platform governance settings
 * @route GET /api/admin/settings
 * @access Private (Admin)
 */
export const getPlatformSettings = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, 'Platform settings retrieved', platformSettingsState);
});

/**
 * @desc Update platform governance settings
 * @route PUT /api/admin/settings
 * @access Private (Admin)
 */
export const updatePlatformSettings = asyncHandler(async (req, res) => {
  const updates = req.body;

  if (updates.modules) {
    platformSettingsState.modules = {
      ...platformSettingsState.modules,
      ...updates.modules
    };
  }
  if (updates.moderation) {
    platformSettingsState.moderation = {
      ...platformSettingsState.moderation,
      ...updates.moderation
    };
  }
  if (updates.platformName) platformSettingsState.platformName = updates.platformName;
  if (updates.tagline) platformSettingsState.tagline = updates.tagline;
  if (updates.supportEmail) platformSettingsState.supportEmail = updates.supportEmail;
  if (updates.legalEntity) platformSettingsState.legalEntity = updates.legalEntity;

  // Log admin action
  await AdminAuditLog.create({
    adminId: req.user._id,
    action: 'PLATFORM_SETTINGS_UPDATED',
    targetType: 'SYSTEM',
    details: { updatedKeys: Object.keys(updates) },
    ipAddress: req.ip
  });

  return sendResponse(res, 200, 'Platform settings updated successfully', platformSettingsState);
});

export default {
  getDashboardOverview,
  getPlatformSettings,
  updatePlatformSettings
};
