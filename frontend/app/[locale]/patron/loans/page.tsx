'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BookOpen, Calendar, AlertCircle, CheckCircle, RefreshCw, Info } from 'lucide-react';
import { getMyLoans, renewLoan } from '@/lib/api/patron';
import toast from 'react-hot-toast';

interface FineBreakdown {
  overdue_days: number;
  daily_rate: number;
  calculated_fine: number;
  capped_fine: number;
  fine_amount: number;
  is_capped: boolean;
  max_fine: number;
}

interface Loan {
  id: string;
  book_id: string;
  books: {
    title: string;
    title_ar?: string;
    author: string;
    author_ar?: string;
    isbn?: string;
    cover_image_url?: string;
  };
  checkout_date: string;
  due_date: string;
  return_date?: string;
  status: 'active' | 'overdue' | 'returned';
  fine_amount?: number;
  fine_breakdown?: FineBreakdown;
  renewal_count?: number;
  max_renewals?: number;
}

export default function MyLoans() {
  const t = useTranslations('patron.loans');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadLoans();
  }, [statusFilter, page]);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const response = await getMyLoans({
        page,
        page_size: 10,
        status: statusFilter || undefined,
      });

      setLoans(response.items || []);
      setTotalPages(response.total_pages || 1);
    } catch (error) {
      console.error('Failed to load loans:', error);
      toast.error(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (loanId: string) => {
    try {
      setRenewingId(loanId);
      const result = await renewLoan(loanId);

      const newDueDate = new Date(result.new_due_date).toLocaleDateString();
      toast.success(t('renewSuccess', { date: newDueDate }));

      // Reload loans to show updated data
      await loadLoans();
    } catch (error: any) {
      console.error('Failed to renew loan:', error);
      toast.error(error.message || t('errors.renewFailed'));
    } finally {
      setRenewingId(null);
    }
  };

  const canRenew = (loan: Loan): boolean => {
    // Can only renew active loans
    if (loan.status !== 'active') return false;

    // Cannot renew overdue loans
    if (getDaysRemaining(loan.due_date) < 0) return false;

    // Check renewal limit (default max is 2)
    const maxRenewals = loan.max_renewals || 2;
    const currentRenewals = loan.renewal_count || 0;

    return currentRenewals < maxRenewals;
  };

  const getRenewalInfo = (loan: Loan): string => {
    const maxRenewals = loan.max_renewals || 2;
    const currentRenewals = loan.renewal_count || 0;
    const remaining = maxRenewals - currentRenewals;

    if (remaining <= 0) {
      return t('maxRenewalsReached');
    }

    return t('renewalsRemaining', { count: remaining });
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (loan: Loan) => {
    if (loan.status === 'returned') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {t('status.returned')}
        </span>
      );
    }

    if (loan.status === 'overdue') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {t('status.overdue')}
        </span>
      );
    }

    const daysRemaining = getDaysRemaining(loan.due_date);
    if (daysRemaining <= 3) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {t('status.dueSoon')}
        </span>
      );
    }

    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
        {t('status.active')}
      </span>
    );
  };

  const stats = {
    active: loans.filter((l) => l.status === 'active').length,
    overdue: loans.filter((l) => l.status === 'overdue').length,
    returned: loans.filter((l) => l.status === 'returned').length,
  };

  const renderFineCell = (loan: Loan) => {
    if (!loan.fine_amount || loan.fine_amount === 0) {
      return <span className="text-gray-500 dark:text-gray-500">-</span>;
    }

    // If we have fine breakdown, show detailed tooltip
    if (loan.fine_breakdown) {
      const breakdown = loan.fine_breakdown;
      return (
        <div className="group relative">
          <div className="flex items-center gap-1">
            <span className="font-medium text-red-600 dark:text-red-400">
              {breakdown.fine_amount.toFixed(3)} OMR
            </span>
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
          </div>

          {/* Tooltip */}
          <div className="invisible group-hover:visible absolute z-10 left-0 top-full mt-2 w-64 p-3 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg">
            <div className="space-y-2">
              <div className="font-semibold border-b border-gray-700 dark:border-gray-600 pb-2">
                {t('fineBreakdown.title')}
              </div>
              <div className="flex justify-between">
                <span>{t('fineBreakdown.overdueDays')}:</span>
                <span className="font-medium">{breakdown.overdue_days} {t('fineBreakdown.days')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('fineBreakdown.dailyRate')}:</span>
                <span className="font-medium">{breakdown.daily_rate.toFixed(3)} OMR</span>
              </div>
              <div className="flex justify-between">
                <span>{t('fineBreakdown.calculation')}:</span>
                <span className="font-medium">{breakdown.calculated_fine.toFixed(3)} OMR</span>
              </div>
              {breakdown.is_capped && (
                <div className="pt-2 border-t border-gray-700 dark:border-gray-600">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <AlertCircle className="h-3 w-3" />
                    <span className="text-xs">{t('fineBreakdown.cappedAt', { max: breakdown.max_fine })}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-700 dark:border-gray-600">
                <span className="font-semibold">{t('fineBreakdown.totalFine')}:</span>
                <span className="font-bold text-red-400">{breakdown.fine_amount.toFixed(3)} OMR</span>
              </div>
              {loan.fine_paid && (
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 text-green-400">
                    <CheckCircle className="h-3 w-3" />
                    {t('fineBreakdown.paid')}
                  </span>
                </div>
              )}
            </div>
            {/* Arrow */}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45"></div>
          </div>
        </div>
      );
    }

    // Fallback: show only amount without breakdown
    return (
      <span className="font-medium text-red-600 dark:text-red-400">
        {loan.fine_amount.toFixed(3)} OMR
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t('stats.active')}</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{stats.active}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{t('stats.overdue')}</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">{stats.overdue}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">{t('stats.returned')}</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{stats.returned}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('filterByStatus')}:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">{t('allLoans')}</option>
          <option value="active">{t('status.active')}</option>
          <option value="overdue">{t('status.overdue')}</option>
          <option value="returned">{t('status.returned')}</option>
        </select>
      </div>

      {/* Loans Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : loans.length > 0 ? (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.book')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.checkoutDate')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.dueDate')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.returnDate')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.fine')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-12 w-9 bg-gray-200 dark:bg-gray-700 rounded">
                            {loan.books.cover_image_url ? (
                              <img
                                src={loan.books.cover_image_url}
                                alt={loan.books.title}
                                className="h-full w-full object-cover rounded"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {loan.books.title}
                            </p>
                            {loan.books.title_ar && (
                              <p className="text-xs text-gray-600 dark:text-gray-400" dir="rtl">
                                {loan.books.title_ar}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {loan.books.author}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(loan.checkout_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(loan.due_date).toLocaleDateString()}
                          {loan.status === 'active' && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {getDaysRemaining(loan.due_date) > 0
                                ? t('daysRemaining', { days: getDaysRemaining(loan.due_date) })
                                : t('dueToday')}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {loan.return_date ? new Date(loan.return_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(loan)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {renderFineCell(loan)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {canRenew(loan) ? (
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleRenew(loan.id)}
                              disabled={renewingId === loan.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                            >
                              <RefreshCw className={`h-3 w-3 ${renewingId === loan.id ? 'animate-spin' : ''}`} />
                              {renewingId === loan.id ? t('renewing') : t('renew')}
                            </button>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {getRenewalInfo(loan)}
                            </span>
                          </div>
                        ) : loan.status === 'overdue' ? (
                          <span className="text-xs text-red-600 dark:text-red-400">
                            {t('cannotRenewOverdue')}
                          </span>
                        ) : loan.status === 'active' ? (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {t('maxRenewalsReached')}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {t('pagination.previous')}
              </button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                {t('pagination.pageInfo', { current: page, total: totalPages })}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {t('pagination.next')}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">{t('noLoans')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{t('noLoansSubtitle')}</p>
        </div>
      )}
    </div>
  );
}
