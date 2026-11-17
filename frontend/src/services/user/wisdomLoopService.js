import apiClient from '../api.js';

export const wisdomLoopService = {
  getMentors: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/wisdom-loop/mentors${query ? `?${query}` : ''}`);
  },

  getMentorById: (id) => apiClient(`/wisdom-loop/mentors/${id}`),

  requestSession: (sessionData) =>
    apiClient('/wisdom-loop/requests', {
      method: 'POST',
      body: sessionData
    }),

  getMySessions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/wisdom-loop/my-sessions${query ? `?${query}` : ''}`);
  },

  submitFeedback: (sessionId, feedbackData) =>
    apiClient(`/wisdom-loop/my-sessions/${sessionId}/feedback`, {
      method: 'POST',
      body: feedbackData
    }),

  becomeMentor: (applicationData) =>
    apiClient('/wisdom-loop/become-mentor', {
      method: 'POST',
      body: applicationData
    }),

  getMyMentorProfile: () => apiClient('/wisdom-loop/my-mentor-profile'),

  getIncomingRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/wisdom-loop/incoming-requests${query ? `?${query}` : ''}`);
  },

  respondToSessionRequest: (requestId, responseData) =>
    apiClient(`/wisdom-loop/requests/${requestId}/respond`, {
      method: 'PATCH',
      body: responseData
    })
};

export default wisdomLoopService;
