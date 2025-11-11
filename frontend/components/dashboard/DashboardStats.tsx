"use client";

import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { dashboardAPI } from '@/lib/api/analytics';
import { Loader2 } from 'lucide-react';

interface DashboardStatsProps {
  locale: string;
}

export default function DashboardStats({ locale }: DashboardStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await dashboardAPI.getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section aria-label={locale === 'ar' ? 'إحصائيات النظام' : 'System statistics'} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </section>
    );
  }

  // Error state
  if (error || !stats) {
    return (
      <section className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600 text-center">{error || 'Failed to load statistics'}</p>
      </section>
    );
  }

  // Map stats data to card format
  const statCards = [
    {
      title: locale === 'ar' ? 'إجمالي المستخدمين' : 'Total Users',
      value: stats.total_users.value.toLocaleString(),
      change: `${stats.total_users.trend.direction === 'up' ? '+' : '-'}${stats.total_users.trend.percentage}%`,
      trend: stats.total_users.trend.direction,
      iconName: 'users' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      sparklineData: stats.total_users.sparkline,
      subtitle: locale === 'ar' ? 'مقارنة بالشهر الماضي' : 'Compared to last month',
    },
    {
      title: locale === 'ar' ? 'إجمالي الكتب' : 'Total Books',
      value: stats.total_books.value.toLocaleString(),
      change: `${stats.total_books.trend.direction === 'up' ? '+' : '-'}${stats.total_books.trend.percentage}%`,
      trend: stats.total_books.trend.direction,
      iconName: 'book' as const,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      sparklineData: stats.total_books.sparkline,
      subtitle: locale === 'ar' ? 'مقارنة بالشهر الماضي' : 'Compared to last month',
    },
    {
      title: locale === 'ar' ? 'الكتب المستعارة' : 'Books Borrowed',
      value: stats.books_borrowed.value.toLocaleString(),
      change: `${stats.books_borrowed.trend.direction === 'up' ? '+' : '-'}${stats.books_borrowed.trend.percentage}%`,
      trend: stats.books_borrowed.trend.direction,
      iconName: 'book-open' as const,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      sparklineData: stats.books_borrowed.sparkline,
      subtitle: locale === 'ar' ? 'مقارنة بالشهر الماضي' : 'Compared to last month',
    },
    {
      title: locale === 'ar' ? 'الكتب المتأخرة' : 'Overdue Books',
      value: stats.overdue_books.value.toLocaleString(),
      change: `${stats.overdue_books.trend.direction === 'up' ? '+' : '-'}${stats.overdue_books.trend.percentage}%`,
      trend: stats.overdue_books.trend.direction,
      iconName: 'alert-circle' as const,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      sparklineData: stats.overdue_books.sparkline,
      subtitle: locale === 'ar' ? 'مقارنة بالشهر الماضي' : 'Compared to last month',
    },
  ];

  return (
    <section aria-label={locale === 'ar' ? 'إحصائيات النظام' : 'System statistics'} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend as 'up' | 'down'}
          iconName={stat.iconName}
          color={stat.color}
          bgColor={stat.bgColor}
          sparklineData={stat.sparklineData}
          subtitle={stat.subtitle}
          locale={locale}
        />
      ))}
    </section>
  );
}
