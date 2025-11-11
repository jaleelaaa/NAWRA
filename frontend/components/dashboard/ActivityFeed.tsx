"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BookOpen, RotateCcw, Bookmark, ArrowRight } from 'lucide-react';

interface ActivityFeedProps {
  locale: string;
}

export default function ActivityFeed({ locale }: ActivityFeedProps) {
  // Mock data for recent activities
  const activities = [
    {
      id: 1,
      user: locale === 'ar' ? 'أحمد البلوشي' : 'Ahmed Al-Balushi',
      action: 'borrowed',
      book: locale === 'ar' ? 'مقدمة في البرمجة' : 'Introduction to Programming',
      time: locale === 'ar' ? 'منذ 5 دقائق' : '5 minutes ago',
      actionText: locale === 'ar' ? 'استعار كتاب' : 'borrowed a book',
    },
    {
      id: 2,
      user: locale === 'ar' ? 'فاطمة الكندي' : 'Fatima Al-Kindi',
      action: 'returned',
      book: locale === 'ar' ? 'أنظمة قواعد البيانات' : 'Database Systems',
      time: locale === 'ar' ? 'منذ 15 دقيقة' : '15 minutes ago',
      actionText: locale === 'ar' ? 'أعاد كتاب' : 'returned a book',
    },
    {
      id: 3,
      user: locale === 'ar' ? 'محمد الرواحي' : 'Mohammed Al-Rawahi',
      action: 'reserved',
      book: locale === 'ar' ? 'الرياضيات المتقدمة' : 'Advanced Mathematics',
      time: locale === 'ar' ? 'منذ 30 دقيقة' : '30 minutes ago',
      actionText: locale === 'ar' ? 'حجز كتاب' : 'reserved a book',
    },
    {
      id: 4,
      user: locale === 'ar' ? 'سارة السالمي' : 'Sara Al-Salmi',
      action: 'borrowed',
      book: locale === 'ar' ? 'تاريخ عمان' : 'History of Oman',
      time: locale === 'ar' ? 'منذ ساعة' : '1 hour ago',
      actionText: locale === 'ar' ? 'استعار كتاب' : 'borrowed a book',
    },
    {
      id: 5,
      user: locale === 'ar' ? 'خالد المعمري' : 'Khalid Al-Maamari',
      action: 'returned',
      book: locale === 'ar' ? 'الفيزياء الحديثة' : 'Modern Physics',
      time: locale === 'ar' ? 'منذ ساعتين' : '2 hours ago',
      actionText: locale === 'ar' ? 'أعاد كتاب' : 'returned a book',
    },
    {
      id: 6,
      user: locale === 'ar' ? 'نورة البلوشي' : 'Noura Al-Balushi',
      action: 'reserved',
      book: locale === 'ar' ? 'الأدب العربي' : 'Arabic Literature',
      time: locale === 'ar' ? 'منذ 3 ساعات' : '3 hours ago',
      actionText: locale === 'ar' ? 'حجز كتاب' : 'reserved a book',
    },
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'borrowed':
        return <BookOpen className="h-4 w-4" />;
      case 'returned':
        return <RotateCcw className="h-4 w-4" />;
      case 'reserved':
        return <Bookmark className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'borrowed':
        return 'bg-blue-100 text-blue-600';
      case 'returned':
        return 'bg-green-100 text-green-600';
      case 'reserved':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Get user avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate consistent color from name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#8B2635]" />
          {locale === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
        </CardTitle>
        <p className="text-sm text-gray-500">
          {locale === 'ar' ? 'آخر التحديثات في المكتبة' : 'Latest library updates'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group"
            >
              {/* User Avatar */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full ${getAvatarColor(activity.user)} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}
              >
                {getInitials(activity.user)}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">{activity.user}</span>
                      <span className="text-gray-600 mx-1">{activity.actionText}</span>
                    </p>
                    <p className="text-sm font-medium text-[#8B2635] mt-1 line-clamp-1 group-hover:text-[#6B1F2E]">
                      {activity.book}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>

                  {/* Action Badge */}
                  <div
                    className={`flex-shrink-0 p-2 rounded-lg ${getActionColor(activity.action)}`}
                  >
                    {getActionIcon(activity.action)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button className="w-full mt-4 py-2 text-sm font-medium text-[#8B2635] hover:bg-[#8B2635]/5 rounded-lg transition-colors flex items-center justify-center gap-2">
          {locale === 'ar' ? 'عرض جميع الأنشطة' : 'View All Activities'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
}
