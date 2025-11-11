'use client';

import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Construction } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function UsersPage() {
  const locale = useLocale();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {locale === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
            </h1>
            <p className="text-gray-600 mt-1">
              {locale === 'ar' ? 'إدارة حسابات المستخدمين والصلاحيات' : 'Manage user accounts and permissions'}
            </p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Construction className="w-16 h-16 text-[#8B2635] mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {locale === 'ar' ? 'قريباً' : 'Coming Soon'}
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              {locale === 'ar'
                ? 'صفحة إدارة المستخدمين قيد التطوير. سيتم إضافة ميزات شاملة لإدارة المستخدمين قريباً.'
                : 'The user management page is under development. Comprehensive user management features will be added soon.'}
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {locale === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground">
                {locale === 'ar' ? '+12% من الشهر الماضي' : '+12% from last month'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {locale === 'ar' ? 'المستخدمون النشطون' : 'Active Users'}
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,125</div>
              <p className="text-xs text-muted-foreground">
                {locale === 'ar' ? '87.6% من الإجمالي' : '87.6% of total'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {locale === 'ar' ? 'مستخدمون جدد' : 'New Users'}
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">
                {locale === 'ar' ? 'هذا الشهر' : 'This month'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
