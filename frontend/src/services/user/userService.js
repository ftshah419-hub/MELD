import apiClient from '../api.js';

export const userService = {
  getProfile: () => apiClient('/user/profile'),

  updateProfile: (profileData) =>
    apiClient('/user/profile', {
      method: 'PUT',
      body: profileData
    }),

  getDashboardSummary: () => apiClient('/user/dashboard-summary'),

  getMyRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/user/my-requests${query ? `?${query}` : ''}`);
  },

  cancelRequest: (requestId) =>
    apiClient(`/user/my-requests/${requestId}/cancel`, {
      method: 'PATCH'
    }),

  getMyOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/user/my-orders${query ? `?${query}` : ''}`);
  },

  cancelOrder: (orderId) =>
    apiClient(`/user/my-orders/${orderId}/cancel`, {
      method: 'PATCH'
    }),

  getMyContributions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/user/my-contributions${query ? `?${query}` : ''}`);
  },

  createContribution: (contributionData) =>
    apiClient('/user/contributions', {
      method: 'POST',
      body: contributionData
    }),

  verifyContribution: (paymentData) =>
    apiClient('/user/contributions/verify', {
      method: 'POST',
      body: paymentData
    }),

  getNotifications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/user/notifications${query ? `?${query}` : ''}`);
  },

  markNotificationRead: (notificationId) => {
    if (notificationId === 'all' || !notificationId) {
      return apiClient('/user/notifications/all/read', { method: 'PATCH' });
    }
    return apiClient(`/user/notifications/${notificationId}/read`, {
      method: 'PATCH'
    });
  },

  markAllNotificationsRead: () =>
    apiClient('/user/notifications/all/read', {
      method: 'PATCH'
    })
};

export default userService;
