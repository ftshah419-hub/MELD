import { Payment } from '../models/Payment.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc Get consolidated platform payment transaction ledger
 * @route GET /api/admin/payments
 * @access Private (Admin)
 */
export const getPayments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const { paymentType, module, status, search, startDate, endDate } = req.query;

  const query = {};

  if (paymentType && paymentType !== 'all') {
    query.paymentType = paymentType.toUpperCase();
  }

  if (module && module !== 'all') {
    query.module = module.toUpperCase();
  }

  if (status && status !== 'all') {
    query.status = status.toUpperCase();
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (search && search.trim()) {
    const term = search.trim();
    query.$or = [
      { razorpayOrderId: { $regex: term, $options: 'i' } },
      { razorpayPaymentId: { $regex: term, $options: 'i' } },
      { receiptNumber: { $regex: term, $options: 'i' } }
    ];
  }

  const [total, payments, summaryAgg] = await Promise.all([
    Payment.countDocuments(query),
    Payment.find(query)
      .populate('userId', 'fullName email')
      .populate('orderId', 'totalAmount orderStatus')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalVolume: { $sum: '$amount' },
          successVolume: {
            $sum: { $cond: [{ $eq: ['$status', 'SUCCESS'] }, '$amount', 0] }
          },
          successCount: {
            $sum: { $cond: [{ $eq: ['$status', 'SUCCESS'] }, 1, 0] }
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] }
          },
          failedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] }
          }
        }
      }
    ])
  ]);

  const summary = summaryAgg.length > 0 ? summaryAgg[0] : {
    totalVolume: 0,
    successVolume: 0,
    successCount: 0,
    pendingCount: 0,
    failedCount: 0
  };

  return sendResponse(res, 200, 'Payments ledger retrieved successfully', {
    payments,
    summary,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
});

/**
 * @desc Get payment transaction detail
 * @route GET /api/admin/payments/:id
 * @access Private (Admin)
 */
export const getPaymentDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await Payment.findById(id)
    .populate('userId', 'fullName email profileImage phone')
    .populate({
      path: 'orderId',
      populate: { path: 'items.productId', select: 'title price images category' }
    })
    .lean();

  if (!payment) {
    throw ApiError.notFound('Payment record not found.');
  }

  return sendResponse(res, 200, 'Payment detail retrieved', payment);
});

/**
 * @desc Get voluntary contribution overview and history
 * @route GET /api/admin/contributions
 * @access Private (Admin)
 */
export const getContributions = asyncHandler(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const { module, startDate, endDate } = req.query;

  const query = { paymentType: 'VOLUNTARY_CONTRIBUTION' };

  if (module && module !== 'all') {
    query.module = module.toUpperCase();
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const [total, contributions, moduleTotalsAgg] = await Promise.all([
    Payment.countDocuments(query),
    Payment.find(query)
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payment.aggregate([
      { $match: { paymentType: 'VOLUNTARY_CONTRIBUTION', status: 'SUCCESS' } },
      {
        $group: {
          _id: '$module',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  const moduleBreakdown = {
    WISDOM_LOOP: 0,
    CRAFT_TO_CART: 0,
    RECONNECT: 0,
    BOOK_BRIDGE: 0,
    SECOND_SERVE: 0
  };

  let aggregateTotalAmount = 0;
  moduleTotalsAgg.forEach((item) => {
    if (moduleBreakdown[item._id] !== undefined) {
      moduleBreakdown[item._id] = item.totalAmount;
    }
    aggregateTotalAmount += item.totalAmount;
  });

  return sendResponse(res, 200, 'Voluntary contributions retrieved successfully', {
    contributions,
    summary: {
      totalContributionsCount: total,
      aggregateTotalAmount,
      moduleBreakdown
    },
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
});

export default {
  getPayments,
  getPaymentDetails,
  getContributions
};
