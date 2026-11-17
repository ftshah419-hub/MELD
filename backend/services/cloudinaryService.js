import { cloudinary, configureCloudinary } from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';

export const cloudinaryService = {
  /**
   * Upload an in-memory buffer to Cloudinary
   * @param {Buffer} buffer - File buffer
   * @param {string} folder - Destination folder (e.g. 'meld/profiles', 'meld/crafts')
   * @returns {Promise<{ url: string, publicId: string }>}
   */
  async uploadImageBuffer(buffer, folder = 'meld/general') {
    configureCloudinary();

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      throw ApiError.internal('Cloudinary service is not configured. Missing API credentials.');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            return reject(new ApiError(500, `Cloudinary upload error: ${error.message}`));
          }
          resolve({
            url: result.secure_url || result.url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format
          });
        }
      );

      uploadStream.end(buffer);
    });
  },

  /**
   * Delete an existing image from Cloudinary by public ID
   * @param {string} publicId - Cloudinary publicId
   */
  async deleteImage(publicId) {
    if (!publicId) return null;
    configureCloudinary();

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new ApiError(500, `Cloudinary deletion error: ${error.message}`);
    }
  }
};

export default cloudinaryService;
