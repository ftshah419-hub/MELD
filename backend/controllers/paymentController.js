import { paymentService } from '../services/paymentService.js';
import { razorpayService } from '../services/razorpayService.js';
import { Payment } from '../models/Payment.js';
import { sendResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const paymentController = {
  /**
   * Initialize a payment order
   */
  createOrder: asyncHandler(async (req, res) => {
    const { paymentType, module, amount, orderId, contributionId, notes } = req.body;
    const userId = req.user.id || req.user._id;

    if (!paymentType || !module) {
      throw ApiError.badRequest('paymentType and module are required.');
    }

    const orderData = await paymentService.createPaymentOrder({
      userId,
      paymentType,
      module,
      amount,
      orderId,
      contributionId,
      notes
    });

    return sendResponse(res, 201, 'Payment order created successfully', orderData);
  }),

  /**
   * Verify signature of completed payment
   */
  verifyPayment: asyncHandler(async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw ApiError.badRequest('razorpayOrderId, razorpayPaymentId, and razorpaySignature are required.');
    }

    const result = await paymentService.verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    return sendResponse(res, 200, 'Payment verified successfully', {
      payment: result.payment,
      alreadyProcessed: result.alreadyProcessed
    });
  }),

  /**
   * Receive Razorpay Webhook notification
   */
  handleWebhook: asyncHandler(async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];

    // rawBody is attached by Express raw-body parser on the webhook route
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const isValid = razorpayService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      throw ApiError.badRequest('Invalid webhook signature');
    }

    // Process event asynchronously
    await paymentService.processWebhookEvent(req.body);

    return res.status(200).json({ status: 'ok' });
  }),

  /**
   * Fetch payment history for authenticated user
   */
  getPaymentHistory: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 }).limit(50);

    return sendResponse(res, 200, 'Payment history retrieved', {
      payments
    });
  })
};

export default paymentController;
