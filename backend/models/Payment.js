import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    paymentType: {
      type: String,
      enum: ['PRODUCT_PURCHASE', 'VOLUNTARY_CONTRIBUTION'],
      required: true
    },
    module: {
      type: String,
      enum: ['WISDOM_LOOP', 'CRAFT_TO_CART', 'RECONNECT', 'BOOK_BRIDGE', 'SECOND_SERVE'],
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    contributionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    razorpayPaymentId: {
      type: String,
      default: null,
      index: true
    },
    razorpaySignature: {
      type: String,
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Amount must be at least 1 INR']
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true
    },
    errorMessage: {
      type: String,
      default: null
    },
    receiptNumber: {
      type: String,
      default: null
    },
    notes: {
      type: Map,
      of: String,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, paymentType: 1 });

export const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
