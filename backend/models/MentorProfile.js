import mongoose from 'mongoose';

const mentorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    expertiseAreas: [{
      type: String,
      trim: true
    }],
    yearsOfExperience: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      required: true
    },
    availability: {
      days: [String],
      hoursPerWeek: Number
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'INACTIVE'],
      default: 'PENDING',
      index: true
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    totalSessions: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const MentorProfile = mongoose.model('MentorProfile', mentorProfileSchema);
export default MentorProfile;
