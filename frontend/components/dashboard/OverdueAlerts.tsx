"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OverdueAlertsProps {
  locale: string;
}

export default function OverdueAlerts({ locale }: OverdueAlertsProps) {
  const isRTL = locale === 'ar';

  // Mock data for overdue books
  const overdueBooks = [
    {
      id: 1,
      bookTitle: locale === 'ar' ? 'مقدمة في قواعد البيانات' : 'Database Systems Introduction',
      userName: locale === 'ar' ? 'أحمد البلوشي' : 'Ahmed Al-Balushi',
      userEmail: 'ahmed.b@student.om',
      dueDate: locale === 'ar' ? '٢٠٢٥-٠١-٠٥' : '2025-01-05',
      daysOverdue: 5,
      severity: 'medium' as const,
    },
    {
      id: 2,
      bookTitle: locale === 'ar' ? 'الفيزياء المتقدمة' : 'Advanced Physics',
      userName: locale === 'ar' ? 'فاطمة الكندي' : 'Fatima Al-Kindi',
      userEmail: 'fatima.k@teacher.om',
      dueDate: locale === 'ar' ? '٢٠٢٥-٠١-٠٣' : '2025-01-03',
      daysOverdue: 7,
      severity: 'high' as const,
    },
    {
      id: 3,
      bookTitle: locale === 'ar' ? 'تاريخ العالم الإسلامي' : 'History of Islamic World',
      userName: locale === 'ar' ? 'سعيد الرواحي' : 'Said Al-Rawahi',
      userEmail: 'said.r@student.om',
      dueDate: locale === 'ar' ? '٢٠٢٥-٠١-٠٨' : '2025-01-08',
      daysOverdue: 2,
      severity: 'low' as const,
    },
    {
      id: 4,
      bookTitle: locale === 'ar' ? 'الكيمياء العضوية' : 'Organic Chemistry',
      userName: locale === 'ar' ? 'مريم السالمي' : 'Maryam Al-Salmi',
      userEmail: 'maryam.s@student.om',
      dueDate: locale === 'ar' ? '٢٠٢٥-٠١-٠١' : '2025-01-01',
      daysOverdue: 9,
      severity: 'high' as const,
    },
  ];

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'medium':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    const labels = {
      low: locale === 'ar' ? 'منخفض' : 'Low',
      medium: locale === 'ar' ? 'متوسط' : 'Medium',
      high: locale === 'ar' ? 'عالي' : 'High',
    };
    return labels[severity];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          {locale === 'ar' ? 'تنبيهات الكتب المتأخرة' : 'Overdue Books Alerts'}
        </CardTitle>
        <p className="text-sm text-gray-500">
          {locale === 'ar' ? `${overdueBooks.length} كتب متأخرة تحتاج إلى متابعة` : `${overdueBooks.length} books need follow-up`}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {overdueBooks.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-lg ${isRTL ? 'border-r-4' : 'border-l-4'} ${getSeverityColor(item.severity)} transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Book & User Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start gap-2">
                    <h4 className="font-semibold text-gray-900 line-clamp-1">{item.bookTitle}</h4>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.severity === 'high' ? 'bg-red-100 text-red-700' :
                      item.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {getSeverityBadge(item.severity)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    <span className="font-medium">{item.userName}</span>
                    <a
                      href={`mailto:${item.userEmail}`}
                      className="flex items-center gap-1 hover:text-[#8B2635] transition-colors"
                    >
                      <Mail className="h-3 w-3" />
                      {item.userEmail}
                    </a>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {locale === 'ar' ? 'تاريخ الاستحقاق:' : 'Due:'} {item.dueDate}
                    </span>
                    <span className="font-semibold text-red-600">
                      {item.daysOverdue} {locale === 'ar' ? 'أيام متأخرة' : 'days overdue'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs min-h-[44px] h-11 md:h-7 px-2 border-[#8B2635] text-[#8B2635] hover:bg-[#8B2635] hover:text-white"
                  >
                    <Mail className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {locale === 'ar' ? 'تذكير' : 'Remind'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs min-h-[44px] h-11 md:h-7 px-2"
                  >
                    <Phone className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {locale === 'ar' ? 'اتصال' : 'Call'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button className="w-full mt-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          {locale === 'ar' ? 'عرض جميع الكتب المتأخرة' : 'View All Overdue Books'}
        </button>
      </CardContent>
    </Card>
  );
}
