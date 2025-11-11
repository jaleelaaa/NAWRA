/**
 * Auth API Service
 *
 * Authentication-related API endpoints
 */

import apiClient, { authApiClient } from './client';
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, User } from './types';

/**
 * Login user - uses separate client without interceptors
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await authApiClient.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

/**
 * Refresh access token
 */
export const refreshToken = async (
  refreshTokenData: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>(
    '/auth/refresh',
    refreshTokenData
  );
  return response.data;
};

/**
 * Get current user info
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/password-reset/request', { email });
  return response.data;
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/password-reset/confirm', {
    token,
    new_password: newPassword,
  });
  return response.data;
};

/**
 * Change password (authenticated user)
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
};
