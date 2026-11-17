import apiClient from '../api.js';

export const bookBridgeService = {
  getBooks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/book-bridge/books${query ? `?${query}` : ''}`);
  },

  getBookById: (id) => apiClient(`/book-bridge/books/${id}`),

  createBook: (bookData) =>
    apiClient('/book-bridge/books', {
      method: 'POST',
      body: bookData
    }),

  updateBook: (id, bookData) =>
    apiClient(`/book-bridge/books/${id}`, {
      method: 'PUT',
      body: bookData
    }),

  deleteBook: (id) =>
    apiClient(`/book-bridge/books/${id}`, {
      method: 'DELETE'
    }),

  getMyListings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/book-bridge/my-listings${query ? `?${query}` : ''}`);
  },

  requestBook: (bookId, requestData) =>
    apiClient(`/book-bridge/books/${bookId}/request`, {
      method: 'POST',
      body: requestData
    }),

  getMyRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/book-bridge/my-requests${query ? `?${query}` : ''}`);
  },

  getIncomingRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/book-bridge/incoming-requests${query ? `?${query}` : ''}`);
  },

  respondToRequest: (requestId, responseData) =>
    apiClient(`/book-bridge/requests/${requestId}/respond`, {
      method: 'PATCH',
      body: responseData
    }),

  completeBook: (id) =>
    apiClient(`/book-bridge/books/${id}/complete`, {
      method: 'PATCH'
    })
};

export default bookBridgeService;
