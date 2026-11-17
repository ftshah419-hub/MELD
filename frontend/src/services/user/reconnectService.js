import apiClient from '../api.js';

export const reconnectService = {
  getDevices: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/reconnect/devices${query ? `?${query}` : ''}`);
  },

  getDeviceById: (id) => apiClient(`/reconnect/devices/${id}`),

  createDevice: (deviceData) =>
    apiClient('/reconnect/devices', {
      method: 'POST',
      body: deviceData
    }),

  updateDevice: (id, deviceData) =>
    apiClient(`/reconnect/devices/${id}`, {
      method: 'PUT',
      body: deviceData
    }),

  deleteDevice: (id) =>
    apiClient(`/reconnect/devices/${id}`, {
      method: 'DELETE'
    }),

  getMyListings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/reconnect/my-listings${query ? `?${query}` : ''}`);
  },

  requestDevice: (deviceId, requestData) =>
    apiClient(`/reconnect/devices/${deviceId}/request`, {
      method: 'POST',
      body: requestData
    }),

  getMyRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/reconnect/my-requests${query ? `?${query}` : ''}`);
  },

  getIncomingRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/reconnect/incoming-requests${query ? `?${query}` : ''}`);
  },

  respondToRequest: (requestId, responseData) =>
    apiClient(`/reconnect/requests/${requestId}/respond`, {
      method: 'PATCH',
      body: responseData
    }),

  completeDevice: (id) =>
    apiClient(`/reconnect/devices/${id}/complete`, {
      method: 'PATCH'
    })
};

export default reconnectService;
