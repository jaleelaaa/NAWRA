'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Clock, Package, Save, X } from 'lucide-react';
import { getMyProfile, updateMyProfile, getMyStats } from '@/lib/api/patron';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  user_type: string;
  created_at: string;
}

interface Stats {
  total_borrowed: number;
  active_loans: number;
  overdue_books: number;
  total_fines_paid: number;
}

interface ProfileFormData {
  full_name: string;
  phone: string;
  address: string;
}

export default function MyProfile() {
  const t = useTranslations('patron.profile');
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData] = await Promise.all([
        getMyProfile(),
        getMyStats(),
      ]);

      setProfile(profileData);
      setStats({
        total_borrowed: statsData.total_borrowed || 0,
        active_loans: statsData.active_loans || 0,
        overdue_books: statsData.overdue_books || 0,
        total_fines_paid: statsData.total_fines_paid || 0,
      });

      setFormData({
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.full_name.trim()) {
      toast.error(t('validation.nameRequired'));
      return;
    }

    try {
      setSaving(true);
      const updatedProfile = await updateMyProfile({
        full_name: formData.full_name,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      });

      setProfile(updatedProfile);
      setUser({ ...user, full_name: updatedProfile.full_name });
      setEditing(false);
      toast.success(t('updateSuccess'));
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(t('errors.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('info.title')}
              </h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {t('editProfile')}
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('info.fullName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('info.email')}
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {t('info.emailCannotChange')}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('info.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('info.address')}
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {t('saving')}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {t('saveChanges')}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    {t('cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <InfoField icon={User} label={t('info.fullName')} value={profile?.full_name} />
                <InfoField icon={Mail} label={t('info.email')} value={profile?.email} />
                <InfoField icon={Phone} label={t('info.phone')} value={profile?.phone || t('info.notProvided')} />
                <InfoField icon={MapPin} label={t('info.address')} value={profile?.address || t('info.notProvided')} />
                <InfoField
                  icon={Calendar}
                  label={t('info.memberSince')}
                  value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}
                />
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('stats.title')}
            </h2>
            <div className="space-y-4">
              <StatItem
                icon={Package}
                label={t('stats.totalBorrowed')}
                value={stats?.total_borrowed || 0}
                color="text-blue-600"
              />
              <StatItem
                icon={BookOpen}
                label={t('stats.activeLoans')}
                value={stats?.active_loans || 0}
                color="text-green-600"
              />
              <StatItem
                icon={Clock}
                label={t('stats.overdueBooks')}
                value={stats?.overdue_books || 0}
                color="text-red-600"
                alert={stats?.overdue_books ? stats.overdue_books > 0 : false}
              />
              {stats?.total_fines_paid !== undefined && stats.total_fines_paid > 0 && (
                <StatItem
                  icon={Package}
                  label={t('stats.totalFinesPaid')}
                  value={`$${stats.total_fines_paid.toFixed(2)}`}
                  color="text-orange-600"
                />
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('account.title')}
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('account.accountType')}</p>
                <p className="text-base font-medium text-gray-900 dark:text-white capitalize">
                  {profile?.user_type || 'Patron'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('account.accountId')}</p>
                <p className="text-base font-mono text-gray-900 dark:text-white text-xs">
                  {profile?.id || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Info Field Component
function InfoField({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-base text-gray-900 dark:text-white">{value || '-'}</p>
      </div>
    </div>
  );
}

// Stat Item Component
function StatItem({
  icon: Icon,
  label,
  value,
  color,
  alert = false,
}: {
  icon: any;
  label: string;
  value: number | string;
  color: string;
  alert?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${color}`} />
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <span className={`text-lg font-semibold ${alert ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </span>
    </div>
  );
}
