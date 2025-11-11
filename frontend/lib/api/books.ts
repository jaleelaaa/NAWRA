/**
 * Books/Catalog API Service
 *
 * Book catalog management API endpoints
 */

import apiClient from './client';
import {
  Book,
  BookDetail,
  BookFilters,
  BookCategory,
  CreateBookRequest,
  UpdateBookRequest,
  PaginatedResponse,
} from './types';

/**
 * Get all books with filters and pagination
 */
export const getBooks = async (filters?: BookFilters): Promise<PaginatedResponse<Book>> => {
  const response = await apiClient.get<PaginatedResponse<Book>>('/books', {
    params: filters,
  });
  return response.data;
};

/**
 * Get book by ID
 */
export const getBookById = async (bookId: string): Promise<BookDetail> => {
  const response = await apiClient.get<BookDetail>(`/books/${bookId}`);
  return response.data;
};

/**
 * Create new book
 */
export const createBook = async (bookData: CreateBookRequest): Promise<BookDetail> => {
  const response = await apiClient.post<BookDetail>('/books', bookData);
  return response.data;
};

/**
 * Update book
 */
export const updateBook = async (
  bookId: string,
  bookData: UpdateBookRequest
): Promise<BookDetail> => {
  const response = await apiClient.put<BookDetail>(`/books/${bookId}`, bookData);
  return response.data;
};

/**
 * Delete book
 */
export const deleteBook = async (bookId: string): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/books/${bookId}`);
  return response.data;
};

/**
 * Search books
 */
export const searchBooks = async (query: string): Promise<Book[]> => {
  const response = await apiClient.get<Book[]>('/books/search', {
    params: { q: query },
  });
  return response.data;
};

/**
 * Get book categories
 */
export const getBookCategories = async (): Promise<BookCategory[]> => {
  const response = await apiClient.get<BookCategory[]>('/books/categories');
  return response.data;
};

/**
 * Get book statistics
 */
export const getBookStats = async (): Promise<{
  total_books: number;
  total_copies: number;
  available_copies: number;
  borrowed_copies: number;
  reserved_copies: number;
}> => {
  const response = await apiClient.get('/books/stats');
  return response.data;
};

/**
 * Upload book cover image
 */
export const uploadBookCover = async (
  bookId: string,
  file: File
): Promise<{ cover_url: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post(`/books/${bookId}/cover`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Bulk import books from CSV
 */
export const bulkImportBooks = async (file: File): Promise<{
  success_count: number;
  error_count: number;
  errors: string[];
}> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/books/bulk-import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Bulk delete books
 */
export const bulkDeleteBooks = async (bookIds: string[]): Promise<{ message: string }> => {
  const response = await apiClient.post('/books/bulk-delete', { book_ids: bookIds });
  return response.data;
};

/**
 * Export books to CSV/Excel
 */
export const exportBooks = async (
  filters?: BookFilters,
  format: 'csv' | 'excel' = 'csv'
): Promise<Blob> => {
  const response = await apiClient.get('/books/export', {
    params: { ...filters, format },
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Check book availability
 */
export const checkBookAvailability = async (
  bookId: string
): Promise<{ available: boolean; available_copies: number; next_available_date?: string }> => {
  const response = await apiClient.get(`/books/${bookId}/availability`);
  return response.data;
};
