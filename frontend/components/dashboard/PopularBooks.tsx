"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, TrendingUp, BookOpen } from 'lucide-react';

interface PopularBooksProps {
  locale: string;
}

export default function PopularBooks({ locale }: PopularBooksProps) {
  const isRTL = locale === 'ar';

  // Mock data for popular books with cover colors
  const popularBooks = [
    {
      title: locale === 'ar' ? 'مقدمة في البرمجة' : 'Introduction to Programming',
      author: locale === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed',
      borrowCount: 45,
      category: locale === 'ar' ? 'علوم الحاسوب' : 'Computer Science',
      trend: 12,
      coverGradient: 'from-blue-500 to-purple-600',
      coverColor: 'bg-blue-500',
    },
    {
      title: locale === 'ar' ? 'الرياضيات المتقدمة' : 'Advanced Mathematics',
      author: locale === 'ar' ? 'فاطمة الكندي' : 'Fatima Al-Kindi',
      borrowCount: 38,
      category: locale === 'ar' ? 'رياضيات' : 'Mathematics',
      trend: 8,
      coverGradient: 'from-green-500 to-emerald-600',
      coverColor: 'bg-green-500',
    },
    {
      title: locale === 'ar' ? 'تاريخ عمان' : 'History of Oman',
      author: locale === 'ar' ? 'سعيد البلوشي' : 'Said Al-Balushi',
      borrowCount: 32,
      category: locale === 'ar' ? 'تاريخ' : 'History',
      trend: 15,
      coverGradient: 'from-orange-500 to-red-600',
      coverColor: 'bg-orange-500',
    },
    {
      title: locale === 'ar' ? 'الفيزياء الحديثة' : 'Modern Physics',
      author: locale === 'ar' ? 'محمد الرواحي' : 'Mohammed Al-Rawahi',
      borrowCount: 28,
      category: locale === 'ar' ? 'علوم' : 'Science',
      trend: 5,
      coverGradient: 'from-indigo-500 to-blue-600',
      coverColor: 'bg-indigo-500',
    },
    {
      title: locale === 'ar' ? 'الأدب العربي' : 'Arabic Literature',
      author: locale === 'ar' ? 'عائشة السالمي' : 'Aisha Al-Salmi',
      borrowCount: 25,
      category: locale === 'ar' ? 'أدب' : 'Literature',
      trend: 10,
      coverGradient: 'from-pink-500 to-rose-600',
      coverColor: 'bg-pink-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Book className="h-5 w-5 text-[#8B2635]" />
          {locale === 'ar' ? 'الكتب الأكثر شعبية' : 'Most Popular Books'}
        </CardTitle>
        <p className="text-sm text-gray-500">
          {locale === 'ar' ? 'الأكثر استعارة هذا الشهر' : 'Most borrowed this month'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {popularBooks.slice(0, 3).map((book, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer group border border-transparent hover:border-[#8B2635]/20 hover:shadow-md"
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0 relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white absolute -top-1 ${isRTL ? '-right-1' : '-left-1'} z-10 ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg'
                      : index === 1
                      ? 'bg-gradient-to-br from-gray-300 to-gray-500 shadow-md'
                      : index === 2
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-md'
                      : 'bg-gradient-to-br from-[#8B2635] to-[#6B1F2E] shadow'
                  }`}
                >
                  {index + 1}
                </div>
              </div>

              {/* Book Cover */}
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-16 md:w-16 md:h-22 rounded-lg bg-gradient-to-br ${book.coverGradient} shadow-lg flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}
                >
                  {/* Book spine effect */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-black/20"></div>

                  {/* Book icon */}
                  <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-white/90" />

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm md:text-base group-hover:text-[#8B2635] transition-colors leading-tight mb-1">
                  {book.title}
                </h4>
                <p className="text-xs md:text-sm text-gray-600 truncate mb-2">{book.author}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 bg-[#8B2635]/10 text-[#8B2635] rounded-full font-medium">
                    {book.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {book.borrowCount} {locale === 'ar' ? 'استعارة' : 'borrows'}
                  </span>
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="flex-shrink-0">
                <div className="flex flex-col items-center gap-0.5 px-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-600">+{book.trend}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button className="w-full mt-4 py-2 text-sm font-medium text-[#8B2635] hover:bg-[#8B2635]/5 rounded-lg transition-colors flex items-center justify-center gap-2">
          {locale === 'ar' ? 'عرض جميع الكتب' : 'View All Books'}
          <Book className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
}
