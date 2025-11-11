/**
 * Analytics API Service
 *
 * Functions for fetching analytics and dashboard data
 */

import { apiClient } from './client';

export interface BorrowingTrendData {
  date: string;
  date_full: string;
  borrowed: number;
  returned: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface UserDistributionData {
  name: string;
  value: number;
}

export interface CirculationData {
  month: string;
  month_key: string;
  checkouts: number;
  returns: number;
}

export interface DashboardStats {
  total_users: {
    value: number;
    trend: {
      direction: 'up' | 'down';
      percentage: number;
    };
    sparkline: Array<{ value: number }>;
  };
  total_books: {
    value: number;
    trend: {
      direction: 'up' | 'down';
      percentage: number;
    };
    sparkline: Array<{ value: number }>;
  };
  books_borrowed: {
    value: number;
    trend: {
      direction: 'up' | 'down';
      percentage: number;
    };
    sparkline: Array<{ value: number }>;
  };
  overdue_books: {
    value: number;
    trend: {
      direction: 'up' | 'down';
      percentage: number;
    };
    sparkline: Array<{ value: number }>;
  };
  last_updated: string;
}

/**
 * Analytics API
 */
export const analyticsAPI = {
  /**
   * Get borrowing and return trends for the last N days
   */
  getBorrowingTrends: async (days: number = 30): Promise<{
    data: BorrowingTrendData[];
    period: string;
    total_borrowed: number;
    total_returned: number;
  }> => {
    const response = await apiClient.get(`/analytics/borrowing-trends?days=${days}`);
    return response.data;
  },

  /**
   * Get books grouped by category
   */
  getBooksByCategory: async (): Promise<{
    data: CategoryData[];
    total_books: number;
    total_categories: number;
  }> => {
    const response = await apiClient.get('/analytics/categories');
    return response.data;
  },

  /**
   * Get user distribution by type
   */
  getUserDistribution: async (): Promise<{
    data: UserDistributionData[];
    total_users: number;
  }> => {
    const response = await apiClient.get('/analytics/user-distribution');
    return response.data;
  },

  /**
   * Get monthly circulation statistics
   */
  getMonthlyCirculation: async (months: number = 12): Promise<{
    data: CirculationData[];
    period: string;
  }> => {
    const response = await apiClient.get(`/analytics/monthly-circulation?months=${months}`);
    return response.data;
  },
};

/**
 * Dashboard API
 */
export const dashboardAPI = {
  /**
   * Get comprehensive dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
};
