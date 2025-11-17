'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, BarChart3, Download } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface ReportChartsProps {
  trendData?: Array<{ date: string; value: number }>;
  distributionData?: Array<{ category: string; count: number }>;
  onExportChart?: () => void;
}

const defaultTrendData = [
  { date: 'Jan 1', value: 45 },
  { date: 'Jan 8', value: 52 },
  { date: 'Jan 15', value: 48 },
  { date: 'Jan 22', value: 61 },
  { date: 'Jan 29', value: 73 },
  { date: 'Feb 5', value: 68 },
  { date: 'Feb 12', value: 82 },
  { date: 'Feb 19', value: 91 },
  { date: 'Feb 26', value: 87 },
  { date: 'Mar 5', value: 105 },
  { date: 'Mar 12', value: 98 },
  { date: 'Mar 19', value: 128 },
];

const defaultDistributionData = [
  { category: 'Fiction', count: 285 },
  { category: 'Non-Fiction', count: 412 },
  { category: 'Reference', count: 198 },
  { category: 'Science', count: 334 },
  { category: 'History', count: 267 },
  { category: 'Art', count: 156 },
];

export default function ReportCharts({
  trendData = defaultTrendData,
  distributionData = defaultDistributionData,
  onExportChart,
}: ReportChartsProps) {
  const t = useTranslations('reports.charts');
  const tCat = useTranslations('reports.charts.categoriesShort');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Function to translate category names (using short versions for charts)
  const translateCategory = (category: string): string => {
    // Remove "categories-" prefix if present
    let cleanCategory = category;
    if (category.startsWith('categories-')) {
      cleanCategory = category.replace('categories-', '');
    }

    // Direct mapping to translation keys
    const categoryKeyMap: Record<string, string> = {
      'Fiction': 'fiction',
      'Non-Fiction': 'nonFiction',
      'Reference': 'reference',
      'Science': 'science',
      'Sciences': 'science',
      'History': 'history',
      'Art': 'art',
      'fiction': 'fiction',
      'nonFiction': 'nonFiction',
      'reference': 'reference',
      'science': 'science',
      'history': 'history',
      'art': 'art',
    };

    const translationKey = categoryKeyMap[cleanCategory];

    if (translationKey) {
      try {
        const shortTranslation = tCat(translationKey);
        // Check if we got a valid translation (not the key path itself)
        if (shortTranslation &&
            !shortTranslation.includes('categoriesShort') &&
            !shortTranslation.includes('reports.charts') &&
            shortTranslation !== translationKey) {
          return shortTranslation;
        }
      } catch (error) {
        console.error('Translation error for category:', cleanCategory, error);
      }
    }

    // Fallback to original category name
    return cleanCategory;
  };

  // Function to format date labels with localized month names
  const formatDateLabel = (dateStr: string): string => {
    const monthMap: Record<string, string> = {
      'Jan': 'jan',
      'Feb': 'feb',
      'Mar': 'mar',
      'Apr': 'apr',
      'May': 'may',
      'Jun': 'jun',
      'Jul': 'jul',
      'Aug': 'aug',
      'Sep': 'sep',
      'Oct': 'oct',
      'Nov': 'nov',
      'Dec': 'dec',
    };

    const parts = dateStr.split(' ');
    if (parts.length === 2) {
      const [monthStr, day] = parts;
      const monthKey = monthMap[monthStr];
      if (monthKey) {
        const translatedMonth = t(`months.${monthKey}`);
        return `${translatedMonth} ${day}`;
      }
    }
    return dateStr;
  };

  // Transform data with translations
  const localizedTrendData = trendData.map(item => ({
    ...item,
    date: formatDateLabel(item.date),
  }));

  const localizedDistributionData = distributionData.map(item => ({
    ...item,
    category: translateCategory(item.category),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Chart 1: Trends Over Time */}
      <div className="group bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:shadow-2xl hover:border-[#8B1538]/20 transition-all duration-300 transform hover:-translate-y-1">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B1538] to-[#A61D45] flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#8B1538]/10 to-[#A61D45]/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-[#8B1538]" />
            </div>
            {t('trendsOverTime')}
          </h3>

          {/* Period Toggle */}
          <div className="flex gap-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 shadow-inner">
            {['week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-[#8B1538] to-[#A61D45] text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                {t(`period.${period}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={localizedTrendData}
            margin={{
              top: 20,
              right: isRTL ? 10 : 30,
              bottom: 100,
              left: isRTL ? 40 : 20
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B1538" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B1538" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              stroke="#6B7280"
              style={{
                fontSize: '10px',
                fontWeight: '600',
                fontFamily: isRTL ? 'Cairo, Tajawal, sans-serif' : 'inherit'
              }}
              tick={{ dy: 5 }}
              height={90}
              interval="preserveStartEnd"
              angle={-55}
              textAnchor="end"
            />
            <YAxis
              stroke="#6B7280"
              style={{
                fontSize: '12px',
                fontWeight: '700',
                fontFamily: isRTL ? 'Cairo, Tajawal, sans-serif' : 'inherit'
              }}
              width={60}
              tickFormatter={(value) => value.toLocaleString(locale)}
              orientation={isRTL ? 'right' : 'left'}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '2px solid #8B1538',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontWeight: 'bold',
              }}
              labelStyle={{ fontWeight: 'bold', color: '#000' }}
            />
            <Legend wrapperStyle={{ fontWeight: 'bold', paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8B1538"
              strokeWidth={3}
              fill="url(#colorValue)"
              dot={{ r: 5, fill: '#8B1538', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8 }}
              name={t('reportsGenerated')}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2: Distribution by Category */}
      <div className="group bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:shadow-2xl hover:border-[#8B1538]/20 transition-all duration-300 transform hover:-translate-y-1">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B1538] to-[#A61D45] flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#8B1538]/10 to-[#A61D45]/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-6 h-6 text-[#8B1538]" />
            </div>
            {t('distribution')}
          </h3>

          {/* Export Chart Button */}
          <button
            onClick={onExportChart}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#8B1538] to-[#A61D45] rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t('export')}
          </button>
        </div>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={localizedDistributionData}
            margin={{
              top: 20,
              right: isRTL ? 10 : 30,
              bottom: 110,
              left: isRTL ? 40 : 20
            }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B1538" />
                <stop offset="100%" stopColor="#A61D45" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="category"
              stroke="#6B7280"
              style={{
                fontSize: '10px',
                fontWeight: '600',
                fontFamily: isRTL ? 'Cairo, Tajawal, sans-serif' : 'inherit'
              }}
              angle={-55}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 10, dy: 5 }}
            />
            <YAxis
              stroke="#6B7280"
              style={{
                fontSize: '12px',
                fontWeight: '700',
                fontFamily: isRTL ? 'Cairo, Tajawal, sans-serif' : 'inherit'
              }}
              width={60}
              tickFormatter={(value) => value.toLocaleString(locale)}
              orientation={isRTL ? 'right' : 'left'}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '2px solid #8B1538',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontWeight: 'bold',
              }}
              labelStyle={{ fontWeight: 'bold', color: '#000' }}
            />
            <Legend wrapperStyle={{ fontWeight: '700', paddingTop: '20px' }} />
            <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} name={t('count')} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
