import mongoose from 'mongoose';

const artisanProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    craftSpecialty: {
      type: String,
      required: true,
      trim: true
    },
    region: {
      type: String,
      required: true,
      trim: true
    },
    heritageStory: {
      type: String,
      default: ''
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    totalSales: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const ArtisanProfile = mongoose.model('ArtisanProfile', artisanProfileSchema);
export default ArtisanProfile;
