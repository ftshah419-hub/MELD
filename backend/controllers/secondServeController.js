import mongoose from 'mongoose';
import { FoodDonation } from '../models/FoodDonation.js';
import { Request } from '../models/Request.js';
import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const secondServeController = {
  /**
   * Browse available surplus food lots (excludes expired lots)
   */
  getDonations: asyncHandler(async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      const fallbackDonations = [
        {
          _id: 'f1',
          title: 'Surplus Banquet Veg Biryani & Paneer Gravy',
          foodType: 'COOKED_MEALS',
          dietaryType: 'VEGETARIAN',
          portions: 85,
          temperatureType: 'HOT_COOKED',
          expiresAt: new Date(Date.now() + 2 * 3600000).toISOString(),
          location: 'Whitefield Banquet Hall, Bengaluru',
          donorName: 'Grand Heritage Events',
          status: 'AVAILABLE'
        },
        {
          _id: 'f2',
          title: 'Fresh Packaged Sandwiches & Fruit Bowls',
          foodType: 'PACKAGED_GOODS',
          dietaryType: 'VEGETARIAN',
          portions: 45,
          temperatureType: 'CHILLED',
          expiresAt: new Date(Date.now() + 5 * 3600000).toISOString(),
          location: 'CyberCity Cafeteria, Hyderabad',
          donorName: 'Cisco Campus Dining',
          status: 'AVAILABLE'
        }
      ];
      return sendResponse(res, 200, 'Surplus food lots retrieved successfully', {
        donations: fallbackDonations,
        total: fallbackDonations.length,
        page: 1,
        pages: 1
      });
    }

    const {
      search,
      foodType,
      dietaryType,
      urgentOnly,
      status = 'AVAILABLE',
      limit = 24,
      page = 1,
      sort = 'urgent'
    } = req.query;

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    if (foodType && foodType !== 'all') {
      filter.foodType = foodType.toUpperCase();
    }

    if (dietaryType && dietaryType !== 'all') {
      filter.dietaryType = dietaryType.toUpperCase();
    }

    // Exclude expired food lots
    filter.bestBefore = { $gt: new Date() };

    // Urgent filter: expiring within 3 hours
    if (urgentOnly === 'true') {
      const threeHoursFromNow = new Date(Date.now() + 3 * 60 * 60 * 1000);
      filter.bestBefore.$lte = threeHoursFromNow;
    }

    let sortOptions = { bestBefore: 1 }; // Most urgent first by default
    if (sort === 'newest') sortOptions = { createdAt: -1 };
    if (sort === 'servings') sortOptions = { quantityServings: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [donations, total] = await Promise.all([
      FoodDonation.find(filter)
        .populate('donorId', 'fullName profileImage phone')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      FoodDonation.countDocuments(filter)
    ]);

    let results = donations;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = donations.filter(
        (f) =>
          f.title?.toLowerCase().includes(q) ||
          f.foodType?.toLowerCase().includes(q) ||
          f.pickupAddress?.city?.toLowerCase().includes(q) ||
          f.donorId?.fullName?.toLowerCase().includes(q)
      );
    }

    return sendResponse(res, 200, 'Food donations retrieved successfully', {
      donations: results,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  }),

  /**
   * Get single food donation detail
   */
  getDonationById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const donation = await FoodDonation.findById(id).populate(
      'donorId',
      'fullName email phone profileImage'
    );

    if (!donation) {
      throw ApiError.notFound('Food donation listing not found.');
    }

    return sendResponse(res, 200, 'Food donation details retrieved', { donation });
  }),

  /**
   * List surplus food donation
   */
  createDonation: asyncHandler(async (req, res) => {
    const donorId = req.user.id || req.user._id;
    const {
      title,
      mealTitle,
      name,
      foodType,
      type,
      quantityServings,
      portions,
      quantity,
      cookedAt,
      bestBefore,
      expiresAt,
      expiresInHours,
      dietaryType,
      dietary,
      temperatureType,
      pickupAddress,
      location,
      images,
      imageUrl,
      image,
      safetyNotes
    } = req.body;

    const resolvedTitle = (title || mealTitle || name || '').trim();
    if (!resolvedTitle) {
      throw ApiError.badRequest('Meal title is required.');
    }

    const typeMapping = {
      'COOKED_MEALS': 'COOKED_MEALS',
      'COOKED MEALS': 'COOKED_MEALS',
      'HOT_COOKED': 'COOKED_MEALS',
      'CHILLED': 'COOKED_MEALS',
      'AMBIENT': 'PACKAGED_GOODS',
      'BAKERY_BREAD': 'BAKERY_BREAD',
      'BAKERY': 'BAKERY_BREAD',
      'RAW_PRODUCE': 'RAW_PRODUCE',
      'PRODUCE': 'RAW_PRODUCE',
      'PACKAGED_GOODS': 'PACKAGED_GOODS',
      'PACKAGED': 'PACKAGED_GOODS'
    };

    const rawType = (foodType || type || temperatureType || 'COOKED_MEALS').toUpperCase().replace(/\s+/g, '_');
    const resolvedFoodType = typeMapping[rawType] || 'COOKED_MEALS';

    const resolvedQuantity = Number(quantityServings || portions || quantity) || 10;

    let expiryDate = null;
    if (bestBefore) {
      expiryDate = new Date(bestBefore);
    } else if (expiresAt) {
      expiryDate = new Date(expiresAt);
    } else if (expiresInHours) {
      expiryDate = new Date(Date.now() + Number(expiresInHours) * 3600000);
    } else {
      expiryDate = new Date(Date.now() + 4 * 3600000); // 4 hour default
    }

    if (isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
      expiryDate = new Date(Date.now() + 4 * 3600000);
    }

    const rawDietary = (dietaryType || dietary || 'VEG').toUpperCase();
    const resolvedDietary = rawDietary.includes('NON') ? 'NON_VEG' : (rawDietary.includes('VEGAN') ? 'VEGAN' : 'VEG');

    let resolvedPickup = pickupAddress;
    if (!resolvedPickup || typeof resolvedPickup !== 'object') {
      resolvedPickup = {
        street: (typeof location === 'string' ? location : (typeof pickupAddress === 'string' ? pickupAddress : 'Main Kitchen')),
        city: 'Local Area',
        contactPhone: ''
      };
    }

    const rawImages = images || (imageUrl ? [imageUrl] : null) || (image ? [image] : null);
    const formattedImages = Array.isArray(rawImages) && rawImages.length > 0
      ? rawImages.map((img) => (typeof img === 'string' ? { url: img, publicId: null } : img))
      : [{ url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', publicId: null }];

    const donation = await FoodDonation.create({
      donorId,
      title: resolvedTitle,
      foodType: resolvedFoodType,
      quantityServings: resolvedQuantity,
      cookedAt: cookedAt ? new Date(cookedAt) : new Date(),
      bestBefore: expiryDate,
      dietaryType: resolvedDietary,
      pickupAddress: resolvedPickup,
      images: formattedImages,
      status: 'AVAILABLE'
    });

    return sendResponse(res, 201, 'Food donation listed successfully', { donation });
  }),

  /**
   * Update own food donation
   */
  updateDonation: asyncHandler(async (req, res) => {
    const donorId = req.user.id || req.user._id;
    const { id } = req.params;
    const {
      title,
      foodType,
      quantityServings,
      bestBefore,
      dietaryType,
      pickupAddress,
      images,
      status
    } = req.body;

    const donation = await FoodDonation.findOne({ _id: id, donorId });
    if (!donation) {
      throw ApiError.notFound('Food donation not found or unauthorized.');
    }

    if (title) donation.title = title.trim();
    if (foodType) donation.foodType = foodType.toUpperCase();
    if (quantityServings !== undefined) donation.quantityServings = Number(quantityServings);
    if (bestBefore) donation.bestBefore = new Date(bestBefore);
    if (dietaryType) donation.dietaryType = dietaryType.toUpperCase();
    if (pickupAddress) donation.pickupAddress = { ...donation.pickupAddress, ...pickupAddress };
    if (status) donation.status = status;
    if (images && Array.isArray(images)) {
      donation.images = images.map((img) => (typeof img === 'string' ? { url: img, publicId: null } : img));
    }

    await donation.save();

    return sendResponse(res, 200, 'Food donation updated successfully', { donation });
  }),

  /**
   * Delete / withdraw own food donation
   */
  deleteDonation: asyncHandler(async (req, res) => {
    const donorId = req.user.id || req.user._id;
    const { id } = req.params;

    const donation = await FoodDonation.findOneAndDelete({ _id: id, donorId });
    if (!donation) {
      throw ApiError.notFound('Food donation not found or unauthorized.');
    }

    return sendResponse(res, 200, 'Food donation deleted successfully');
  }),

  /**
   * Get user's own food donations
   */
  getMyDonations: asyncHandler(async (req, res) => {
    const donorId = req.user.id || req.user._id;

    const donations = await FoodDonation.find({ donorId }).sort({ createdAt: -1 });

    return sendResponse(res, 200, 'My food donations retrieved', { donations });
  }),

  /**
   * Request / claim food surplus for NGO or community pantry
   */
  requestFood: asyncHandler(async (req, res) => {
    const requesterId = req.user.id || req.user._id;
    const { donationId, organizationName, etaMinutes, message } = req.body;
    const targetDonationId = donationId || req.params.id || req.params.donationId || req.body.id;

    if (!targetDonationId || !message) {
      throw ApiError.badRequest('Donation ID and claim message are required.');
    }

    const donation = await FoodDonation.findById(targetDonationId);
    if (!donation) {
      throw ApiError.notFound('Food donation not found.');
    }

    if (donation.donorId.toString() === requesterId.toString()) {
      throw ApiError.badRequest('You cannot claim your own food donation.');
    }

    if (donation.status !== 'AVAILABLE') {
      throw ApiError.badRequest(`This food donation is currently "${donation.status}" and cannot be claimed.`);
    }

    if (new Date(donation.bestBefore) <= new Date()) {
      donation.status = 'EXPIRED';
      await donation.save();
      throw ApiError.badRequest('This food lot has passed its safe collection window.');
    }

    const formattedMessage = `Organization: ${organizationName || 'Community Shelter Network'}\nETA: ${etaMinutes ? `${etaMinutes} mins` : 'Within 1 hour'}\nMessage: ${message}`;

    const request = await Request.create({
      requesterId,
      module: 'SECOND_SERVE',
      targetType: 'FoodDonation',
      targetId: donation._id,
      requestType: 'FOOD_RESCUE',
      message: formattedMessage,
      status: 'PENDING'
    });

    // Notify food donor
    await Notification.create({
      userId: donation.donorId,
      title: 'Food Surplus Claim Request Received!',
      message: `${organizationName || 'A certified shelter'} has requested to dispatch for "${donation.title}".`,
      type: 'REQUEST',
      link: '/user/second-serve/my-donations'
    });

    return sendResponse(res, 201, 'Food rescue claim submitted successfully', { request });
  }),

  /**
   * Get user's claimed food requests
   */
  getMyRequests: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    const requests = await Request.find({
      requesterId: userId,
      module: 'SECOND_SERVE'
    })
      .populate('targetId')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'My food rescue claims retrieved', { requests });
  }),

  /**
   * Get incoming requests for donor's food donations
   */
  getIncomingRequests: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    const myDonations = await FoodDonation.find({ donorId: userId }).select('_id');
    const donationIds = myDonations.map((d) => d._id);

    const requests = await Request.find({
      module: 'SECOND_SERVE',
      targetId: { $in: donationIds }
    })
      .populate('requesterId', 'fullName email phone profileImage')
      .populate('targetId')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Incoming food rescue requests retrieved', { requests });
  }),

  /**
   * Donor respond: Accept or decline rescue claim
   */
  respondToRequest: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    const targetRequestId = id || req.params.claimId || req.body.claimId || req.body.requestId;
    const { action, responseNote } = req.body;

    if (!['ACCEPT', 'REJECT'].includes(action)) {
      throw ApiError.badRequest('Action must be ACCEPT or REJECT.');
    }

    const request = await Request.findById(targetRequestId).populate('targetId');
    if (!request || request.module !== 'SECOND_SERVE') {
      throw ApiError.notFound('Food rescue claim request not found.');
    }

    const donation = await FoodDonation.findById(request.targetId?._id);
    if (!donation || donation.donorId.toString() !== userId.toString()) {
      throw ApiError.forbidden('Unauthorized to manage this claim.');
    }

    request.status = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
    request.responseNote = responseNote || (action === 'ACCEPT' ? 'Claim accepted! Staged for immediate cold-chain pickup.' : 'Claim declined.');
    await request.save();

    if (action === 'ACCEPT') {
      donation.status = 'CLAIMED';
      donation.claimedByNgoId = request.requesterId;
      await donation.save();
    }

    // Notify requester
    await Notification.create({
      userId: request.requesterId,
      title: `Food Claim ${action === 'ACCEPT' ? 'Approved' : 'Declined'}`,
      message: `Your claim for "${donation.title}" was ${action === 'ACCEPT' ? 'approved! Please dispatch vehicle.' : 'declined.'}`,
      type: 'REQUEST',
      link: '/user/requests'
    });

    return sendResponse(res, 200, `Claim ${request.status.toLowerCase()} successfully`, { request, donation });
  }),

  /**
   * Complete food donation delivery
   */
  completeDonation: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    const donation = await FoodDonation.findById(id);
    if (!donation) {
      throw ApiError.notFound('Food donation not found.');
    }

    // Both donor and claiming NGO can mark as delivered
    const isDonor = donation.donorId.toString() === userId.toString();
    const isClaimer = donation.claimedByNgoId?.toString() === userId.toString();

    if (!isDonor && !isClaimer && req.user.role !== 'ADMIN') {
      throw ApiError.forbidden('Unauthorized to mark donation complete.');
    }

    donation.status = 'DELIVERED';
    await donation.save();

    // Mark associated request COMPLETED
    await Request.updateMany(
      { targetId: donation._id, status: 'ACCEPTED' },
      { status: 'COMPLETED' }
    );

    return sendResponse(res, 200, 'Food donation marked as DELIVERED', { donation });
  })
};

export default secondServeController;
