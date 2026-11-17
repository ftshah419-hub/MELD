import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false // Never return passwordHash in standard queries
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
      index: true
    },
    profileImage: {
      url: {
        type: String,
        default: 'https://res.cloudinary.com/meld-community/image/upload/v1/meld/default-avatar.png'
      },
      publicId: {
        type: String,
        default: null
      }
    },
    phone: {
      type: String,
      trim: true,
      default: null
    },
    bio: {
      type: String,
      maxlength: 500,
      default: ''
    },
    accountStatus: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'INACTIVE'],
      default: 'ACTIVE'
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

/**
 * Pre-save middleware to hash password if modified
 */
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

/**
 * Compare candidate password with stored hash
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Return sanitized user object without sensitive fields
 */
userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    id: this._id,
    fullName: this.fullName,
    name: this.fullName,
    email: this.email,
    role: this.role,
    profileImage: this.profileImage,
    phone: this.phone,
    bio: this.bio,
    accountStatus: this.accountStatus,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const User = mongoose.model('User', userSchema);
export default User;
