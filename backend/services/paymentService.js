import { Payment } from '../models/Payment.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Notification } from '../models/Notification.js';
import { razorpayService } from './razorpayService.js';
import { ApiError } from '../utils/ApiError.js';

export const paymentService = {
  /**
   * Create Razorpay order and internal payment record
   */
  async createPaymentOrder({ userId, paymentType, module, amount, orderId, contributionId, notes = {} }) {
    let finalAmount = Number(amount);

    // Business validation: Product purchases vs voluntary contributions
    if (paymentType === 'PRODUCT_PURCHASE') {
      if (!orderId) {
        throw ApiError.badRequest('Order ID is required for product purchases.');
      }

      const order = await Order.findById(orderId).populate('items.productId');
      if (!order) {
        throw ApiError.notFound('Associated order not found.');
      }

      // Calculate total securely from database products, never trusting client amount
      let verifiedTotal = 0;
      for (const item of order.items) {
        const prod = item.productId;
        if (!prod || prod.status !== 'ACTIVE') {
          throw ApiError.badRequest('One or more products in this order are no longer available.');
        }
        verifiedTotal += prod.price * item.quantity;
      }

      finalAmount = verifiedTotal;
      order.totalAmount = verifiedTotal;
      await order.save();
    } else if (paymentType === 'VOLUNTARY_CONTRIBUTION') {
      if (!finalAmount || finalAmount < 1) {
        throw ApiError.badRequest('Voluntary contribution amount must be at least 1 INR.');
      }
    } else {
      throw ApiError.badRequest('Invalid payment type. Must be PRODUCT_PURCHASE or VOLUNTARY_CONTRIBUTION.');
    }

    // Call Razorpay API to generate remote order
    const receipt = `meld_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const razorpayOrder = await razorpayService.createOrder({
      amountInINR: finalAmount,
      receipt,
      notes: {
        userId: userId.toString(),
        paymentType,
        module,
        ...notes
      }
    });

    // Create internal payment document in PENDING state
    const payment = await Payment.create({
      userId,
      paymentType,
      module,
      orderId: orderId || null,
      contributionId: contributionId || null,
      razorpayOrderId: razorpayOrder.id,
      amount: finalAmount,
      currency: razorpayOrder.currency || 'INR',
      status: 'PENDING',
      receiptNumber: receipt,
      notes
    });

    return {
      paymentId: payment._id,
      razorpayOrderId: razorpayOrder.id,
      amount: finalAmount,
      currency: razorpayOrder.currency || 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      receipt
    };
  },

  /**
   * Verify signature and update payment status idempotently
   */
  async verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const payment = await Payment.findOne({ razorpayOrderId });

    if (!payment) {
      throw ApiError.notFound('Payment record matching this Razorpay order was not found.');
    }

    // Idempotency: if already completed, return existing status
    if (payment.status === 'SUCCESS') {
      return { payment, alreadyProcessed: true };
    }

    // Verify cryptographic HMAC signature
    const isValid = razorpayService.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    if (!isValid) {
      payment.status = 'FAILED';
      payment.errorMessage = 'Razorpay signature verification failed.';
      await payment.save();
      throw ApiError.badRequest('Invalid payment signature. Payment could not be verified.');
    }

    // Mark as SUCCESS
    payment.status = 'SUCCESS';
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    // If linked to an order, update order status
    if (payment.orderId) {
      await Order.findByIdAndUpdate(payment.orderId, {
        paymentStatus: 'COMPLETED',
        paymentId: payment._id,
        orderStatus: 'PROCESSING'
      });
    }

    // Create confirmation notification for user
    try {
      await Notification.create({
        userId: payment.userId,
        title: 'Payment Confirmed',
        message: `Your payment of ₹${payment.amount} for ${payment.module} (${payment.paymentType}) has been verified successfully.`,
        type: 'PAYMENT',
        link: '/user/dashboard'
      });
    } catch {
      // Non-blocking
    }

    return { payment, alreadyProcessed: false };
  },

  /**
   * Process incoming server-to-server Razorpay webhooks
   */
  async processWebhookEvent(event) {
    const eventType = event.event;
    const paymentEntity = event.payload?.payment?.entity;

    if (!paymentEntity) return;

    const razorpayOrderId = paymentEntity.order_id;
    const razorpayPaymentId = paymentEntity.id;

    if (!razorpayOrderId) return;

    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) return;

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      if (payment.status !== 'SUCCESS') {
        payment.status = 'SUCCESS';
        payment.razorpayPaymentId = razorpayPaymentId;
        await payment.save();

        if (payment.orderId) {
          await Order.findByIdAndUpdate(payment.orderId, {
            paymentStatus: 'COMPLETED',
            orderStatus: 'PROCESSING'
          });
        }
      }
    } else if (eventType === 'payment.failed') {
      if (payment.status === 'PENDING') {
        payment.status = 'FAILED';
        payment.errorMessage = paymentEntity.error_description || 'Payment failed on Razorpay.';
        await payment.save();
      }
    }
  }
};

export default paymentService;
