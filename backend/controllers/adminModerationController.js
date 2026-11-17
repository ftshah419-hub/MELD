import { MentorProfile } from '../models/MentorProfile.js';
import { ArtisanProfile } from '../models/ArtisanProfile.js';
import { Product } from '../models/Product.js';
import { DeviceListing } from '../models/DeviceListing.js';
import { BookListing } from '../models/BookListing.js';
import { FoodDonation } from '../models/FoodDonation.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { Notification } from '../models/Notification.js';
import { ApiError } from '../utils/ApiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc Get consolidated verification and moderation queue
 * @route GET /api/admin/moderation/queue
 * @access Private (Admin)
 */
export const getPendingVerifications = asyncHandler(async (req, res) => {
  const { module } = req.query;

  const [
    pendingMentors,
    pendingArtisans,
    draftProducts
  ] = await Promise.all([
    (!module || module === 'wisdom-loop')
      ? MentorProfile.find({ status: 'PENDING' })
          .populate('userId', 'fullName email profileImage phone createdAt')
          .sort({ createdAt: 1 })
          .lean()
      : [],
    (!module || module === 'craft-to-cart')
      ? ArtisanProfile.find({ verificationStatus: 'PENDING' })
          .populate('userId', 'fullName email profileImage phone createdAt')
          .sort({ createdAt: 1 })
          .lean()
      : [],
    (!module || module === 'craft-to-cart')
      ? Product.find({ status: 'DRAFT' })
          .populate('artisanId', 'fullName email')
          .sort({ createdAt: 1 })
          .lean()
      : []
  ]);

  return sendResponse(res, 200, 'Verification queue retrieved', {
    totalPending: pendingMentors.length + pendingArtisans.length + draftProducts.length,
    pendingMentors,
    pendingArtisans,
    draftProducts
  });
});

/**
 * @desc Review Wisdom Loop mentor application (Approve / Reject / Suspend)
 * @route PATCH /api/admin/mentors/:id/review
 * @access Private (Admin)
 */
export const reviewMentor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action, reason } = req.body;

  const mentor = await MentorProfile.findById(id).populate('userId', 'fullName email');
  if (!mentor) {
    throw ApiError.notFound('Mentor profile not found.');
  }

  const previousStatus = mentor.status;
  let newStatus = 'PENDING';

  if (action === 'APPROVE') newStatus = 'APPROVED';
  else if (action === 'REJECT') newStatus = 'REJECTED';
  else if (action === 'SUSPEND') newStatus = 'INACTIVE';
  else throw ApiError.badRequest('Invalid moderation action.');

  mentor.status = newStatus;
  await mentor.save();

  // Audit log
  await AdminAuditLog.create({
    adminId: req.user._id,
    action: `MENTOR_${newStatus}`,
    targetType: 'USER',
    targetId: mentor.userId._id,
    details: {
      mentorProfileId: mentor._id,
      previousStatus,
      newStatus,
      reason: reason || 'Application verified'
    },
    ipAddress: req.ip
  });

  // Notify mentor
  await Notification.create({
    userId: mentor.userId._id,
    title: `Wisdom Loop Application: ${newStatus}`,
    message:
      newStatus === 'APPROVED'
        ? 'Congratulations! Your Wisdom Loop mentor profile has been approved. You may now accept learner session requests.'
        : `Your Wisdom Loop mentor application was ${newStatus.toLowerCase()}. Note: ${reason || 'Contact administration for details.'}`,
    type: 'SYSTEM'
  });

  return sendResponse(res, 200, `Mentor profile updated to ${newStatus}`, mentor);
});

/**
 * @desc Review Craft to Cart artisan profile (Verify / Reject)
 * @route PATCH /api/admin/artisans/:id/review
 * @access Private (Admin)
 */
export const reviewArtisan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action, reason } = req.body;

  const artisan = await ArtisanProfile.findById(id).populate('userId', 'fullName email');
  if (!artisan) {
    throw ApiError.notFound('Artisan profile not found.');
  }

  const previousStatus = artisan.verificationStatus;
  let newStatus = 'PENDING';

  if (action === 'APPROVE') newStatus = 'VERIFIED';
  else if (action === 'REJECT') newStatus = 'REJECTED';
  else throw ApiError.badRequest('Invalid artisan moderation action.');

  artisan.verificationStatus = newStatus;
  await artisan.save();

  // Audit log
  await AdminAuditLog.create({
    adminId: req.user._id,
    action: `ARTISAN_${newStatus}`,
    targetType: 'USER',
    targetId: artisan.userId._id,
    details: {
      artisanProfileId: artisan._id,
      previousStatus,
      newStatus,
      reason: reason || 'Artisan heritage verified'
    },
    ipAddress: req.ip
  });

  // Notify artisan
  await Notification.create({
    userId: artisan.userId._id,
    title: `Craft to Cart Verification: ${newStatus}`,
    message:
      newStatus === 'VERIFIED'
        ? 'Your Artisan guild credentials have been verified. You can now publish products to the live marketplace.'
        : `Your Artisan profile review outcome: ${newStatus.toLowerCase()}. Note: ${reason || 'Contact administration for details.'}`,
    type: 'SYSTEM'
  });

  return sendResponse(res, 200, `Artisan verification status set to ${newStatus}`, artisan);
});

/**
 * @desc Moderate Craft to Cart product listing
 * @route PATCH /api/admin/products/:id/review
 * @access Private (Admin)
 */
export const reviewProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action, reason } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw ApiError.notFound('Product not found.');
  }

  const previousStatus = product.status;
  let newStatus = 'ACTIVE';

  if (action === 'APPROVE') newStatus = 'ACTIVE';
  else if (action === 'REJECT') newStatus = 'ARCHIVED';
  else if (action === 'SUSPEND') newStatus = 'ARCHIVED';
  else throw ApiError.badRequest('Invalid product moderation action.');

  product.status = newStatus;
  await product.save();

  // Audit log
  await AdminAuditLog.create({
    adminId: req.user._id,
    action: `PRODUCT_${newStatus}`,
    targetType: 'PRODUCT',
    targetId: product._id,
    details: {
      title: product.title,
      previousStatus,
      newStatus,
      reason: reason || 'Product listing approved'
    },
    ipAddress: req.ip
  });

  // Notify artisan
  await Notification.create({
    userId: product.artisanId,
    title: `Product Moderation: ${product.title}`,
    message:
      newStatus === 'ACTIVE'
        ? `Your product "${product.title}" has been approved and is now live.`
        : `Your product "${product.title}" status changed to ${newStatus}. Reason: ${reason || 'Policy alignment'}`,
    type: 'ORDER'
  });

  return sendResponse(res, 200, `Product status updated to ${newStatus}`, product);
});

/**
 * @desc Moderate listings from ReConnect, Book Bridge, or Second Serve
 * @route PATCH /api/admin/listings/:type/:id/status
 * @access Private (Admin)
 */
export const reviewListing = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const { status, reason } = req.body;

  let model;
  let targetType;

  if (type === 'device') {
    model = DeviceListing;
    targetType = 'DEVICE';
  } else if (type === 'book') {
    model = BookListing;
    targetType = 'BOOK';
  } else if (type === 'food') {
    model = FoodDonation;
    targetType = 'FOOD';
  } else {
    throw ApiError.badRequest('Invalid listing entity type.');
  }

  const listing = await model.findById(id);
  if (!listing) {
    throw ApiError.notFound(`${type} listing not found.`);
  }

  const previousStatus = listing.status;
  listing.status = status;
  await listing.save();

  // Audit log
  await AdminAuditLog.create({
    adminId: req.user._id,
    action: `${targetType}_STATUS_MODIFIED`,
    targetType,
    targetId: listing._id,
    details: {
      previousStatus,
      newStatus: status,
      reason: reason || 'Listing status moderated by admin'
    },
    ipAddress: req.ip
  });

  return sendResponse(res, 200, `${type} listing updated successfully`, listing);
});

export default {
  getPendingVerifications,
  reviewMentor,
  reviewArtisan,
  reviewProduct,
  reviewListing
};
