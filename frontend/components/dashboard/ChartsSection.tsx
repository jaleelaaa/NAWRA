"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ChartsSectionProps {
  locale: string;
}

export default function ChartsSection({ locale }: ChartsSectionProps) {
  // Mock data for borrowing trends (last 30 days)
  const borrowingTrendsData = [
    { date: locale === 'ar' ? '١ يناير' : 'Jan 1', borrowed: 45, returned: 38 },
    { date: locale === 'ar' ? '٥ يناير' : 'Jan 5', borrowed: 52, returned: 42 },
    { date: locale === 'ar' ? '١٠ يناير' : 'Jan 10', borrowed: 61, returned: 55 },
    { date: locale === 'ar' ? '١٥ يناير' : 'Jan 15', borrowed: 48, returned: 51 },
    { date: locale === 'ar' ? '٢٠ يناير' : 'Jan 20', borrowed: 70, returned: 59 },
    { date: locale === 'ar' ? '٢٥ يناير' : 'Jan 25', borrowed: 65, returned: 68 },
    { date: locale === 'ar' ? '٣٠ يناير' : 'Jan 30', borrowed: 58, returned: 62 },
  ];

  // Mock data for book categories
  const categoriesData = [
    { category: locale === 'ar' ? 'العلوم' : 'Science', count: 245 },
    { category: locale === 'ar' ? 'الأدب' : 'Literature', count: 312 },
    { category: locale === 'ar' ? 'التاريخ' : 'History', count: 198 },
    { category: locale === 'ar' ? 'الرياضيات' : 'Mathematics', count: 156 },
    { category: locale === 'ar' ? 'الفنون' : 'Arts', count: 124 },
  ];

  // Mock data for user types
  const userTypesData = [
    { name: locale === 'ar' ? 'طلاب' : 'Students', value: 680, color: '#3B82F6' },
    { name: locale === 'ar' ? 'معلمون' : 'Teachers', value: 425, color: '#10B981' },
    { name: locale === 'ar' ? 'موظفون' : 'Staff', value: 179, color: '#8B5CF6' },
  ];

  // Mock data for monthly circulation
  const circulationData = [
    { month: locale === 'ar' ? 'يوليو' : 'Jul', circulation: 320 },
    { month: locale === 'ar' ? 'أغسطس' : 'Aug', circulation: 450 },
    { month: locale === 'ar' ? 'سبتمبر' : 'Sep', circulation: 580 },
    { month: locale === 'ar' ? 'أكتوبر' : 'Oct', circulation: 520 },
    { month: locale === 'ar' ? 'نوفمبر' : 'Nov', circulation: 640 },
    { month: locale === 'ar' ? 'ديسمبر' : 'Dec', circulation: 710 },
    { month: locale === 'ar' ? 'يناير' : 'Jan', circulation: 680 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
      {/* Borrowing Trends Line Chart */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg font-bold">
            {locale === 'ar' ? 'اتجاهات الاستعارة والإرجاع' : 'Borrowing & Return Trends'}
          </CardTitle>
          <p className="text-xs text-gray-500">
            {locale === 'ar' ? 'آخر 30 يوماً' : 'Last 30 days'}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[200px] md:h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={borrowingTrendsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  stroke="#374151"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                  tick={{ fill: '#374151' }}
                />
                <YAxis
                  stroke="#374151"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                  tick={{ fill: '#374151' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontWeight: '500',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontWeight: '600', fontSize: '13px' }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="borrowed"
                  name={locale === 'ar' ? 'مُستعار' : 'Borrowed'}
                  stroke="#8B2635"
                  strokeWidth={3}
                  dot={{ fill: '#8B2635', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="returned"
                  name={locale === 'ar' ? 'مُرجع' : 'Returned'}
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Book Categories Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg font-bold">
            {locale === 'ar' ? 'الكتب حسب الفئة' : 'Books by Category'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[220px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriesData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="category"
                  stroke="#374151"
                  style={{ fontSize: '11px', fontWeight: '600' }}
                  tick={{ fill: '#374151' }}
                  angle={locale === 'ar' ? 0 : -15}
                  textAnchor={locale === 'ar' ? 'middle' : 'end'}
                  height={60}
                />
                <YAxis
                  stroke="#374151"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                  tick={{ fill: '#374151' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontWeight: '500',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#8B2635"
                  radius={[8, 8, 0, 0]}
                  name={locale === 'ar' ? 'عدد الكتب' : 'Book Count'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* User Types Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg font-bold">
            {locale === 'ar' ? 'توزيع المستخدمين' : 'User Distribution'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[220px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTypesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontSize: '13px', fontWeight: '600' }}
                >
                  {userTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontWeight: '500',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Circulation Area Chart */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg font-bold">
            {locale === 'ar' ? 'إحصائيات التداول الشهرية' : 'Monthly Circulation Statistics'}
          </CardTitle>
          <p className="text-xs text-gray-500">
            {locale === 'ar' ? 'آخر 6 أشهر' : 'Last 6 months'}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[180px] md:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={circulationData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCirculation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B2635" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B2635" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  stroke="#374151"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                  tick={{ fill: '#374151' }}
                />
                <YAxis
                  stroke="#374151"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                  tick={{ fill: '#374151' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontWeight: '500',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="circulation"
                  stroke="#8B2635"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCirculation)"
                  name={locale === 'ar' ? 'التداول' : 'Circulation'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
