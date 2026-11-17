import apiClient from '../api.js';

export const secondServeService = {
  getDonations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/second-serve/donations${query ? `?${query}` : ''}`);
  },

  getDonationById: (id) => apiClient(`/second-serve/donations/${id}`),

  createDonation: (donationData) =>
    apiClient('/second-serve/donations', {
      method: 'POST',
      body: donationData
    }),

  updateDonation: (id, donationData) =>
    apiClient(`/second-serve/donations/${id}`, {
      method: 'PUT',
      body: donationData
    }),

  deleteDonation: (id) =>
    apiClient(`/second-serve/donations/${id}`, {
      method: 'DELETE'
    }),

  getMyDonations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/second-serve/my-donations${query ? `?${query}` : ''}`);
  },

  claimDonation: (donationId, claimData) =>
    apiClient(`/second-serve/donations/${donationId}/claim`, {
      method: 'POST',
      body: claimData
    }),

  getMyClaims: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/second-serve/my-claims${query ? `?${query}` : ''}`);
  },

  getIncomingClaims: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/second-serve/incoming-claims${query ? `?${query}` : ''}`);
  },

  respondToClaim: (claimId, responseData) =>
    apiClient(`/second-serve/claims/${claimId}/respond`, {
      method: 'PATCH',
      body: responseData
    }),

  completeDonation: (id) =>
    apiClient(`/second-serve/donations/${id}/complete`, {
      method: 'PATCH'
    })
};

export default secondServeService;
