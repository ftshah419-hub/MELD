import mongoose from 'mongoose';

/**
 * Report Schema — Admin Moderation & Complaint Tracking
 * Follows MELD ER principles: connects community reporting to Users and Module Listings
 */
const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reportedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    module: {
      type: String,
      enum: ['WISDOM_LOOP', 'CRAFT_TO_CART', 'RECONNECT', 'BOOK_BRIDGE', 'SECOND_SERVE', 'PLATFORM'],
      required: true,
      index: true
    },
    targetType: {
      type: String,
      enum: ['User', 'MentorProfile', 'ArtisanProfile', 'Product', 'DeviceListing', 'BookListing', 'FoodDonation', 'Order'],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetType',
      default: null
    },
    reportType: {
      type: String,
      enum: [
        'HARASSMENT',
        'FRAUD',
        'COUNTERFEIT',
        'FOOD_SAFETY',
        'MISLEADING',
        'DEFECTIVE_DEVICE',
        'POLICY_VIOLATION',
        'OTHER'
      ],
      required: true,
      index: true
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
      index: true
    },
    title: {
      type: String,
      trim: true,
      default: 'Community Incident Report'
    },
    description: {
      type: String,
      required: [true, 'Report description is required'],
      maxlength: 2000
    },
    evidence: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: null },
        caption: { type: String, default: '' }
      }
    ],
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'ESCALATED'],
      default: 'PENDING',
      index: true
    },
    resolutionNotes: {
      type: String,
      default: ''
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

reportSchema.index({ status: 1, severity: 1, createdAt: -1 });

export const Report = mongoose.model('Report', reportSchema);
export default Report;
