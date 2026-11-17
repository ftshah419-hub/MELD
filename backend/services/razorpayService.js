import crypto from 'crypto';
import { getRazorpayInstance } from '../config/razorpay.js';
import { ApiError } from '../utils/ApiError.js';

export const razorpayService = {
  /**
   * Create an official order on Razorpay servers
   * @param {Object} params - { amountInINR, receipt, notes }
   */
  async createOrder({ amountInINR, receipt, notes = {} }) {
    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      throw ApiError.internal('Razorpay service is not configured. Missing API credentials.');
    }

    if (!amountInINR || amountInINR <= 0) {
      throw ApiError.badRequest('Invalid payment amount. Amount must be greater than zero.');
    }

    // Razorpay requires amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amountInINR * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes
    };

    try {
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      throw new ApiError(500, `Razorpay order creation failed: ${error.message}`);
    }
  },

  /**
   * Verify signature for completed checkout payment
   * @param {Object} params - { razorpayOrderId, razorpayPaymentId, razorpaySignature }
   */
  verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw ApiError.internal('Razorpay key secret is not configured.');
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return false;
    }

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(razorpaySignature, 'utf-8')
      );
    } catch {
      return false;
    }
  },

  /**
   * Verify webhook signature from Razorpay servers
   * @param {string|Buffer} rawBody - Raw unparsed request body string/buffer
   * @param {string} signature - x-razorpay-signature header
   */
  verifyWebhookSignature(rawBody, signature) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw ApiError.internal('Razorpay webhook secret is not configured.');
    }

    if (!rawBody || !signature) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(signature, 'utf-8')
      );
    } catch {
      return false;
    }
  }
};

export default razorpayService;
