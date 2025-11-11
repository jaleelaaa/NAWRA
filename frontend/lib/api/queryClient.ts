/**
 * React Query Configuration
 *
 * Global configuration for React Query (TanStack Query)
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { handleApiError } from './client';

/**
 * Default options for React Query
 */
const defaultOptions: DefaultOptions = {
  queries: {
    // Stale time: 5 minutes (data considered fresh for 5 minutes)
    staleTime: 5 * 60 * 1000,

    // Cache time: 10 minutes (inactive queries cached for 10 minutes)
    gcTime: 10 * 60 * 1000,

    // Retry failed requests 3 times with exponential backoff
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as any).response?.status;
        if (status && status >= 400 && status < 500) {
          return false;
        }
      }

      // Retry up to 3 times for other errors
      return failureCount < 3;
    },

    // Retry delay: exponential backoff (1s, 2s, 4s)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch on window focus (useful for keeping data fresh)
    refetchOnWindowFocus: true,

    // Refetch on reconnect (useful for offline recovery)
    refetchOnReconnect: true,

    // Don't refetch on mount if data is still fresh
    refetchOnMount: false,
  },

  mutations: {
    // Retry mutations once on failure
    retry: 1,

    // Retry delay for mutations
    retryDelay: 1000,
  },
};

/**
 * Create and export query client
 */
export const queryClient = new QueryClient({
  defaultOptions,
});

/**
 * Query keys factory for consistent cache keys
 */
export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    list: (filters?: Record<string, any>) => ['users', 'list', filters] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
    search: (query: string) => ['users', 'search', query] as const,
  },

  // Books (Catalog)
  books: {
    all: ['books'] as const,
    list: (filters?: Record<string, any>) => ['books', 'list', filters] as const,
    detail: (id: string) => ['books', 'detail', id] as const,
    search: (query: string) => ['books', 'search', query] as const,
    categories: ['books', 'categories'] as const,
  },

  // Circulation
  circulation: {
    all: ['circulation'] as const,
    loans: (filters?: Record<string, any>) => ['circulation', 'loans', filters] as const,
    reservations: (filters?: Record<string, any>) => ['circulation', 'reservations', filters] as const,
    fines: (userId?: string) => ['circulation', 'fines', userId] as const,
    overdue: ['circulation', 'overdue'] as const,
  },

  // Reports
  reports: {
    all: ['reports'] as const,
    dashboard: ['reports', 'dashboard'] as const,
    analytics: (dateRange?: { from: string; to: string }) =>
      ['reports', 'analytics', dateRange] as const,
    export: (reportType: string) => ['reports', 'export', reportType] as const,
  },

  // Settings
  settings: {
    all: ['settings'] as const,
    general: ['settings', 'general'] as const,
    circulation: ['settings', 'circulation'] as const,
    notifications: ['settings', 'notifications'] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    unread: ['notifications', 'unread'] as const,
    list: (filters?: Record<string, any>) => ['notifications', 'list', filters] as const,
  },
};

/**
 * Helper to invalidate related queries
 */
export const invalidateQueries = {
  users: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
  books: () => queryClient.invalidateQueries({ queryKey: queryKeys.books.all }),
  circulation: () => queryClient.invalidateQueries({ queryKey: queryKeys.circulation.all }),
  reports: () => queryClient.invalidateQueries({ queryKey: queryKeys.reports.all }),
  settings: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings.all }),
  notifications: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
};

export default queryClient;
