import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least 1 INR']
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: null }
      }
    ],
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ category: 1, status: 1 });

export const Product = mongoose.model('Product', productSchema);
export default Product;
