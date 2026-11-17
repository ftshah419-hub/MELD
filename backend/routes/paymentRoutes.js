import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @route   POST /api/payments/create-order
 * @desc    Initialize a payment order with Razorpay
 * @access  Private
 */
router.post('/create-order', authenticate, paymentController.createOrder);

/**
 * @route   POST /api/payments/verify
 * @desc    Verify Razorpay payment signature & confirm payment
 * @access  Private
 */
router.post('/verify', authenticate, paymentController.verifyPayment);

/**
 * @route   POST /api/payments/webhook
 * @desc    Razorpay server-to-server webhook
 * @access  Public (Signature-verified)
 */
router.post('/webhook', paymentController.handleWebhook);

/**
 * @route   GET /api/payments/history
 * @desc    Fetch payment records for authenticated user
 * @access  Private
 */
router.get('/history', authenticate, paymentController.getPaymentHistory);

export default router;
