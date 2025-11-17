/**
 * Circulation API Service
 *
 * Circulation management API endpoints (loans, returns, reservations, fines)
 */

import apiClient from './client';
import {
  Loan,
  Reservation,
  Fine,
  CirculationFilters,
  CheckoutRequest,
  CheckinRequest,
  RenewRequest,
  ReservationRequest,
  PaginatedResponse,
} from './types';

// ============================================================================
// Loans/Borrowing
// ============================================================================

/**
 * Get all loans with filters
 */
export const getLoans = async (
  filters?: CirculationFilters
): Promise<PaginatedResponse<Loan>> => {
  const response = await apiClient.get<PaginatedResponse<Loan>>('/circulation/loans', {
    params: filters,
  });
  return response.data;
};

/**
 * Get loan by ID
 */
export const getLoanById = async (loanId: string): Promise<Loan> => {
  const response = await apiClient.get<Loan>(`/circulation/loans/${loanId}`);
  return response.data;
};

/**
 * Checkout book (create loan)
 */
export const checkoutBook = async (checkoutData: CheckoutRequest): Promise<Loan> => {
  const response = await apiClient.post<Loan>('/circulation/checkout', checkoutData);
  return response.data;
};

/**
 * Checkin book (return loan)
 */
export const checkinBook = async (checkinData: CheckinRequest): Promise<Loan> => {
  const response = await apiClient.post<Loan>('/circulation/checkin', checkinData);
  return response.data;
};

/**
 * Renew loan
 */
export const renewLoan = async (renewData: RenewRequest): Promise<Loan> => {
  const response = await apiClient.post<Loan>('/circulation/renew', renewData);
  return response.data;
};

/**
 * Get overdue loans
 */
export const getOverdueLoans = async (): Promise<Loan[]> => {
  const response = await apiClient.get<Loan[]>('/circulation/overdue');
  return response.data;
};

/**
 * Get user's active loans
 */
export const getUserLoans = async (userId: string): Promise<Loan[]> => {
  const response = await apiClient.get<Loan[]>(`/circulation/users/${userId}/loans`);
  return response.data;
};

// ============================================================================
// Reservations/Holds
// ============================================================================

/**
 * Get all reservations with filters
 */
export const getReservations = async (
  filters?: CirculationFilters
): Promise<PaginatedResponse<Reservation>> => {
  const response = await apiClient.get<PaginatedResponse<Reservation>>(
    '/circulation/reservations',
    {
      params: filters,
    }
  );
  return response.data;
};

/**
 * Get reservation by ID
 */
export const getReservationById = async (reservationId: string): Promise<Reservation> => {
  const response = await apiClient.get<Reservation>(
    `/circulation/reservations/${reservationId}`
  );
  return response.data;
};

/**
 * Create reservation
 */
export const createReservation = async (
  reservationData: ReservationRequest
): Promise<Reservation> => {
  const response = await apiClient.post<Reservation>(
    '/circulation/reservations',
    reservationData
  );
  return response.data;
};

/**
 * Cancel reservation
 */
export const cancelReservation = async (
  reservationId: string
): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/circulation/reservations/${reservationId}`);
  return response.data;
};

/**
 * Fulfill reservation (convert to loan)
 */
export const fulfillReservation = async (reservationId: string): Promise<Loan> => {
  const response = await apiClient.post<Loan>(
    `/circulation/reservations/${reservationId}/fulfill`
  );
  return response.data;
};

/**
 * Get user's active reservations
 */
export const getUserReservations = async (userId: string): Promise<Reservation[]> => {
  const response = await apiClient.get<Reservation[]>(
    `/circulation/users/${userId}/reservations`
  );
  return response.data;
};

// ============================================================================
// Fines
// ============================================================================

/**
 * Get all fines with filters
 */
export const getFines = async (
  filters?: CirculationFilters
): Promise<PaginatedResponse<Fine>> => {
  const response = await apiClient.get<PaginatedResponse<Fine>>('/circulation/fines', {
    params: filters,
  });
  return response.data;
};

/**
 * Get fine by ID
 */
export const getFineById = async (fineId: string): Promise<Fine> => {
  const response = await apiClient.get<Fine>(`/circulation/fines/${fineId}`);
  return response.data;
};

/**
 * Get user's fines
 */
export const getUserFines = async (userId: string): Promise<Fine[]> => {
  const response = await apiClient.get<Fine[]>(`/circulation/users/${userId}/fines`);
  return response.data;
};

/**
 * Pay fine
 */
export const payFine = async (fineId: string): Promise<Fine> => {
  const response = await apiClient.post<Fine>(`/circulation/fines/${fineId}/pay`);
  return response.data;
};

/**
 * Waive fine
 */
export const waiveFine = async (fineId: string): Promise<Fine> => {
  const response = await apiClient.post<Fine>(`/circulation/fines/${fineId}/waive`);
  return response.data;
};

/**
 * Collect all fines from a user
 */
export const collectUserFines = async (userId: string): Promise<{
  user_id: string;
  total_collected: number;
  records_updated: number;
  message: string;
}> => {
  const response = await apiClient.post(`/circulation/fines/collect/${userId}`);
  return response.data;
};

// ============================================================================
// Statistics
// ============================================================================

/**
 * Get circulation statistics
 */
export const getCirculationStats = async (): Promise<{
  active_loans: number;
  overdue_loans: number;
  pending_reservations: number;
  unpaid_fines: number;
  total_fine_amount: number;
}> => {
  const response = await apiClient.get('/circulation/stats');
  return response.data;
};
