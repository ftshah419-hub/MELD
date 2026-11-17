import mongoose from 'mongoose';

const deviceListingSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    deviceType: {
      type: String,
      enum: ['LAPTOP', 'TABLET', 'SMARTPHONE', 'DESKTOP', 'PERIPHERAL', 'OTHER'],
      required: true
    },
    brand: String,
    modelName: String,
    condition: {
      type: String,
      enum: ['WORKING', 'NEEDS_REPAIR', 'PARTS_ONLY'],
      required: true
    },
    specifications: {
      ram: String,
      storage: String,
      processor: String
    },
    images: [
      {
        url: String,
        publicId: String
      }
    ],
    status: {
      type: String,
      enum: ['AVAILABLE', 'MATCHED', 'UNDER_REPAIR', 'REHOMED', 'RECYCLED'],
      default: 'AVAILABLE',
      index: true
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const DeviceListing = mongoose.model('DeviceListing', deviceListingSchema);
export default DeviceListing;
