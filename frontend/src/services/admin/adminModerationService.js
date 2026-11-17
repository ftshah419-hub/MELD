import apiClient from '../api';

/**
 * Admin Moderation & Verification Service
 */
export const adminModerationService = {
  /**
   * Get pending verification queue
   */
  async getPendingVerifications(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/moderation/queue?${query}`);
    return res.data;
  },

  /**
   * Review Wisdom Loop mentor application (APPROVE / REJECT / SUSPEND)
   */
  async reviewMentor(mentorId, action, reason = '') {
    const res = await apiClient(`/admin/mentors/${mentorId}/review`, {
      method: 'PATCH',
      body: { action, reason }
    });
    return res.data;
  },

  /**
   * Review Craft to Cart artisan application (APPROVE / REJECT)
   */
  async reviewArtisan(artisanId, action, reason = '') {
    const res = await apiClient(`/admin/artisans/${artisanId}/review`, {
      method: 'PATCH',
      body: { action, reason }
    });
    return res.data;
  },

  /**
   * Moderate Craft to Cart product listing
   */
  async reviewProduct(productId, action, reason = '') {
    const res = await apiClient(`/admin/products/${productId}/review`, {
      method: 'PATCH',
      body: { action, reason }
    });
    return res.data;
  },

  /**
   * Moderate listing for devices, books, or food donations
   */
  async reviewListing(type, listingId, status, reason = '') {
    const res = await apiClient(`/admin/listings/${type}/${listingId}/status`, {
      method: 'PATCH',
      body: { status, reason }
    });
    return res.data;
  }
};

export default adminModerationService;
