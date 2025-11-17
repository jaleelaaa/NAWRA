'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Search, Filter, BookOpen, X } from 'lucide-react';
import { browseCatalog, getCategories, createBookRequest } from '@/lib/api/patron';
import toast from 'react-hot-toast';

interface Book {
  id: string;
  title: string;
  title_ar?: string;
  author: string;
  author_ar?: string;
  isbn?: string;
  cover_image_url?: string;
  status: 'available' | 'borrowed' | 'reserved';
  category?: string;
  category_ar?: string;
  publication_year?: number;
}

interface Filters {
  search: string;
  status: string;
  category: string;
}

export default function BrowseCatalog() {
  const t = useTranslations('patron.catalog');
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; name_ar?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    category: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [requestingBookId, setRequestingBookId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadBooks();
  }, [page, filters.status, filters.category]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await browseCatalog({
        page,
        page_size: 12,
        search: filters.search || undefined,
        status: filters.status || undefined,
        category_id: filters.category || undefined,
      });

      setBooks(response.items || []);
      setTotalPages(response.total_pages || 1);
    } catch (error: any) {
      console.error('Failed to load books:', error);

      // Handle specific error types
      if (error instanceof Error) {
        const errorMessage = error.message;

        // Check for authentication errors
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          toast.error(t('errors.authError'));
          // Optionally redirect to login after a delay
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        }

        // Check for network errors
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
          toast.error(t('errors.networkError'));
          return;
        }
      }

      // Generic error message
      toast.error(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadBooks();
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleRequestBook = async (bookId: string, bookTitle: string) => {
    if (requestingBookId) return;

    try {
      setRequestingBookId(bookId);
      await createBookRequest({ book_id: bookId });
      toast.success(t('requestSuccess', { title: bookTitle }));
      loadBooks(); // Reload to update book status
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error(t('errors.alreadyRequested'));
      } else {
        toast.error(t('errors.requestFailed'));
      }
    } finally {
      setRequestingBookId(null);
    }
  };

  const clearFilters = () => {
    setFilters({ search: '', status: '', category: '' });
    setPage(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder={t('search.placeholder')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('search.button')}
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Filter className="h-5 w-5" />
            {t('filters.toggle')}
          </button>
        </form>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('filters.status')}
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{t('filters.allStatus')}</option>
                  <option value="available">{t('filters.available')}</option>
                  <option value="borrowed">{t('filters.borrowed')}</option>
                  <option value="reserved">{t('filters.reserved')}</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('filters.category')}
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{t('filters.allCategories')}</option>
                  {Array.isArray(categories) && categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                {t('filters.clear')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onRequest={() => handleRequestBook(book.id, book.title)}
                isRequesting={requestingBookId === book.id}
                t={t}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
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
          <p className="text-lg text-gray-600 dark:text-gray-400">{t('noBooksFound')}</p>
          {(filters.search || filters.status || filters.category) && (
            <button
              onClick={clearFilters}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('filters.clear')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Book Card Component
function BookCard({
  book,
  onRequest,
  isRequesting,
  t
}: {
  book: Book;
  onRequest: () => void;
  isRequesting: boolean;
  t: any;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'borrowed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Book Cover */}
      <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 relative">
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-gray-400" />
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
            {t(`status.${book.status}`)}
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
            {book.title}
          </h3>
          {book.title_ar && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2" dir="rtl">
              {book.title_ar}
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-1">
            {book.author}
          </p>
          {book.author_ar && (
            <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1 mb-2" dir="rtl">
              {book.author_ar}
            </p>
          )}
          {book.isbn && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
              ISBN: {book.isbn}
            </p>
          )}
          {book.category && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
              {book.category}
            </p>
          )}
        </div>

        {/* Request Button */}
        {book.status === 'available' ? (
          <button
            onClick={onRequest}
            disabled={isRequesting}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isRequesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t('requesting')}
              </>
            ) : (
              <>{t('requestBook')}</>
            )}
          </button>
        ) : (
          <button
            onClick={onRequest}
            disabled={isRequesting}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isRequesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t('requesting')}
              </>
            ) : (
              <>{t('joinWaitlist')}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
