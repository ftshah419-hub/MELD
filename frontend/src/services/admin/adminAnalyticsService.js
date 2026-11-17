import apiClient from '../api';

/**
 * Admin Analytics Service
 */
export const adminAnalyticsService = {
  /**
   * Get platform analytics aggregations
   */
  async getAnalytics() {
    const res = await apiClient('/admin/analytics');
    return res.data;
  },

  /**
   * Return export URL for CSV download
   */
  getExportUrl(type = 'users') {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${baseUrl}/admin/analytics/export?type=${type}`;
  }
};

export default adminAnalyticsService;
