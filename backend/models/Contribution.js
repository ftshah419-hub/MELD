import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    module: {
      type: String,
      enum: ['WISDOM_LOOP', 'CRAFT_TO_CART', 'RECONNECT', 'BOOK_BRIDGE', 'SECOND_SERVE'],
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Contribution must be at least 1 INR']
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
      index: true
    },
    message: {
      type: String,
      maxlength: 500,
      default: ''
    },
    anonymous: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

contributionSchema.index({ userId: 1, createdAt: -1 });
contributionSchema.index({ module: 1, paymentStatus: 1 });

export const Contribution = mongoose.model('Contribution', contributionSchema);
export default Contribution;
