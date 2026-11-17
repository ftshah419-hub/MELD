import mongoose from 'mongoose';
import { DeviceListing } from '../models/DeviceListing.js';
import { Request } from '../models/Request.js';
import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const reconnectController = {
  /**
   * Browse available electronics listings
   */
  getDevices: asyncHandler(async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      const fallbackDevices = [
        {
          _id: 'd1',
          title: 'Lenovo ThinkPad T480 (Core i5 / 8GB RAM)',
          deviceType: 'LAPTOP',
          brand: 'Lenovo',
          model: 'ThinkPad T480',
          condition: 'WORKING',
          specs: 'Intel Core i5 8th Gen, 8GB DDR4, 256GB SSD',
          location: 'Koramangala, Bengaluru',
          donorName: 'Rahul Verma',
          status: 'AVAILABLE'
        },
        {
          _id: 'd2',
          title: 'iPad 7th Gen (32GB WiFi)',
          deviceType: 'TABLET',
          brand: 'Apple',
          model: 'iPad 10.2"',
          condition: 'WORKING',
          specs: 'Fully functional, minor cosmetic scratch.',
          location: 'Pune, Maharashtra',
          donorName: 'Dr. Meenakshi',
          status: 'AVAILABLE'
        }
      ];
      return sendResponse(res, 200, 'Devices retrieved successfully', {
        devices: fallbackDevices,
        total: fallbackDevices.length,
        page: 1,
        pages: 1
      });
    }

    const {
      search,
      deviceType,
      condition,
      status = 'AVAILABLE',
      limit = 20,
      page = 1,
      sort = 'newest'
    } = req.query;

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (deviceType && deviceType !== 'all') {
      filter.deviceType = deviceType.toUpperCase();
    }
    if (condition && condition !== 'all') {
      filter.condition = condition.toUpperCase();
    }

    const sortOptions = sort === 'newest' ? { createdAt: -1 } : { title: 1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [devices, total] = await Promise.all([
      DeviceListing.find(filter)
        .populate('donorId', 'fullName profileImage')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      DeviceListing.countDocuments(filter)
    ]);

    let results = devices;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = devices.filter(
        (d) =>
          d.title?.toLowerCase().includes(q) ||
          d.brand?.toLowerCase().includes(q) ||
          d.modelName?.toLowerCase().includes(q) ||
          d.specifications?.processor?.toLowerCase().includes(q) ||
          d.specifications?.ram?.toLowerCase().includes(q)
      );
    }

    return sendResponse(res, 200, 'Devices retrieved successfully', {
      devices: results,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  }),

  /**
   * Get single device details
   */
  getDeviceById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const device = await DeviceListing.findById(id).populate(
      'donorId',
      'fullName email profileImage'
    );

    if (!device) {
      throw ApiError.notFound('Device listing not found.');
    }

    return sendResponse(res, 200, 'Device details retrieved', { device });
  }),

  /**
   * List a device for repair, reuse, learning, or recycling
   */
  createDevice: asyncHandler(async (req, res) => {
    const donorId = req.user.id || req.user._id;
    const { title, deviceType, brand, modelName, condition, specifications, images } = req.body;

    if (!title || !deviceType || !condition) {
      throw ApiError.badRequest('Title, device type, and condition are required.');
    }

    const validTypes = ['LAPTOP', 'TABLET', 'SMARTPHONE', 'DESKTOP', 'PERIPHERAL', 'OTHER'];
    if (!validTypes.includes(deviceType.toUpperCase())) {
      throw ApiError.badRequest(`Invalid deviceType. Allowed: ${validTypes.join(', ')}`);
    }

    const validConditions = ['WORKING', 'NEEDS_REPAIR', 'PARTS_ONLY'];
    if (!validConditions.includes(condition.toUpperCase())) {
      throw ApiError.badRequest(`Invalid condition. Allowed: ${validConditions.join(', ')}`);
    }

    const rawImages = images || (req.body.imageUrl ? [req.body.imageUrl] : null) || (req.body.image ? [req.body.image] : null);
    const formattedImages = Array.isArray(rawImages) && rawImages.length > 0
      ? rawImages.map((img) => (typeof img === 'string' ? { url: img, publicId: null } : img))
      : [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80', publicId: null }];

    const device = await DeviceListing.create({
      donorId,
      title: title.trim(),
      deviceType: deviceType.toUpperCase(),
      brand: brand ? brand.trim() : '',
      modelName: modelName ? modelName.trim() : '',
      condition: condition.toUpperCase(),
      specifications: specifications || {},
      images: formattedImages,
      status: 'AVAILABLE'
    });

    return sendResponse(res, 201, 'Device listed successfully for circular exchange', { device });
  }),

  /**
   * Update own device listing
   */
  updateDevice: asyncHandler(async (req, res) => {
    const donorId = req.user.id || req.user._id;
    const { id } = req.params;
    const { title, deviceType, brand, modelName, condition, specifications, images, status } = req.body;

    const device = await DeviceListing.findOne({ _id: id, donorId });
    if (!device) {
      throw ApiError.notFound('Device listing not found or unauthorized.');
    }

    if (title) device.title = title.trim();
    if (deviceType) device.deviceType = deviceType.toUpperCase();
    if (brand !== undefined) device.brand = brand.trim();
    if (modelName !== undefined) device.modelName = modelName.trim();
    if (condition) device.condition = condition.toUpperCase();
    if (specifications) device.specifications = { ...device.specifications, ...specifications };
    if (status) device.status = status;
    if (images && Array.isArray(images)) {
      device.images = images.map((img) => (typeof img === 'string' ? { url: img, publicId: null } : img));
    }

    await device.save();

    return sendResponse(res, 200, 'Device listing updated successfully', { device });
  }),

  /**
   * Delete own device listing
   */
  deleteDevice: asyncHandler(async (req, res) => {
    const donorId = req.user.id || req.user._id;
    const { id } = req.params;

    const device = await DeviceListing.findOneAndDelete({ _id: id, donorId });
    if (!device) {
      throw ApiError.notFound('Device listing not found or unauthorized.');
    }

    return sendResponse(res, 200, 'Device listing deleted successfully');
  }),

  /**
   * Get user's own listed devices
   */
  getMyListings: asyncHandler(async (req, res) => {
    const donorId = req.user.id || req.user._id;

    const listings = await DeviceListing.find({ donorId }).sort({ createdAt: -1 });

    return sendResponse(res, 200, 'My device listings retrieved', { listings });
  }),

  /**
   * Request a device (for learning, repair, or recycling)
   */
  requestDevice: asyncHandler(async (req, res) => {
    const requesterId = req.user.id || req.user._id;
    const { deviceId, purpose, message } = req.body;
    const targetDeviceId = deviceId || req.params.deviceId || req.params.id;

    if (!targetDeviceId || !message) {
      throw ApiError.badRequest('Device ID and intended purpose description are required.');
    }

    const device = await DeviceListing.findById(targetDeviceId);
    if (!device) {
      throw ApiError.notFound('Device listing not found.');
    }

    if (device.donorId.toString() === requesterId.toString()) {
      throw ApiError.badRequest('You cannot request your own listed device.');
    }

    if (device.status !== 'AVAILABLE') {
      throw ApiError.badRequest(`This device is currently "${device.status}" and cannot be requested.`);
    }

    const formattedMessage = `Purpose: ${purpose || 'Education / Learning'}\nMessage: ${message}`;

    const request = await Request.create({
      requesterId,
      module: 'RECONNECT',
      targetType: 'DeviceListing',
      targetId: device._id,
      requestType: 'DEVICE_CLAIM',
      message: formattedMessage,
      status: 'PENDING'
    });

    // Notify donor
    await Notification.create({
      userId: device.donorId,
      title: 'New Device Request Received',
      message: `Someone requested your device "${device.title}" for ${purpose || 'learning'}.`,
      type: 'REQUEST',
      link: '/user/reconnect/my-listings'
    });

    return sendResponse(res, 201, 'Device request submitted successfully', { request });
  }),

  /**
   * Get user's device requests
   */
  getMyRequests: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    const requests = await Request.find({
      requesterId: userId,
      module: 'RECONNECT'
    })
      .populate('targetId')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'My device requests retrieved', { requests });
  }),

  /**
   * Get incoming requests on donor's devices
   */
  getIncomingRequests: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    const myDevices = await DeviceListing.find({ donorId: userId }).select('_id');
    const deviceIds = myDevices.map((d) => d._id);

    const requests = await Request.find({
      module: 'RECONNECT',
      targetId: { $in: deviceIds }
    })
      .populate('requesterId', 'fullName email profileImage')
      .populate('targetId')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Incoming device requests retrieved', { requests });
  }),

  /**
   * Donor respond: Accept or decline request
   */
  respondToRequest: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    const { action, responseNote } = req.body;

    if (!['ACCEPT', 'REJECT'].includes(action)) {
      throw ApiError.badRequest('Action must be ACCEPT or REJECT.');
    }

    const request = await Request.findById(id).populate('targetId');
    if (!request || request.module !== 'RECONNECT') {
      throw ApiError.notFound('Device request not found.');
    }

    const device = await DeviceListing.findById(request.targetId?._id);
    if (!device || device.donorId.toString() !== userId.toString()) {
      throw ApiError.forbidden('Unauthorized to manage this request.');
    }

    request.status = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
    request.responseNote = responseNote || (action === 'ACCEPT' ? 'Request accepted! Handover arrangements initiated.' : 'Request declined.');
    await request.save();

    if (action === 'ACCEPT') {
      device.status = device.condition === 'NEEDS_REPAIR' ? 'UNDER_REPAIR' : 'MATCHED';
      device.recipientId = request.requesterId;
      await device.save();
    }

    // Notify requester
    await Notification.create({
      userId: request.requesterId,
      title: `Device Request ${action === 'ACCEPT' ? 'Accepted' : 'Declined'}`,
      message: `Your request for "${device.title}" was ${action === 'ACCEPT' ? 'accepted! Check handover instructions.' : 'declined.'}`,
      type: 'REQUEST',
      link: '/user/requests'
    });

    return sendResponse(res, 200, `Request ${request.status.toLowerCase()} successfully`, { request, device });
  }),

  /**
   * Complete device lifecycle (mark REHOMED or RECYCLED)
   */
  completeDevice: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['REHOMED', 'RECYCLED'];
    if (!allowed.includes(status)) {
      throw ApiError.badRequest('Status must be REHOMED or RECYCLED.');
    }

    const device = await DeviceListing.findOne({ _id: id, donorId: userId });
    if (!device) {
      throw ApiError.notFound('Device listing not found or unauthorized.');
    }

    device.status = status;
    await device.save();

    // Mark associated request as COMPLETED
    await Request.updateMany(
      { targetId: device._id, status: 'ACCEPTED' },
      { status: 'COMPLETED' }
    );

    return sendResponse(res, 200, `Device marked as ${status}`, { device });
  })
};

export default reconnectController;
