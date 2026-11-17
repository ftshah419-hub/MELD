import apiClient from '../api';

/**
 * Admin User Management Service
 */
export const adminUserService = {
  /**
   * Get paginated users with search and filters
   */
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/users?${query}`);
    return res.data;
  },

  /**
   * Get single user full details and activity history
   */
  async getUserDetails(id) {
    const res = await apiClient(`/admin/users/${id}`);
    return res.data;
  },

  /**
   * Update user account status (ACTIVE, SUSPENDED, INACTIVE)
   */
  async updateUserStatus(id, status, reason = '') {
    const res = await apiClient(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: { status, reason }
    });
    return res.data;
  }
};

export default adminUserService;
