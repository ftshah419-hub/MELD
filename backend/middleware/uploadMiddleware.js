import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

// Memory storage keeps file in buffer for direct Cloudinary streaming
const storage = multer.memoryStorage();

// File filter restricting to safe image types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest('Invalid file format. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

export const uploadSingleImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter
}).single('image');

export const uploadMultipleImages = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB per file
  },
  fileFilter
}).array('images', 5); // Up to 5 images per request

export default { uploadSingleImage, uploadMultipleImages };
