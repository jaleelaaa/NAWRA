/**
 * Patron API Client
 *
 * API functions for patron self-service features:
 * - Profile management
 * - Loan viewing
 * - Book requests
 * - Personal statistics
 */

import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';
const API_BASE = `${API_BASE_URL}${API_PREFIX}`;

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  phone?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  role: {
    id: string;
    name: string;
    permissions: string[];
  };
}

export interface ProfileUpdate {
  full_name?: string;
  phone?: string;
  address?: string;
}

export interface PersonalStats {
  user_id: string;
  total_borrowed: number;
  active_loans: number;
  returned_books: number;
  overdue_books: number;
  borrowing_status: string;
  account_type: string;
}

export interface FineBreakdown {
  overdue_days: number;
  daily_rate: number;
  calculated_fine: number;
  capped_fine: number;
  fine_amount: number;
  is_capped: boolean;
  max_fine: number;
}

export interface Loan {
  id: string;
  user_id: string;
  user_name: string;
  book_id: string;
  book_title: string;
  book_title_ar?: string;
  author?: string;
  isbn?: string;
  cover_image_url?: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  status: 'active' | 'overdue' | 'returned';
  days_left: number;
  fine_amount?: number;
  fine_paid?: boolean;
  fine_breakdown?: FineBreakdown;
  book_condition?: string;
  notes?: string;
}

export interface LoansListResponse {
  items: Loan[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface BookRequest {
  id: string;
  user_id: string;
  book_id: string;
  book_title?: string;
  book_title_ar?: string;
  status: 'pending' | 'reserved' | 'fulfilled' | 'cancelled';
  request_date: string;
  expiry_date?: string;
  fulfilled_date?: string;
  cancelled_date?: string;
  notes?: string;
  books?: {
    id: string;
    title: string;
    title_ar?: string;
    author?: string;
    author_ar?: string;
    isbn?: string;
    cover_image_url?: string;
  };
}

export interface RequestsListResponse {
  items: BookRequest[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  message?: string;
}

export interface CreateRequestData {
  book_id: string;
  notes?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get authorization token from auth store
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  // Check for dev mode first (for local development)
  const devMode = localStorage.getItem('dev-mode');
  const devUserId = localStorage.getItem('dev-user-id');

  if (devMode === 'true' && devUserId) {
    // In dev mode, we'll use X-User-Id header instead
    return null;
  }

  // Get access token from auth store
  return useAuthStore.getState().accessToken;
}

/**
 * Create headers for API requests
 */
function getHeaders(): HeadersInit {
  const token = getAuthToken();

  // Check for dev mode
  if (typeof window !== 'undefined') {
    const devMode = localStorage.getItem('dev-mode');
    const devUserId = localStorage.getItem('dev-user-id');

    if (devMode === 'true' && devUserId) {
      return {
        'Content-Type': 'application/json',
        'X-User-Id': devUserId,
      };
    }
  }

  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// ============================================================================
// Profile API
// ============================================================================

/**
 * Get current user's profile
 */
export async function getMyProfile(): Promise<Profile> {
  const response = await fetch(`${API_BASE}/profile/me`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse<Profile>(response);
}

/**
 * Update current user's profile
 */
export async function updateMyProfile(data: ProfileUpdate): Promise<Profile> {
  const response = await fetch(`${API_BASE}/profile/me`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Profile>(response);
}

/**
 * Get current user's personal statistics
 */
export async function getMyStats(): Promise<PersonalStats> {
  const response = await fetch(`${API_BASE}/profile/me/stats`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse<PersonalStats>(response);
}

/**
 * Change password (requires current password)
 */
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/profile/me/change-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
  return handleResponse<{ message: string }>(response);
}

// ============================================================================
// Loans API
// ============================================================================

export interface LoansFilters {
  page?: number;
  page_size?: number;
  status?: 'active' | 'overdue' | 'returned';
  search?: string;
}

/**
 * Get current user's loans (uses circulation endpoint with auto-filtering)
 */
export async function getMyLoans(filters: LoansFilters = {}): Promise<LoansListResponse> {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page.toString());
  if (filters.page_size) params.append('page_size', filters.page_size.toString());
  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);

  const url = `${API_BASE}/circulation${params.toString() ? '?' + params.toString() : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse<LoansListResponse>(response);
}

/**
 * Get specific loan details
 */
export async function getLoanDetails(loanId: string): Promise<Loan> {
  const response = await fetch(`${API_BASE}/circulation/${loanId}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse<Loan>(response);
}

/**
 * Renew a loan (extend due date)
 */
export async function renewLoan(loanId: string): Promise<{
  message: string;
  record_id: string;
  new_due_date: string;
  renewals_remaining: number;
  total_renewals: number;
}> {
  const response = await fetch(`${API_BASE}/circulation/${loanId}/renew`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse(response);
}

// ============================================================================
// Book Requests API
// ============================================================================

export interface RequestsFilters {
  page?: number;
  page_size?: number;
  status_filter?: 'pending' | 'reserved' | 'fulfilled' | 'cancelled';
}

/**
 * Create a new book request
 */
export async function createBookRequest(data: CreateRequestData): Promise<BookRequest> {
  const response = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<BookRequest>(response);
}

/**
 * Get current user's book requests
 */
export async function getMyRequests(filters: RequestsFilters = {}): Promise<RequestsListResponse> {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page.toString());
  if (filters.page_size) params.append('page_size', filters.page_size.toString());
  if (filters.status_filter) params.append('status_filter', filters.status_filter);

  const url = `${API_BASE}/requests/my-requests${params.toString() ? '?' + params.toString() : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse<RequestsListResponse>(response);
}

/**
 * Cancel a book request
 */
export async function cancelBookRequest(requestId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/requests/${requestId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to cancel request' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
}

// ============================================================================
// Catalog API (Books - available to patrons)
// ============================================================================

export interface Book {
  id: string;
  title: string;
  title_ar?: string;
  author?: string;
  author_ar?: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  language?: string;
  pages?: number;
  description?: string;
  description_ar?: string;
  cover_image_url?: string;
  status: 'available' | 'borrowed' | 'reserved' | 'maintenance';
  category_id?: string;
  categories?: {
    id: string;
    name: string;
    name_ar?: string;
  };
  shelf_location?: string;
  acquisition_date?: string;
  price?: number;
  created_at: string;
}

export interface BooksListResponse {
  items: Book[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface BooksFilters {
  page?: number;
  page_size?: number;
  search?: string;
  category_id?: string;
  status?: string;
  language?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Browse catalog (search and filter books)
 */
export async function browseCatalog(filters: BooksFilters = {}): Promise<BooksListResponse> {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page.toString());
  if (filters.page_size) params.append('page_size', filters.page_size.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.category_id) params.append('category_id', filters.category_id);
  if (filters.status) params.append('status', filters.status);
  if (filters.language) params.append('language', filters.language);
  if (filters.sort_by) params.append('sort_by', filters.sort_by);
  if (filters.sort_order) params.append('sort_order', filters.sort_order);

  const url = `${API_BASE}/books${params.toString() ? '?' + params.toString() : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse<BooksListResponse>(response);
}

/**
 * Get book details by ID
 */
export async function getBookDetails(bookId: string): Promise<Book> {
  const response = await fetch(`${API_BASE}/books/${bookId}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse<Book>(response);
}

/**
 * Get categories for filtering
 */
export async function getCategories(): Promise<Array<{ id: string; name: string; name_ar?: string }>> {
  const response = await fetch(`${API_BASE}/categories`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse<Array<{ id: string; name: string; name_ar?: string }>>(response);
}
