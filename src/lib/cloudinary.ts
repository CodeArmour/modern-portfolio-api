import { v2 as cloudinary } from 'cloudinary';
import config from '@/config';
import { logger } from './winston';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param file - File buffer or path
 * @param folder - Cloudinary folder name
 * @returns Cloudinary upload result
 */
export const uploadToCloudinary = async (
  file: string,
  folder: string = 'portfolio'
): Promise<any> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    logger.info('Image uploaded to Cloudinary', {
      public_id: result.public_id,
      url: result.secure_url,
    });

    return result;
  } catch (error) {
    logger.error('Error uploading to Cloudinary', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID
 * @returns Deletion result
 */
export const deleteFromCloudinary = async (
  publicId: string
): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    logger.info('Image deleted from Cloudinary', { public_id: publicId });

    return result;
  } catch (error) {
    logger.error('Error deleting from Cloudinary', error);
    throw error;
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of file paths
 * @param folder - Cloudinary folder name
 * @returns Array of upload results
 */
export const uploadMultipleToCloudinary = async (
  files: string[],
  folder: string = 'portfolio'
): Promise<any[]> => {
  try {
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file, folder)
    );

    const results = await Promise.all(uploadPromises);

    logger.info(`${results.length} images uploaded to Cloudinary`);

    return results;
  } catch (error) {
    logger.error('Error uploading multiple images to Cloudinary', error);
    throw error;
  }
};

export default cloudinary;