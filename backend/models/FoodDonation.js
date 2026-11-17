import mongoose from 'mongoose';

const foodDonationSchema = new mongoose.Schema(
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
    foodType: {
      type: String,
      enum: ['COOKED_MEALS', 'BAKERY_BREAD', 'RAW_PRODUCE', 'PACKAGED_GOODS'],
      required: true
    },
    quantityServings: {
      type: Number,
      required: true,
      min: 1
    },
    cookedAt: Date,
    bestBefore: {
      type: Date,
      required: true
    },
    dietaryType: {
      type: String,
      enum: ['VEG', 'NON_VEG', 'VEGAN'],
      default: 'VEG'
    },
    pickupAddress: {
      street: String,
      city: String,
      contactPhone: String
    },
    images: [
      {
        url: String,
        publicId: String
      }
    ],
    status: {
      type: String,
      enum: ['AVAILABLE', 'CLAIMED', 'PICKED_UP', 'DELIVERED', 'EXPIRED'],
      default: 'AVAILABLE',
      index: true
    },
    claimedByNgoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const FoodDonation = mongoose.model('FoodDonation', foodDonationSchema);
export default FoodDonation;
