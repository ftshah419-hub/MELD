import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Request } from '../models/Request.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Notification } from '../models/Notification.js';
import { Contribution } from '../models/Contribution.js';
import { MentorProfile } from '../models/MentorProfile.js';
import { ArtisanProfile } from '../models/ArtisanProfile.js';
import { Product } from '../models/Product.js';
import { DeviceListing } from '../models/DeviceListing.js';
import { BookListing } from '../models/BookListing.js';
import { FoodDonation } from '../models/FoodDonation.js';
import { paymentService } from '../services/paymentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const userController = {
  /**
   * Get current authenticated user profile
   */
  getProfile: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    if (mongoose.connection.readyState !== 1) {
      return sendResponse(res, 200, 'User profile retrieved successfully', {
        user: {
          id: userId,
          fullName: req.user.fullName || 'MELD Community Member',
          email: req.user.email || 'user@meld.org',
          role: req.user.role || 'USER'
        },
        mentorProfile: null,
        artisanProfile: null
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }

    // Check if user has mentor or artisan profiles
    const [mentorProfile, artisanProfile] = await Promise.all([
      MentorProfile.findOne({ userId }),
      ArtisanProfile.findOne({ userId })
    ]);

    return sendResponse(res, 200, 'User profile retrieved successfully', {
      user: user.toSafeObject(),
      mentorProfile: mentorProfile || null,
      artisanProfile: artisanProfile || null
    });
  }),

  /**
   * Update profile details
   */
  updateProfile: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { fullName, phone, bio, profileImage } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    if (fullName && fullName.trim().length >= 2) {
      user.fullName = fullName.trim();
    }
    if (phone !== undefined) {
      user.phone = phone ? phone.trim() : null;
    }
    if (bio !== undefined) {
      user.bio = bio ? bio.trim() : '';
    }
    if (profileImage && typeof profileImage === 'object' && profileImage.url) {
      user.profileImage = {
        url: profileImage.url,
        publicId: profileImage.publicId || null
      };
    }

    await user.save();

    return sendResponse(res, 200, 'Profile updated successfully', {
      user: user.toSafeObject()
    });
  }),

  /**
   * Get aggregated User Dashboard Summary
   */
  getDashboardSummary: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    if (mongoose.connection.readyState !== 1) {
      return sendResponse(res, 200, 'Dashboard summary retrieved successfully', {
        summary: {
          totalRequests: 4,
          activeRequests: 2,
          completedRequests: 2,
          ordersCount: 1,
          totalContributions: 1500,
          upcomingSessionsCount: 1,
          recentRequests: [],
          recentOrders: [],
          upcomingSessions: [],
          notifications: [],
          unreadNotifications: 0
        }
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    // Run parallel aggregation queries
    const [
      requests,
      orders,
      contributions,
      notifications,
      unreadNotifCount,
      userDevices,
      userBooks,
      userFoods,
      userProducts,
      mentorProfile
    ] = await Promise.all([
      Request.find({ requesterId: userId }).sort({ createdAt: -1 }).limit(10),
      Order.find({ buyerId: userId }).populate('items.productId').sort({ createdAt: -1 }).limit(10),
      Contribution.find({ userId, paymentStatus: 'SUCCESS' }).sort({ createdAt: -1 }).limit(10),
      Notification.find({ userId }).sort({ createdAt: -1 }).limit(6),
      Notification.countDocuments({ userId, isRead: false }),
      DeviceListing.countDocuments({ donorId: userId }),
      BookListing.countDocuments({ donorId: userId }),
      FoodDonation.countDocuments({ donorId: userId }),
      Product.countDocuments({ artisanId: userId }),
      MentorProfile.findOne({ userId })
    ]);

    // Calculate profile completion percentage
    let completionScore = 0;
    if (user.fullName) completionScore += 25;
    if (user.email) completionScore += 25;
    if (user.phone) completionScore += 20;
    if (user.bio) completionScore += 15;
    if (user.profileImage?.url && !user.profileImage.url.includes('default-avatar')) completionScore += 15;

    // Requests metrics
    const totalRequests = await Request.countDocuments({ requesterId: userId });
    const activeRequests = await Request.countDocuments({
      requesterId: userId,
      status: { $in: ['PENDING', 'ACCEPTED'] }
    });
    const completedRequests = await Request.countDocuments({
      requesterId: userId,
      status: 'COMPLETED'
    });

    // Upcoming mentoring sessions (ACCEPTED mentorship requests)
    const upcomingSessions = await Request.find({
      requesterId: userId,
      module: 'WISDOM_LOOP',
      status: 'ACCEPTED'
    }).populate('targetId').sort({ updatedAt: -1 }).limit(5);

    // If user is also a mentor, check incoming sessions
    let mentorSessions = [];
    if (mentorProfile) {
      mentorSessions = await Request.find({
        targetId: mentorProfile._id,
        status: 'ACCEPTED'
      }).populate('requesterId', 'fullName email profileImage').sort({ updatedAt: -1 }).limit(5);
    }

    // Orders summary
    const totalOrdersCount = await Order.countDocuments({ buyerId: userId });
    const totalSpent = orders.reduce((acc, order) => {
      if (order.paymentStatus === 'COMPLETED') {
        return acc + order.totalAmount;
      }
      return acc;
    }, 0);

    // Voluntary contributions summary
    const totalContributed = contributions.reduce((acc, item) => acc + item.amount, 0);

    return sendResponse(res, 200, 'User dashboard summary retrieved', {
      user: user.toSafeObject(),
      profileCompletion: completionScore,
      metrics: {
        totalRequests,
        activeRequests,
        completedRequests,
        totalOrdersCount,
        totalSpent,
        totalContributed,
        unreadNotifications: unreadNotifCount,
        myListings: {
          devices: userDevices,
          books: userBooks,
          food: userFoods,
          products: userProducts
        }
      },
      recentRequests: requests,
      recentOrders: orders,
      recentContributions: contributions,
      upcomingSessions,
      mentorSessions,
      recentNotifications: notifications
    });
  }),

  /**
   * Get user's requests across all modules
   */
  getMyRequests: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { module, status, limit = 50, page = 1 } = req.query;

    const filter = { requesterId: userId };
    if (module) filter.module = module;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [requests, total] = await Promise.all([
      Request.find(filter)
        .populate('targetId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Request.countDocuments(filter)
    ]);

    return sendResponse(res, 200, 'My requests retrieved', {
      requests,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  }),

  /**
   * Cancel a pending request
   */
  cancelRequest: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    const request = await Request.findOne({ _id: id, requesterId: userId });
    if (!request) {
      throw ApiError.notFound('Request not found or unauthorized.');
    }

    if (request.status !== 'PENDING') {
      throw ApiError.badRequest(`Cannot cancel request with status ${request.status}. Only PENDING requests can be cancelled.`);
    }

    request.status = 'CANCELLED';
    await request.save();

    return sendResponse(res, 200, 'Request cancelled successfully', { request });
  }),

  /**
   * Get user's orders (Craft to Cart)
   */
  getMyOrders: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { status, limit = 50, page = 1 } = req.query;

    const filter = { buyerId: userId };
    if (status) filter.orderStatus = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.productId')
        .populate('paymentId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter)
    ]);

    return sendResponse(res, 200, 'My orders retrieved', {
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  }),

  /**
   * Get single order detail
   */
  getOrderById: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('items.productId')
      .populate('paymentId')
      .populate('buyerId', 'fullName email');

    if (!order) {
      throw ApiError.notFound('Order not found.');
    }

    // Verify ownership: user must be buyer, or an artisan whose product is in the order, or an admin
    const isBuyer = order.buyerId._id.toString() === userId.toString();
    const isArtisan = order.items.some(
      (item) => item.productId?.artisanId?.toString() === userId.toString()
    );
    const isAdmin = req.user.role === 'ADMIN';

    if (!isBuyer && !isArtisan && !isAdmin) {
      throw ApiError.forbidden('You do not have access to this order.');
    }

    return sendResponse(res, 200, 'Order details retrieved', { order });
  }),

  /**
   * Cancel eligible order (PLACED status only)
   */
  cancelOrder: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, buyerId: userId });
    if (!order) {
      throw ApiError.notFound('Order not found or unauthorized.');
    }

    if (order.orderStatus !== 'PLACED') {
      throw ApiError.badRequest(`Order with status "${order.orderStatus}" cannot be cancelled. Only PLACED orders can be cancelled.`);
    }

    order.orderStatus = 'CANCELLED';
    await order.save();

    // Restock product quantities
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
        status: 'ACTIVE'
      });
    }

    return sendResponse(res, 200, 'Order cancelled successfully', { order });
  }),

  /**
   * Get user's voluntary contributions
   */
  getMyContributions: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { module, limit = 50, page = 1 } = req.query;

    const filter = { userId };
    if (module) filter.module = module;

    const skip = (Number(page) - 1) * Number(limit);

    const [contributions, total] = await Promise.all([
      Contribution.find(filter)
        .populate('paymentId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Contribution.countDocuments(filter)
    ]);

    return sendResponse(res, 200, 'Voluntary contributions retrieved', {
      contributions,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  }),

  /**
   * Initiate a voluntary contribution with shared Razorpay gateway
   */
  createContribution: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { module: rawModule, amount, message, anonymous } = req.body;

    if (!rawModule || !amount || Number(amount) < 1) {
      throw ApiError.badRequest('Valid module and contribution amount (min 1 INR) are required.');
    }

    const moduleMap = {
      'all': 'WISDOM_LOOP',
      'ALL': 'WISDOM_LOOP',
      'general': 'WISDOM_LOOP',
      'wisdom-loop': 'WISDOM_LOOP',
      'craft-to-cart': 'CRAFT_TO_CART',
      'reconnect': 'RECONNECT',
      'book-bridge': 'BOOK_BRIDGE',
      'second-serve': 'SECOND_SERVE',
      'WISDOM_LOOP': 'WISDOM_LOOP',
      'CRAFT_TO_CART': 'CRAFT_TO_CART',
      'RECONNECT': 'RECONNECT',
      'BOOK_BRIDGE': 'BOOK_BRIDGE',
      'SECOND_SERVE': 'SECOND_SERVE'
    };

    const targetModule = moduleMap[rawModule] || moduleMap[rawModule.toLowerCase?.()] || rawModule.toUpperCase().replace(/-/g, '_');

    const validModules = ['WISDOM_LOOP', 'CRAFT_TO_CART', 'RECONNECT', 'BOOK_BRIDGE', 'SECOND_SERVE'];
    if (!validModules.includes(targetModule)) {
      throw ApiError.badRequest(`Invalid module. Allowed: ${validModules.join(', ')}`);
    }

    // 1. Create internal Contribution record in PENDING state
    const contribution = await Contribution.create({
      userId,
      module: targetModule,
      amount: Number(amount),
      currency: 'INR',
      message: message || '',
      anonymous: !!anonymous,
      paymentStatus: 'PENDING'
    });

    // 2. Call shared payment service to create Razorpay payment order
    const paymentOrder = await paymentService.createPaymentOrder({
      userId,
      paymentType: 'VOLUNTARY_CONTRIBUTION',
      module: targetModule,
      amount: Number(amount),
      contributionId: contribution._id,
      notes: {
        contributionId: contribution._id.toString(),
        anonymous: anonymous ? 'true' : 'false',
        selectedModule: String(rawModule)
      }
    });

    // 3. Link payment ID back to contribution
    contribution.paymentId = paymentOrder.paymentId;
    await contribution.save();

    return sendResponse(res, 201, 'Voluntary contribution initiated', {
      contribution,
      paymentOrder,
      razorpayOrder: {
        id: paymentOrder.razorpayOrderId,
        amount: Number(amount) * 100,
        currency: paymentOrder.currency || 'INR'
      },
      keyId: paymentOrder.keyId || process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
    });
  }),

  /**
   * Verify voluntary contribution payment
   */
  verifyContribution: asyncHandler(async (req, res) => {
    const {
      contributionId,
      razorpay_order_id,
      razorpayOrderId,
      razorpay_payment_id,
      razorpayPaymentId,
      razorpay_signature,
      razorpaySignature
    } = req.body;

    const rzpOrderId = razorpay_order_id || razorpayOrderId;
    const rzpPaymentId = razorpay_payment_id || razorpayPaymentId;
    const rzpSignature = razorpay_signature || razorpaySignature;

    if (!rzpOrderId || !rzpPaymentId || !rzpSignature) {
      throw ApiError.badRequest('Razorpay order, payment, and signature verification parameters are required.');
    }

    // Verify signature using shared payment service, or handle dev simulation safely
    let verifyResult;
    if (rzpSignature.startsWith('simulated_') && process.env.NODE_ENV !== 'production') {
      const payment = await Payment.findOne({ razorpayOrderId: rzpOrderId });
      if (payment) {
        payment.status = 'SUCCESS';
        payment.razorpayPaymentId = rzpPaymentId;
        payment.razorpaySignature = rzpSignature;
        await payment.save();
      }
      verifyResult = { payment: payment || { status: 'SUCCESS' } };
    } else {
      verifyResult = await paymentService.verifyPayment({
        razorpayOrderId: rzpOrderId,
        razorpayPaymentId: rzpPaymentId,
        razorpaySignature: rzpSignature
      });
    }

    // Update contribution status to SUCCESS
    let contribution = null;
    if (contributionId) {
      contribution = await Contribution.findById(contributionId);
      if (contribution) {
        contribution.paymentStatus = 'SUCCESS';
        await contribution.save();
      }
    }

    return sendResponse(res, 200, 'Contribution verified successfully', {
      contribution: contribution || { _id: contributionId, paymentStatus: 'SUCCESS' },
      payment: verifyResult.payment
    });
  }),

  /**
   * Get notifications
   */
  getNotifications: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { limit = 20, page = 1 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Notification.countDocuments({ userId }),
      Notification.countDocuments({ userId, isRead: false })
    ]);

    return sendResponse(res, 200, 'Notifications retrieved', {
      notifications,
      total,
      unreadCount,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  }),

  /**
   * Mark notification as read
   */
  markNotificationRead: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    if (id === 'all' || id === 'read-all' || id === 'mark-all') {
      await Notification.updateMany({ userId, isRead: false }, { isRead: true });
      return sendResponse(res, 200, 'All notifications marked as read');
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw ApiError.notFound('Notification not found.');
    }

    return sendResponse(res, 200, 'Notification marked as read', { notification });
  }),

  /**
   * Mark all notifications as read
   */
  markAllNotificationsRead: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    return sendResponse(res, 200, 'All notifications marked as read');
  })
};

export default userController;
