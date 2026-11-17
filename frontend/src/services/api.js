/**
 * Centralized API Client for MELD
 * Provides unified request handling, credentials handling for HttpOnly cookies,
 * header injection, and human-friendly error messages.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Token storage key (fallback for non-cookie JWT setups)
 */
const TOKEN_KEY = 'meld_auth_token';
const REMEMBER_KEY = 'meld_remember_me';

export const getStoredToken = () => {
  const remember = localStorage.getItem(REMEMBER_KEY) === 'true';
  return remember
    ? localStorage.getItem(TOKEN_KEY)
    : sessionStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token, remember = false) => {
  if (remember) {
    localStorage.setItem(REMEMBER_KEY, 'true');
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

/**
 * Execute an HTTP request with proper headers, credentials, and error normalization
 */
export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: options.method || 'GET',
    headers,
    credentials: 'include', // Support HttpOnly cookies for session-based auth
    ...options
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && (data?.message || data?.error)) ||
        (response.status === 401 ? 'Invalid credentials or session expired' : null) ||
        (response.status === 403 ? 'You do not have permission to access this resource' : null) ||
        (response.status === 404 ? 'The requested resource was not found' : null) ||
        (response.status >= 500 ? 'Server is currently unavailable. Please try again shortly.' : null) ||
        'An unexpected error occurred. Please try again.';

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If it's a browser TypeError from fetch (server down / CORS / network drop)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error(
        'Unable to reach the MELD backend server. Please verify your connection or ensure the API service is running.'
      );
      networkError.status = 0;
      networkError.isNetworkError = true;
      throw networkError;
    }
    throw error;
  }
}

export default apiClient;
