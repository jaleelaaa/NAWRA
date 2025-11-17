import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import AdminLayout from '@/components/AdminLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ChartsSection from '@/components/dashboard/ChartsSection';
import PopularBooks from '@/components/dashboard/PopularBooks';
import OverdueAlerts from '@/components/dashboard/OverdueAlerts';
import ActivityFeed from '@/components/dashboard/ActivityFeed';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="space-y-3 md:space-y-4">
        {/* Welcome Banner */}
        <section
          aria-label={locale === 'ar' ? 'لافتة الترحيب' : 'Welcome banner'}
          className="bg-gradient-to-r from-[#CE1126] via-[#E01E37] to-[#CE1126] rounded-xl p-3 md:p-4 text-white shadow-xl relative overflow-hidden animate-scale-in"
          style={{ backgroundSize: '200% 200%' }}
        >
          {/* Decorative elements with animations */}
          <div className="hidden md:block absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 md:-mr-32 md:-mt-32 animate-pulse"></div>
          <div className="hidden md:block absolute bottom-0 left-0 w-24 h-24 md:w-48 md:h-48 bg-white opacity-5 rounded-full -ml-12 -mb-12 md:-ml-24 md:-mb-24 animate-pulse"></div>

          <div className="relative z-10 text-center">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3">
              {locale === 'ar' ? 'مرحباً بك في لوحة التحكم' : 'Welcome to the Dashboard'}
            </h1>
            <div className="relative overflow-hidden whitespace-nowrap">
              <div className={`inline-block ${locale === 'ar' ? 'animate-scroll-right' : 'animate-scroll-left'}`}>
                <span className="text-white/90 text-xs md:text-sm lg:text-base inline-block px-8">
                  {locale === 'ar'
                    ? 'نظام إدارة المكتبة NAWRA - وزارة التربية والتعليم، سلطنة عمان'
                    : 'NAWRA Library Management System - Ministry of Education, Sultanate of Oman'}
                </span>
                <span className="text-white/90 text-xs md:text-sm lg:text-base inline-block px-8">
                  {locale === 'ar'
                    ? 'نظام إدارة المكتبة NAWRA - وزارة التربية والتعليم، سلطنة عمان'
                    : 'NAWRA Library Management System - Ministry of Education, Sultanate of Oman'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Cards - Fetched from API */}
        <DashboardStats locale={locale} />

        {/* Charts Section */}
        <section aria-label={locale === 'ar' ? 'الرسوم البيانية والإحصائيات' : 'Charts and statistics'}>
          <ChartsSection locale={locale} />
        </section>

        {/* Two Column Layout: Popular Books & Overdue Alerts */}
        <section aria-label={locale === 'ar' ? 'الكتب الشائعة والتنبيهات' : 'Popular books and alerts'} className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          <PopularBooks locale={locale} />
          <OverdueAlerts locale={locale} />
        </section>

        {/* Activity Feed */}
        <section aria-label={locale === 'ar' ? 'آخر الأنشطة' : 'Recent activity'}>
          <ActivityFeed locale={locale} />
        </section>
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
}
