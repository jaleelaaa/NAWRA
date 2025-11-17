'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import Breadcrumb from '@/components/Breadcrumb';
import ReportStatsCards from '@/components/reports/ReportStatsCards';
import ReportTypeSelector from '@/components/reports/ReportTypeSelector';
import ReportFilters from '@/components/reports/ReportFilters';
import ReportCharts from '@/components/reports/ReportCharts';
import ReportSummaryTable from '@/components/reports/ReportSummaryTable';
import type { ReportType } from '@/lib/types/reports';
import {
  getReportsDashboardStats,
  getReportTrends,
  getReportDistribution,
  getReportSummary,
} from '@/lib/api/reports';

export default function ReportsPage() {
  const t = useTranslations('reports');
  const tn = useTranslations('nav');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [selectedReportType, setSelectedReportType] = useState<ReportType>('collection');
  const [filters, setFilters] = useState({
    dateRange: { from: '', to: '' },
    status: 'all',
    category: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['reports', 'dashboard'],
    queryFn: getReportsDashboardStats,
    staleTime: 60000, // 1 minute
  });

  // Fetch trend data
  const { data: trendsData, isLoading: trendsLoading } = useQuery({
    queryKey: ['reports', 'trends', period],
    queryFn: () => getReportTrends(period),
    staleTime: 60000,
  });

  // Fetch distribution data
  const { data: distributionData, isLoading: distributionLoading } = useQuery({
    queryKey: ['reports', 'distribution'],
    queryFn: getReportDistribution,
    staleTime: 300000, // 5 minutes
  });

  // Fetch summary data
  const {
    data: summaryData,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ['reports', 'summary', currentPage, filters.category, filters.status],
    queryFn: () =>
      getReportSummary(currentPage, 8, filters.category, filters.status),
    staleTime: 30000, // 30 seconds
  });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleGenerateReport = () => {
    console.log('Generating report for:', selectedReportType, 'with filters:', filters);
    refetchSummary();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportChart = () => {
    console.log('Exporting chart data...');
    // TODO: Implement chart export functionality
  };

  const handleExportTable = () => {
    console.log('Exporting table data...');
    // TODO: Implement table export functionality
  };

  const handleDownloadReport = () => {
    console.log('Downloading all reports...');
    // TODO: Implement download all functionality
  };

  const handleViewReport = (id: number) => {
    console.log('Viewing report:', id);
    // TODO: Implement view report functionality
  };

  const handleDownloadSingleReport = (id: number) => {
    console.log('Downloading report:', id);
    // TODO: Implement download single report functionality
  };

  const handleDeleteReport = (id: number) => {
    console.log('Deleting report:', id);
    // TODO: Implement delete report functionality
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] via-[#FAF8F3] to-[#F5F1E8] p-6 sm:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-[1600px] mx-auto space-y-8">
          {/* Breadcrumb */}
          <div className="animate-fadeIn">
            <Breadcrumb
              items={[
                { label: tn('dashboard'), href: '/dashboard' },
                { label: t('breadcrumb') }
              ]}
            />
          </div>

          {/* Page Header */}
          <div className="space-y-3 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B1538] to-[#A61D45]">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              {t('subtitle')}
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-[#8B1538] to-[#A61D45] rounded-full"></div>
          </div>

          {/* Statistics Cards */}
          <section
            aria-label={locale === 'ar' ? 'إحصائيات التقارير' : 'Reports statistics'}
            className="animate-fadeIn"
            style={{ animationDelay: '0.2s' }}
          >
            <ReportStatsCards stats={dashboardStats} isLoading={statsLoading} />
          </section>

          {/* Report Type Selector */}
          <section
            aria-label={locale === 'ar' ? 'اختيار نوع التقرير' : 'Report type selection'}
            className="animate-fadeIn"
            style={{ animationDelay: '0.3s' }}
          >
            <ReportTypeSelector
              selectedType={selectedReportType}
              onSelectType={setSelectedReportType}
            />
          </section>

          {/* Filters Section */}
          <section
            aria-label={locale === 'ar' ? 'فلاتر التقارير' : 'Report filters'}
            className="animate-fadeIn"
            style={{ animationDelay: '0.4s' }}
          >
            <ReportFilters
              onFiltersChange={handleFiltersChange}
              onGenerate={handleGenerateReport}
              isLoading={summaryLoading}
            />
          </section>

          {/* Charts Section */}
          <section
            aria-label={locale === 'ar' ? 'رسوم بيانية' : 'Charts'}
            className="animate-fadeIn"
            style={{ animationDelay: '0.5s' }}
          >
            <ReportCharts
              trendData={trendsData?.data}
              distributionData={distributionData?.data}
              onExportChart={handleExportChart}
            />
          </section>

          {/* Summary Table */}
          <section
            aria-label={locale === 'ar' ? 'ملخص التقارير' : 'Report summary'}
            className="animate-fadeIn"
            style={{ animationDelay: '0.6s' }}
          >
            <ReportSummaryTable
              items={summaryData?.items}
              totalItems={summaryData?.total}
              currentPage={currentPage}
              itemsPerPage={8}
              onPageChange={handlePageChange}
              onView={handleViewReport}
              onDownload={handleDownloadSingleReport}
              onDelete={handleDeleteReport}
              onExportTable={handleExportTable}
              onDownloadAll={handleDownloadReport}
              isLoading={summaryLoading}
            />
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
