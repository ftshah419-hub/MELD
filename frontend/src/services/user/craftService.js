import apiClient from '../api.js';

export const craftService = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/craft/products${query ? `?${query}` : ''}`);
  },

  getProductById: (id) => apiClient(`/craft/products/${id}`),

  createOrder: (orderData) =>
    apiClient('/craft/orders', {
      method: 'POST',
      body: orderData
    }),

  verifyOrderPayment: (paymentData) =>
    apiClient('/craft/orders/verify', {
      method: 'POST',
      body: paymentData
    }),

  getArtisanProfile: () => apiClient('/craft/artisan-profile'),

  saveArtisanProfile: (profileData) =>
    apiClient('/craft/artisan-profile', {
      method: 'POST',
      body: profileData
    }),

  getArtisanProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/craft/my-products${query ? `?${query}` : ''}`);
  },

  createProduct: (productData) =>
    apiClient('/craft/products', {
      method: 'POST',
      body: productData
    }),

  updateProduct: (productId, productData) =>
    apiClient(`/craft/products/${productId}`, {
      method: 'PUT',
      body: productData
    }),

  deleteProduct: (productId) =>
    apiClient(`/craft/products/${productId}`, {
      method: 'DELETE'
    }),

  getArtisanOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/craft/artisan-orders${query ? `?${query}` : ''}`);
  },

  updateOrderStatus: (orderId, statusData) =>
    apiClient(`/craft/artisan-orders/${orderId}/status`, {
      method: 'PATCH',
      body: statusData
    })
};

export default craftService;
