import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    requesterId: {
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
    targetType: {
      type: String,
      enum: ['MentorProfile', 'DeviceListing', 'BookListing', 'FoodDonation', 'Product'],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetType',
      required: true
    },
    requestType: {
      type: String,
      enum: ['MENTORSHIP_SESSION', 'DEVICE_CLAIM', 'BOOK_BORROW', 'FOOD_RESCUE', 'CUSTOM_INQUIRY'],
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
    responseNote: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

requestSchema.index({ requesterId: 1, module: 1, status: 1 });

export const Request = mongoose.model('Request', requestSchema);
export default Request;
