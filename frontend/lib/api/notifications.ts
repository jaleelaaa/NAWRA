/**
 * Notifications API Service
 *
 * Notification management API endpoints
 */

import apiClient from './client';
import {
  Notification,
  NotificationFilters,
  MarkReadRequest,
  PaginatedResponse,
} from './types';

/**
 * Get all notifications with filters
 */
export const getNotifications = async (
  filters?: NotificationFilters
): Promise<PaginatedResponse<Notification>> => {
  const response = await apiClient.get<PaginatedResponse<Notification>>('/notifications', {
    params: filters,
  });
  return response.data;
};

/**
 * Get notification by ID
 */
export const getNotificationById = async (notificationId: string): Promise<Notification> => {
  const response = await apiClient.get<Notification>(`/notifications/${notificationId}`);
  return response.data;
};

/**
 * Get unread notifications
 */
export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const response = await apiClient.get<Notification[]>('/notifications/unread');
  return response.data;
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<{ count: number }> => {
  const response = await apiClient.get<{ count: number }>('/notifications/unread/count');
  return response.data;
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId: string): Promise<Notification> => {
  const response = await apiClient.patch<Notification>(`/notifications/${notificationId}/read`);
  return response.data;
};

/**
 * Mark multiple notifications as read
 */
export const markMultipleAsRead = async (
  notificationIds: string[]
): Promise<{ message: string }> => {
  const response = await apiClient.post('/notifications/mark-read', {
    notification_ids: notificationIds,
  });
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<{ message: string }> => {
  const response = await apiClient.post('/notifications/mark-all-read');
  return response.data;
};

/**
 * Delete notification
 */
export const deleteNotification = async (
  notificationId: string
): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/notifications/${notificationId}`);
  return response.data;
};

/**
 * Delete multiple notifications
 */
export const deleteMultipleNotifications = async (
  notificationIds: string[]
): Promise<{ message: string }> => {
  const response = await apiClient.post('/notifications/delete-multiple', {
    notification_ids: notificationIds,
  });
  return response.data;
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = async (): Promise<{ message: string }> => {
  const response = await apiClient.delete('/notifications/clear');
  return response.data;
};

/**
 * Send test notification (admin only)
 */
export const sendTestNotification = async (userId: string): Promise<Notification> => {
  const response = await apiClient.post<Notification>('/notifications/test', { user_id: userId });
  return response.data;
};
