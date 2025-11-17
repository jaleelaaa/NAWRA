'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, Package, FileText, Search, User } from 'lucide-react';
import { getMyStats, getMyLoans, getMyRequests } from '@/lib/api/patron';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

interface Stats {
  activeLoans: number;
  overdueBooks: number;
  totalBorrowed: number;
  activeRequests: number;
}

interface RecentActivity {
  id: string;
  type: 'loan' | 'request' | 'return';
  book_title: string;
  book_title_ar?: string;
  date: string;
  status?: string;
}

export default function PatronDashboard() {
  const t = useTranslations('patron.dashboard');
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load statistics
      const statsData = await getMyStats();
      setStats({
        activeLoans: statsData.active_loans || 0,
        overdueBooks: statsData.overdue_books || 0,
        totalBorrowed: statsData.total_borrowed || 0,
        activeRequests: statsData.active_requests || 0,
      });

      // Load recent loans and requests for activity feed
      const [loansResponse, requestsResponse] = await Promise.all([
        getMyLoans({ page: 1, page_size: 5 }),
        getMyRequests({ page: 1, page_size: 5 }),
      ]);

      // Combine and sort by date
      const activities: RecentActivity[] = [
        ...(loansResponse.items || []).map((loan: any) => ({
          id: loan.id,
          type: loan.return_date ? 'return' : 'loan',
          book_title: loan.books?.title || 'Unknown Book',
          book_title_ar: loan.books?.title_ar,
          date: loan.return_date || loan.checkout_date,
          status: loan.status,
        })),
        ...(requestsResponse.items || []).map((request: any) => ({
          id: request.id,
          type: 'request',
          book_title: request.books?.title || 'Unknown Book',
          book_title_ar: request.books?.title_ar,
          date: request.request_date,
          status: request.status,
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Search,
      label: t('quickActions.browseCatalog'),
      onClick: () => router.push(`/${locale}/patron/catalog`),
      color: 'bg-[#CE1126] hover:bg-[#A00E1E]',
    },
    {
      icon: BookOpen,
      label: t('quickActions.viewMyLoans'),
      onClick: () => router.push(`/${locale}/patron/loans`),
      color: 'bg-[#009639] hover:bg-[#007A2E]',
    },
    {
      icon: FileText,
      label: t('quickActions.viewMyRequests'),
      onClick: () => router.push(`/${locale}/patron/requests`),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: User,
      label: t('quickActions.editProfile'),
      onClick: () => router.push(`/${locale}/patron/profile`),
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CE1126]"></div>
      </div>
    );
  }

  const displayName = locale === 'ar' && user?.arabic_name
    ? user.arabic_name
    : (user?.full_name || user?.email || 'User');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('title', { name: displayName })}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('subtitle')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={BookOpen}
          label={t('quickStats.activeLoans')}
          value={stats?.activeLoans || 0}
          color="text-[#CE1126]"
          bgColor="bg-red-100 dark:bg-red-900/20"
        />
        <StatsCard
          icon={Clock}
          label={t('quickStats.overdueBooks')}
          value={stats?.overdueBooks || 0}
          color="text-red-600"
          bgColor="bg-red-100 dark:bg-red-900"
          alert={stats?.overdueBooks ? stats.overdueBooks > 0 : false}
        />
        <StatsCard
          icon={Package}
          label={t('quickStats.totalBorrowed')}
          value={stats?.totalBorrowed || 0}
          color="text-[#009639]"
          bgColor="bg-green-100 dark:bg-green-900/20"
        />
        <StatsCard
          icon={FileText}
          label={t('quickStats.activeRequests')}
          value={stats?.activeRequests || 0}
          color="text-purple-600"
          bgColor="bg-purple-100 dark:bg-purple-900"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {t('quickActions.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              onClick={action.onClick}
              color={action.color}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {t('recentActivity.title')}
        </h2>
        {recentActivity.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {activity.type === 'loan' && <BookOpen className="h-5 w-5 text-blue-600" />}
                        {activity.type === 'return' && <Package className="h-5 w-5 text-green-600" />}
                        {activity.type === 'request' && <FileText className="h-5 w-5 text-purple-600" />}
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.book_title}
                        </p>
                      </div>
                      {activity.book_title_ar && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1" dir="rtl">
                          {activity.book_title_ar}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                        {activity.status && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            activity.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                            activity.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                            activity.status === 'returned' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            activity.status === 'reserved' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {t(`activity.status.${activity.status}`)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">{t('recentActivity.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
  alert = false
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  bgColor: string;
  alert?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${alert ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({
  icon: Icon,
  label,
  onClick,
  color
}: {
  icon: any;
  label: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md`}
    >
      <Icon className="h-6 w-6" />
      <span className="text-sm font-medium text-center">{label}</span>
    </button>
  );
}
