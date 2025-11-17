'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileText, Calendar, BookOpen, XCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getMyRequests, cancelBookRequest } from '@/lib/api/patron';
import toast from 'react-hot-toast';

interface BookRequest {
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
  status: 'pending' | 'reserved' | 'fulfilled' | 'cancelled';
  request_date: string;
  expiry_date?: string;
  fulfilled_date?: string;
  cancelled_date?: string;
  notes?: string;
}

export default function MyRequests() {
  const t = useTranslations('patron.requests');
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, [statusFilter, page]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await getMyRequests({
        page,
        page_size: 10,
        status: statusFilter || undefined,
      });

      setRequests(response.items || []);
      setTotalPages(response.total_pages || 1);
    } catch (error) {
      console.error('Failed to load requests:', error);
      toast.error(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string, bookTitle: string) => {
    if (!confirm(t('confirmCancel', { title: bookTitle }))) {
      return;
    }

    try {
      setCancellingId(requestId);
      await cancelBookRequest(requestId);
      toast.success(t('cancelSuccess'));
      loadRequests(); // Reload the list
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(t('errors.cannotCancel'));
      } else {
        toast.error(t('errors.cancelFailed'));
      }
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {t('status.pending')}
          </span>
        );
      case 'reserved':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {t('status.reserved')}
          </span>
        );
      case 'fulfilled':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {t('status.fulfilled')}
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            {t('status.cancelled')}
          </span>
        );
      default:
        return null;
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = {
    pending: requests.filter((r) => r.status === 'pending').length,
    reserved: requests.filter((r) => r.status === 'reserved').length,
    fulfilled: requests.filter((r) => r.status === 'fulfilled').length,
    cancelled: requests.filter((r) => r.status === 'cancelled').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">{t('stats.pending')}</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">{t('stats.reserved')}</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{stats.reserved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t('stats.fulfilled')}</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{stats.fulfilled}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('stats.cancelled')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.cancelled}</p>
            </div>
            <XCircle className="h-8 w-8 text-gray-500" />
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
          <option value="">{t('allRequests')}</option>
          <option value="pending">{t('status.pending')}</option>
          <option value="reserved">{t('status.reserved')}</option>
          <option value="fulfilled">{t('status.fulfilled')}</option>
          <option value="cancelled">{t('status.cancelled')}</option>
        </select>
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : requests.length > 0 ? (
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
                      {t('table.requestDate')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.expiryDate')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.notes')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-12 w-9 bg-gray-200 dark:bg-gray-700 rounded">
                            {request.books.cover_image_url ? (
                              <img
                                src={request.books.cover_image_url}
                                alt={request.books.title}
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
                              {request.books.title}
                            </p>
                            {request.books.title_ar && (
                              <p className="text-xs text-gray-600 dark:text-gray-400" dir="rtl">
                                {request.books.title_ar}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {request.books.author}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(request.request_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {request.expiry_date ? (
                          <div>
                            {new Date(request.expiry_date).toLocaleDateString()}
                            {request.status === 'reserved' && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {getDaysUntilExpiry(request.expiry_date) > 0 ? (
                                  <>
                                    {getDaysUntilExpiry(request.expiry_date) <= 2 && (
                                      <AlertCircle className="inline h-3 w-3 text-orange-500 mr-1" />
                                    )}
                                    {t('daysRemaining', { days: getDaysUntilExpiry(request.expiry_date) })}
                                  </>
                                ) : (
                                  <span className="text-red-600">{t('expired')}</span>
                                )}
                              </p>
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {request.notes ? (
                          <span className="line-clamp-2">{request.notes}</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {(request.status === 'pending' || request.status === 'reserved') && (
                          <button
                            onClick={() => handleCancelRequest(request.id, request.books.title)}
                            disabled={cancellingId === request.id}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingId === request.id ? t('cancelling') : t('cancelRequest')}
                          </button>
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
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">{t('noRequests')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{t('noRequestsSubtitle')}</p>
        </div>
      )}
    </div>
  );
}
