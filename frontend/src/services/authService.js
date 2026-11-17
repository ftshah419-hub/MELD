/**
 * Authentication Service for MELD
 * Connects directly to backend endpoints:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   GET  /api/auth/me
 *   POST /api/auth/logout
 */

import { apiClient, setStoredToken, clearStoredToken } from './api';

export const authService = {
  /**
   * Register a new user (always USER role, never admin)
   */
  async register({ name, fullName, email, password }) {
    const displayName = (fullName || name || '').trim();
    const payload = {
      fullName: displayName,
      name: displayName,
      email: email.trim().toLowerCase(),
      password
    };

    const response = await apiClient('/auth/register', {
      method: 'POST',
      body: payload
    });

    // If backend returns a token upon registration
    const token = response?.token || response?.data?.token;
    if (token) {
      setStoredToken(token, false);
    }

    return response;
  },

  /**
   * Log in an existing user
   */
  async login({ email, password, rememberMe = false }) {
    const payload = {
      email: email.trim().toLowerCase(),
      password
    };

    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: payload
    });

    // Save token if returned by backend
    const token = response?.token || response?.data?.token;
    if (token) {
      setStoredToken(token, rememberMe);
    }

    return response;
  },

  /**
   * Verify and fetch current user session
   */
  async getCurrentUser() {
    return await apiClient('/auth/me', {
      method: 'GET'
    });
  },

  /**
   * Invalidate session and log out
   */
  async logout() {
    try {
      await apiClient('/auth/logout', {
        method: 'POST'
      });
    } catch {
      // Even if network fails, we will still clear client session
    } finally {
      clearStoredToken();
    }
  }
};

export default authService;
