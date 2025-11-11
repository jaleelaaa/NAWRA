/**
 * Reports & Analytics API Service
 *
 * Reports and analytics API endpoints
 */

import apiClient from './client';
import {
  DashboardStats,
  RecentActivity,
  AnalyticsData,
  ReportFilters,
  ExportRequest,
} from './types';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/reports/dashboard');
  return response.data;
};

/**
 * Get recent activity feed
 */
export const getRecentActivity = async (limit: number = 10): Promise<RecentActivity[]> => {
  const response = await apiClient.get<RecentActivity[]>('/reports/activity', {
    params: { limit },
  });
  return response.data;
};

/**
 * Get analytics data for date range
 */
export const getAnalyticsData = async (
  fromDate: string,
  toDate: string
): Promise<AnalyticsData[]> => {
  const response = await apiClient.get<AnalyticsData[]>('/reports/analytics', {
    params: { from_date: fromDate, to_date: toDate },
  });
  return response.data;
};

/**
 * Get circulation report
 */
export const getCirculationReport = async (filters?: ReportFilters): Promise<{
  total_checkouts: number;
  total_returns: number;
  total_renewals: number;
  overdue_count: number;
  popular_books: Array<{ book_id: string; title: string; borrow_count: number }>;
}> => {
  const response = await apiClient.get('/reports/circulation', {
    params: filters,
  });
  return response.data;
};

/**
 * Get user activity report
 */
export const getUserActivityReport = async (filters?: ReportFilters): Promise<{
  total_registrations: number;
  active_users: number;
  top_borrowers: Array<{ user_id: string; name: string; borrow_count: number }>;
}> => {
  const response = await apiClient.get('/reports/users', {
    params: filters,
  });
  return response.data;
};

/**
 * Get collection report
 */
export const getCollectionReport = async (filters?: ReportFilters): Promise<{
  total_books: number;
  total_copies: number;
  books_by_category: Array<{ category: string; count: number }>;
  books_by_language: Array<{ language: string; count: number }>;
}> => {
  const response = await apiClient.get('/reports/collection', {
    params: filters,
  });
  return response.data;
};

/**
 * Get financial report (fines)
 */
export const getFinancialReport = async (filters?: ReportFilters): Promise<{
  total_fines_collected: number;
  pending_fines: number;
  waived_fines: number;
  fines_by_month: Array<{ month: string; amount: number }>;
}> => {
  const response = await apiClient.get('/reports/financial', {
    params: filters,
  });
  return response.data;
};

/**
 * Export report
 */
export const exportReport = async (exportRequest: ExportRequest): Promise<Blob> => {
  const response = await apiClient.post('/reports/export', exportRequest, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Get popular books
 */
export const getPopularBooks = async (
  limit: number = 10
): Promise<Array<{ book_id: string; title: string; borrow_count: number }>> => {
  const response = await apiClient.get('/reports/popular-books', {
    params: { limit },
  });
  return response.data;
};

/**
 * Get top borrowers
 */
export const getTopBorrowers = async (
  limit: number = 10
): Promise<Array<{ user_id: string; name: string; borrow_count: number }>> => {
  const response = await apiClient.get('/reports/top-borrowers', {
    params: { limit },
  });
  return response.data;
};

/**
 * Get overdue books report
 */
export const getOverdueReport = async (): Promise<{
  total_overdue: number;
  total_overdue_fines: number;
  overdue_by_duration: Array<{ duration_days: string; count: number }>;
  books: Array<{
    loan_id: string;
    book_title: string;
    user_name: string;
    due_date: string;
    days_overdue: number;
    fine_amount: number;
  }>;
}> => {
  const response = await apiClient.get('/reports/overdue');
  return response.data;
};
