import apiClient from '../api';

/**
 * Admin Payments & Voluntary Contributions Service
 */
export const adminPaymentService = {
  /**
   * Get consolidated transaction ledger
   */
  async getPayments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/payments?${query}`);
    return res.data;
  },

  /**
   * Get single payment detail
   */
  async getPaymentDetails(id) {
    const res = await apiClient(`/admin/payments/${id}`);
    return res.data;
  },

  /**
   * Get voluntary contributions overview and breakdown
   */
  async getContributions(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/contributions?${query}`);
    return res.data;
  },

  /**
   * Get Craft to Cart orders
   */
  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/orders?${query}`);
    return res.data;
  }
};

export default adminPaymentService;
