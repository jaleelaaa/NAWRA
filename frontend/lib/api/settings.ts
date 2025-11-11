/**
 * Settings API Service
 *
 * System settings API endpoints
 */

import apiClient from './client';
import {
  GeneralSettings,
  CirculationSettings,
  NotificationSettings,
} from './types';

/**
 * Get general settings
 */
export const getGeneralSettings = async (): Promise<GeneralSettings> => {
  const response = await apiClient.get<GeneralSettings>('/settings/general');
  return response.data;
};

/**
 * Update general settings
 */
export const updateGeneralSettings = async (
  settings: Partial<GeneralSettings>
): Promise<GeneralSettings> => {
  const response = await apiClient.put<GeneralSettings>('/settings/general', settings);
  return response.data;
};

/**
 * Get circulation settings
 */
export const getCirculationSettings = async (): Promise<CirculationSettings> => {
  const response = await apiClient.get<CirculationSettings>('/settings/circulation');
  return response.data;
};

/**
 * Update circulation settings
 */
export const updateCirculationSettings = async (
  settings: Partial<CirculationSettings>
): Promise<CirculationSettings> => {
  const response = await apiClient.put<CirculationSettings>('/settings/circulation', settings);
  return response.data;
};

/**
 * Get notification settings
 */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await apiClient.get<NotificationSettings>('/settings/notifications');
  return response.data;
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>
): Promise<NotificationSettings> => {
  const response = await apiClient.put<NotificationSettings>(
    '/settings/notifications',
    settings
  );
  return response.data;
};

/**
 * Get all settings
 */
export const getAllSettings = async (): Promise<{
  general: GeneralSettings;
  circulation: CirculationSettings;
  notifications: NotificationSettings;
}> => {
  const response = await apiClient.get('/settings');
  return response.data;
};

/**
 * Reset settings to defaults
 */
export const resetSettings = async (
  settingsType: 'general' | 'circulation' | 'notifications' | 'all'
): Promise<{ message: string }> => {
  const response = await apiClient.post('/settings/reset', { type: settingsType });
  return response.data;
};

/**
 * Backup settings
 */
export const backupSettings = async (): Promise<Blob> => {
  const response = await apiClient.get('/settings/backup', {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Restore settings from backup
 */
export const restoreSettings = async (file: File): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/settings/restore', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
