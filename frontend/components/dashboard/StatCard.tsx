"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Book, BookOpen, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  iconName: 'users' | 'book' | 'book-open' | 'alert-circle';
  color: string;
  bgColor: string;
  sparklineData?: Array<{ value: number }>;
  subtitle?: string;
  locale?: string;
}

export default function StatCard({
  title,
  value,
  change,
  trend,
  iconName,
  color,
  bgColor,
  sparklineData,
  subtitle,
  locale,
}: StatCardProps) {
  const isRTL = locale === 'ar';
  // Get the icon component based on the icon name
  const getIcon = () => {
    switch (iconName) {
      case 'users':
        return Users;
      case 'book':
        return Book;
      case 'book-open':
        return BookOpen;
      case 'alert-circle':
        return AlertCircle;
      default:
        return Users;
    }
  };

  const Icon = getIcon();
  // Convert Tailwind color class to hex color
  const getHexColor = (tailwindColor: string) => {
    const colorMap: { [key: string]: string } = {
      'text-blue-600': '#3B82F6',
      'text-green-600': '#10B981',
      'text-purple-600': '#8B5CF6',
      'text-red-600': '#EF4444',
    };
    return colorMap[tailwindColor] || '#3B82F6';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4" style={{ borderLeftColor: getHexColor(color) }}>
      <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2">
        <CardTitle className="text-xs md:text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-1.5 md:p-2 rounded-lg ${bgColor} transition-transform hover:scale-110 duration-300`}>
          <Icon className={`h-4 w-4 md:h-5 md:w-5 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 md:space-y-2">
          {/* Main Value */}
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold text-gray-900 animate-fadeIn">{value}</div>
            {change && (
              <div
                className={`flex items-center text-xs md:text-sm font-medium ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend === 'up' ? (
                  <TrendingUp className={`h-3 w-3 md:h-4 md:w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                ) : (
                  <TrendingDown className={`h-3 w-3 md:h-4 md:w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                )}
                {change}
              </div>
            )}
          </div>

          {/* Sparkline Chart */}
          {sparklineData && sparklineData.length > 0 && (
            <div className="h-6 md:h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getHexColor(color)}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Subtitle - Hidden for space optimization */}
          {subtitle && (
            <p className="hidden text-xs text-gray-500 line-clamp-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
