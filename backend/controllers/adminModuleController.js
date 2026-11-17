import { MentorProfile } from '../models/MentorProfile.js';
import { ArtisanProfile } from '../models/ArtisanProfile.js';
import { Product } from '../models/Product.js';
import { DeviceListing } from '../models/DeviceListing.js';
import { BookListing } from '../models/BookListing.js';
import { FoodDonation } from '../models/FoodDonation.js';
import { Request } from '../models/Request.js';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/ApiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc Get Wisdom Loop administration dataset (Mentors & Sessions)
 * @route GET /api/admin/wisdom-loop
 * @access Private (Admin)
 */
export const getWisdomLoopData = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const mentorQuery = {};

  if (status && status !== 'all') {
    mentorQuery.status = status.toUpperCase();
  }

  const [mentors, requests, statsAgg] = await Promise.all([
    MentorProfile.find(mentorQuery)
      .populate('userId', 'fullName email profileImage phone')
      .sort({ createdAt: -1 })
      .lean(),
    Request.find({ module: 'WISDOM_LOOP' })
      .populate('requesterId', 'fullName email')
      .populate('targetId')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    MentorProfile.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ])
  ]);

  return sendResponse(res, 200, 'Wisdom Loop administrative data retrieved', {
    mentors,
    requests,
    stats: statsAgg
  });
});

/**
 * @desc Get Craft to Cart administration dataset (Artisans, Products, Orders)
 * @route GET /api/admin/craft-to-cart
 * @access Private (Admin)
 */
export const getCraftToCartData = asyncHandler(async (req, res) => {
  const [artisans, products, orders, salesSummaryAgg] = await Promise.all([
    ArtisanProfile.find()
      .populate('userId', 'fullName email profileImage')
      .sort({ createdAt: -1 })
      .lean(),
    Product.find()
      .populate('artisanId', 'fullName email')
      .sort({ createdAt: -1 })
      .lean(),
    Order.find()
      .populate('buyerId', 'fullName email')
      .populate('items.productId', 'title price')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          totalAmount: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  return sendResponse(res, 200, 'Craft to Cart administrative data retrieved', {
    artisans,
    products,
    orders,
    salesSummary: salesSummaryAgg
  });
});

/**
 * @desc Get ReConnect administration dataset (Devices & Requests)
 * @route GET /api/admin/reconnect
 * @access Private (Admin)
 */
export const getReConnectData = asyncHandler(async (req, res) => {
  const { condition, status } = req.query;
  const query = {};

  if (condition && condition !== 'all') query.condition = condition.toUpperCase();
  if (status && status !== 'all') query.status = status.toUpperCase();

  const [devices, requests, conditionStatsAgg] = await Promise.all([
    DeviceListing.find(query)
      .populate('donorId', 'fullName email')
      .populate('recipientId', 'fullName email')
      .sort({ createdAt: -1 })
      .lean(),
    Request.find({ module: 'RECONNECT' })
      .populate('requesterId', 'fullName email')
      .populate('targetId')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    DeviceListing.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  return sendResponse(res, 200, 'ReConnect administrative data retrieved', {
    devices,
    requests,
    stats: conditionStatsAgg
  });
});

/**
 * @desc Get Book Bridge administration dataset (Books & Transfers)
 * @route GET /api/admin/book-bridge
 * @access Private (Admin)
 */
export const getBookBridgeData = asyncHandler(async (req, res) => {
  const { genre, status } = req.query;
  const query = {};

  if (genre && genre !== 'all') query.genre = genre;
  if (status && status !== 'all') query.status = status.toUpperCase();

  const [books, requests, statusStatsAgg] = await Promise.all([
    BookListing.find(query)
      .populate('donorId', 'fullName email')
      .populate('recipientId', 'fullName email')
      .sort({ createdAt: -1 })
      .lean(),
    Request.find({ module: 'BOOK_BRIDGE' })
      .populate('requesterId', 'fullName email')
      .populate('targetId')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    BookListing.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  return sendResponse(res, 200, 'Book Bridge administrative data retrieved', {
    books,
    requests,
    stats: statusStatsAgg
  });
});

/**
 * @desc Get Second Serve administration dataset (Food Donations & Safety Logs)
 * @route GET /api/admin/second-serve
 * @access Private (Admin)
 */
export const getSecondServeData = asyncHandler(async (req, res) => {
  const { status, dietaryType } = req.query;
  const query = {};

  if (status && status !== 'all') query.status = status.toUpperCase();
  if (dietaryType && dietaryType !== 'all') query.dietaryType = dietaryType.toUpperCase();

  const [foodListings, requests, statusStatsAgg] = await Promise.all([
    FoodDonation.find(query)
      .populate('donorId', 'fullName email phone')
      .populate('claimedByNgoId', 'fullName email')
      .sort({ createdAt: -1 })
      .lean(),
    Request.find({ module: 'SECOND_SERVE' })
      .populate('requesterId', 'fullName email')
      .populate('targetId')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    FoodDonation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalServings: { $sum: '$quantityServings' }
        }
      }
    ])
  ]);

  // Check for expired or cold-chain alerts
  const now = new Date();
  const alertListings = foodListings.filter(
    (item) => item.status === 'AVAILABLE' && new Date(item.bestBefore) < now
  );

  return sendResponse(res, 200, 'Second Serve administrative data retrieved', {
    foodListings,
    requests,
    stats: statusStatsAgg,
    expiredAlertsCount: alertListings.length
  });
});

/**
 * @desc Cross-module polymorphic request browser
 * @route GET /api/admin/requests
 * @access Private (Admin)
 */
export const getRequests = asyncHandler(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const { module, status, requestType } = req.query;

  const query = {};
  if (module && module !== 'all') query.module = module.toUpperCase();
  if (status && status !== 'all') query.status = status.toUpperCase();
  if (requestType && requestType !== 'all') query.requestType = requestType.toUpperCase();

  const [total, requests] = await Promise.all([
    Request.countDocuments(query),
    Request.find(query)
      .populate('requesterId', 'fullName email')
      .populate('targetId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  return sendResponse(res, 200, 'Requests retrieved successfully', {
    requests,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
});

/**
 * @desc Get all Craft to Cart orders with full filters
 * @route GET /api/admin/orders
 * @access Private (Admin)
 */
export const getOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const { orderStatus, paymentStatus, search } = req.query;

  const query = {};
  if (orderStatus && orderStatus !== 'all') query.orderStatus = orderStatus.toUpperCase();
  if (paymentStatus && paymentStatus !== 'all') query.paymentStatus = paymentStatus.toUpperCase();

  const [total, orders] = await Promise.all([
    Order.countDocuments(query),
    Order.find(query)
      .populate('buyerId', 'fullName email')
      .populate('items.productId', 'title price images category')
      .populate('paymentId', 'razorpayPaymentId status amount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  return sendResponse(res, 200, 'Orders retrieved successfully', {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
});

export default {
  getWisdomLoopData,
  getCraftToCartData,
  getReConnectData,
  getBookBridgeData,
  getSecondServeData,
  getRequests,
  getOrders
};
