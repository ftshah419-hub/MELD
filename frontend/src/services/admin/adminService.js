import apiClient from '../api';

/**
 * Admin Dashboard & System Settings Service
 */
export const adminService = {
  /**
   * Fetch complete executive dashboard telemetry
   */
  async getDashboardOverview() {
    const res = await apiClient('/admin/dashboard');
    return res.data;
  },

  /**
   * Get platform governance configuration
   */
  async getSettings() {
    const res = await apiClient('/admin/settings');
    return res.data;
  },

  /**
   * Update platform governance settings
   */
  async updateSettings(settings) {
    const res = await apiClient('/admin/settings', {
      method: 'PUT',
      body: settings
    });
    return res.data;
  },

  /**
   * Get immutable audit logs with optional filters
   */
  async getAuditLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/audit-logs?${query}`);
    return res.data;
  },

  /**
   * Get admin alerts and notifications
   */
  async getNotifications(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/notifications?${query}`);
    return res.data;
  },

  /**
   * Mark an admin notification as read
   */
  async markNotificationRead(id) {
    const res = await apiClient(`/admin/notifications/${id}/read`, {
      method: 'PATCH'
    });
    return res.data;
  },

  /**
   * Broadcast platform-wide system announcement
   */
  async broadcastAnnouncement(data) {
    const res = await apiClient('/admin/notifications/broadcast', {
      method: 'POST',
      body: data
    });
    return res.data;
  },

  /**
   * Fetch polymorphic requests
   */
  async getRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/requests?${query}`);
    return res.data;
  },

  /**
   * Fetch module-specific administrative datasets
   */
  async getWisdomLoopData(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/wisdom-loop?${query}`);
    return res.data;
  },

  async getCraftToCartData(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/craft-to-cart?${query}`);
    return res.data;
  },

  async getReConnectData(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/reconnect?${query}`);
    return res.data;
  },

  async getBookBridgeData(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/book-bridge?${query}`);
    return res.data;
  },

  async getSecondServeData(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/second-serve?${query}`);
    return res.data;
  }
};

export default adminService;
