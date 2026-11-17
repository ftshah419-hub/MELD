import { getStoredToken } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Upload service for images across MELD modules
 * Supports Cloudinary server uploads with seamless client-side base64 fallback
 */
export const uploadService = {
  async uploadImage(file, folder = 'meld/general') {
    if (!file) return null;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const token = getStoredToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/uploads`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData
      });

      const data = await response.json();
      if (response.ok && (data?.data?.url || data?.url)) {
        return data.data?.url || data.url;
      }
    } catch (err) {
      console.warn('Remote upload failed, using local data URL fallback:', err);
    }

    // Local data URL fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }
};

export default uploadService;
