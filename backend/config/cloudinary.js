import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure Cloudinary SDK v2
 */
export const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    return true;
  }

  return false;
};

// Initial configuration call
configureCloudinary();

export { cloudinary };
export default cloudinary;
