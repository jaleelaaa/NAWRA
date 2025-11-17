'use client';

import React, { useState } from 'react';
import { Eye, Download, Trash2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface ReportSummaryItem {
  id: number;
  report_name: string;
  category: string;
  date_generated: string;
  status: string;
}

interface ReportSummaryTableProps {
  items?: ReportSummaryItem[];
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onView?: (id: number) => void;
  onDownload?: (id: number) => void;
  onDelete?: (id: number) => void;
  onExportTable?: () => void;
  onDownloadAll?: () => void;
  isLoading?: boolean;
}

const defaultReportData = [
  {
    id: 1,
    report_name: 'Monthly Circulation',
    category: 'circulation',
    date_generated: '2025-03-15T10:30:00Z',
    status: 'completed',
  },
  {
    id: 2,
    report_name: 'User Engagement Q1',
    category: 'user_activity',
    date_generated: '2025-03-10T14:20:00Z',
    status: 'completed',
  },
  {
    id: 3,
    report_name: 'Collection Audit',
    category: 'collection',
    date_generated: '2025-03-20T09:15:00Z',
    status: 'pending',
  },
  {
    id: 4,
    report_name: 'Financial Summary',
    category: 'financial',
    date_generated: '2025-03-05T16:45:00Z',
    status: 'completed',
  },
  {
    id: 5,
    report_name: 'System Overview',
    category: 'overview',
    date_generated: '2025-03-18T11:00:00Z',
    status: 'completed',
  },
  {
    id: 6,
    report_name: 'Branch Performance',
    category: 'circulation',
    date_generated: '2025-03-12T13:30:00Z',
    status: 'pending',
  },
  {
    id: 7,
    report_name: 'User Demographics',
    category: 'user_activity',
    date_generated: '2025-03-08T10:00:00Z',
    status: 'completed',
  },
  {
    id: 8,
    report_name: 'Collection Gap Analysis',
    category: 'collection',
    date_generated: '2025-03-01T15:20:00Z',
    status: 'completed',
  },
];

export default function ReportSummaryTable({
  items = defaultReportData,
  totalItems,
  currentPage: propCurrentPage = 1,
  itemsPerPage = 8,
  onPageChange,
  onView,
  onDownload,
  onDelete,
  onExportTable,
  onDownloadAll,
  isLoading = false,
}: ReportSummaryTableProps) {
  const t = useTranslations('reports.table');
  const tr = useTranslations('reports.reportNames');
  const tc = useTranslations('reports.categories');
  const ts = useTranslations('reports.statuses');
  const tMonths = useTranslations('reports.charts.months');
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState(propCurrentPage);

  const total = totalItems || items.length;
  const totalPages = Math.ceil(total / itemsPerPage);

  const getTranslatedReportName = (reportName: string) => {
    const nameMap: Record<string, string> = {
      'Monthly Circulation': 'monthlyCirculation',
      'User Engagement Q1': 'userEngagementQ1',
      'Collection Audit': 'collectionAudit',
      'Financial Summary': 'financialSummary',
      'System Overview': 'systemOverview',
      'Branch Performance': 'branchPerformance',
      'User Demographics': 'userDemographics',
      'Collection Gap Analysis': 'collectionGapAnalysis',
    };

    const translationKey = nameMap[reportName];
    return translationKey ? tr(translationKey) : reportName;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    if (locale === 'ar') {
      // Use Arabic month names from translations
      const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthName = tMonths(monthKeys[month]);
      return `${day} ${monthName}، ${year}`;
    } else {
      // Use English formatting
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getCategoryDisplay = (category: string) => {
    const categoryMap: Record<string, string> = {
      circulation: 'circulation',
      user_activity: 'userActivity',
      collection: 'collection',
      financial: 'financial',
      overview: 'overview',
    };
    const translationKey = categoryMap[category];
    return translationKey ? tc(translationKey) : category;
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: 'completed',
      pending: 'pending',
      active: 'active',
    };
    const translationKey = statusMap[status];
    return translationKey ? ts(translationKey) : status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="group bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:shadow-2xl hover:border-[#8B1538]/20 transition-all duration-300">
      {/* Table Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B1538] to-[#A61D45] flex items-center gap-3 rtl:flex-row-reverse">
          <div className="p-2 bg-gradient-to-br from-[#8B1538]/10 to-[#A61D45]/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <FileText className="w-6 h-6 text-[#8B1538]" />
          </div>
          {t('title')}
        </h3>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onExportTable}
            className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-white bg-white hover:bg-gradient-to-r hover:from-[#8B1538] hover:to-[#A61D45] border-2 border-gray-200 hover:border-transparent rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t('exportTable')}
          </button>
          <button
            onClick={onDownloadAll}
            className="px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-[#8B1538] to-[#A61D45] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t('downloadReport')}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border-2 border-gray-100">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
            <tr>
              <th className="px-6 py-4 text-left rtl:text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t('id')}
              </th>
              <th className="px-6 py-4 text-left rtl:text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t('name')}
              </th>
              <th className="px-6 py-4 text-left rtl:text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t('category')}
              </th>
              <th className="px-6 py-4 text-left rtl:text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t('date')}
              </th>
              <th className="px-6 py-4 text-left rtl:text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t('status')}
              </th>
              <th className="px-6 py-4 text-left rtl:text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: itemsPerPage }).map((_, i) => (
                <tr key={i} className={`animate-pulse ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                  <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                  <td className="px-6 py-5"><div className="h-7 bg-gray-200 rounded-full w-24"></div></td>
                  <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-6 py-5"><div className="h-7 bg-gray-200 rounded-full w-20"></div></td>
                  <td className="px-6 py-5"><div className="h-8 bg-gray-200 rounded w-24"></div></td>
                </tr>
              ))
            ) : (
              items.map((report, index) => (
                <tr key={report.id} className={`group transition-all duration-200 ${index % 2 === 0 ? 'bg-white hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50' : 'bg-gray-50/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'}`}>
                  <td className="px-6 py-5 text-sm text-gray-900 font-bold">#{report.id}</td>
                  <td className="px-6 py-5 text-sm text-gray-900 font-medium">{getTranslatedReportName(report.report_name)}</td>
                  <td className="px-6 py-5 text-sm">
                    <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                      {getCategoryDisplay(report.category)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700 font-medium">{formatDate(report.date_generated)}</td>
                  <td className="px-6 py-5 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                        report.status === 'completed'
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                          : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700'
                      }`}
                    >
                      {getStatusDisplay(report.status)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 rtl:flex-row-reverse">
                      <button
                        onClick={() => onView?.(report.id)}
                        className="p-2 hover:bg-blue-500 hover:text-white bg-blue-100 text-blue-600 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDownload?.(report.id)}
                        className="p-2 hover:bg-green-500 hover:text-white bg-green-100 text-green-600 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(report.id)}
                        className="p-2 hover:bg-red-500 hover:text-white bg-red-100 text-red-600 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {t('showingResults', {
            start: (currentPage - 1) * itemsPerPage + 1,
            end: Math.min(currentPage * itemsPerPage, total),
            total: total
          })}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === i + 1
                  ? 'bg-[#8B1538] text-white'
                  : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
