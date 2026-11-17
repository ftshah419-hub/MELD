import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { uploadSingleImage, uploadMultipleImages } from '../middleware/uploadMiddleware.js';
import { cloudinaryService } from '../services/cloudinaryService.js';
import { sendResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

/**
 * @route   POST /api/uploads
 * @desc    Upload a single image to Cloudinary
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  uploadSingleImage,
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw ApiError.badRequest('Please upload an image file using the "image" field.');
    }

    const folder = req.body.folder || 'meld/general';
    const uploadResult = await cloudinaryService.uploadImageBuffer(req.file.buffer, folder);

    return sendResponse(res, 201, 'Image uploaded successfully to Cloudinary', uploadResult);
  })
);

/**
 * @route   POST /api/uploads/multiple
 * @desc    Upload multiple images to Cloudinary (up to 5)
 * @access  Private
 */
router.post(
  '/multiple',
  authenticate,
  uploadMultipleImages,
  asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw ApiError.badRequest('Please upload at least one image file using the "images" field.');
    }

    const folder = req.body.folder || 'meld/general';
    const uploadPromises = req.files.map((file) =>
      cloudinaryService.uploadImageBuffer(file.buffer, folder)
    );

    const results = await Promise.all(uploadPromises);

    return sendResponse(res, 201, 'Images uploaded successfully to Cloudinary', {
      images: results
    });
  })
);

/**
 * @route   DELETE /api/uploads/:publicId
 * @desc    Delete an image from Cloudinary
 * @access  Private
 */
router.delete(
  '/:publicId',
  authenticate,
  asyncHandler(async (req, res) => {
    const publicId = req.params.publicId || req.query.publicId || req.body.publicId;
    if (!publicId) {
      throw ApiError.badRequest('Public ID is required for image deletion.');
    }

    await cloudinaryService.deleteImage(publicId);

    return sendResponse(res, 200, 'Image deleted successfully from Cloudinary');
  })
);

export default router;
