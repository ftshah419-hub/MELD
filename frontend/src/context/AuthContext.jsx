import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';
import { clearStoredToken } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Session restoration check on app mount
   */
  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await authService.getCurrentUser();
      const currentUser = data?.user || data?.data?.user || (data?._id ? data : null);

      if (currentUser && currentUser.role) {
        setUser(currentUser);
        setIsAuthenticated(true);
        setError(null);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      // Backend is either offline or session is unauthenticated / expired
      setUser(null);
      setIsAuthenticated(false);
      clearStoredToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  /**
   * Log in user
   */
  const login = useCallback(async (email, password, rememberMe = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password, rememberMe });
      
      const authenticatedUser = response.user || response.data || response;
      if (!authenticatedUser || !authenticatedUser.role) {
        throw new Error('Invalid authentication response structure received from server.');
      }

      setUser(authenticatedUser);
      setIsAuthenticated(true);
      return authenticatedUser;
    } catch (err) {
      const msg = err.message || 'Invalid email or password.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register user (always creates USER role)
   */
  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({ name, email, password });
      
      // If backend logs in immediately upon register
      if (response?.user || response?.token) {
        const authenticatedUser = response.user || response;
        setUser(authenticatedUser);
        setIsAuthenticated(true);
        return authenticatedUser;
      }

      return response;
    } catch (err) {
      const msg = err.message || 'Registration failed. Please check your details.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log out user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(() => ({
    user,
    userId: user?._id || user?.id || null,
    userName: user?.name || '',
    userEmail: user?.email || '',
    userRole: user?.role || null,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    restoreSession,
    clearError
  }), [user, isAuthenticated, isLoading, error, login, register, logout, restoreSession, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
