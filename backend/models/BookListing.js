import mongoose from 'mongoose';

const bookListingSchema = new mongoose.Schema(
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
    author: {
      type: String,
      required: true,
      trim: true
    },
    isbn: String,
    genre: String,
    condition: {
      type: String,
      enum: ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR'],
      default: 'GOOD'
    },
    images: [
      {
        url: String,
        publicId: String
      }
    ],
    status: {
      type: String,
      enum: ['AVAILABLE', 'REQUESTED', 'CIRCULATING', 'DONATED'],
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

export const BookListing = mongoose.model('BookListing', bookListingSchema);
export default BookListing;
