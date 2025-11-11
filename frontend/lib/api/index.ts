/**
 * API Module Index
 *
 * Central export for all API services
 */

// Export API client and utilities
export { default as apiClient, handleApiError, checkApiHealth } from './client';
export { default as queryClient, queryKeys, invalidateQueries } from './queryClient';

// Export type definitions
export * from './types';

// Export API services - using import/export pattern for better compatibility
import * as auth from './auth';
import * as users from './users';
import * as books from './books';
import * as circulation from './circulation';
import * as reports from './reports';
import * as settings from './settings';
import * as notifications from './notifications';

export const authApi = auth;
export const usersApi = users;
export const booksApi = books;
export const circulationApi = circulation;
export const reportsApi = reports;
export const settingsApi = settings;
export const notificationsApi = notifications;
