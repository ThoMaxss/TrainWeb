import { apiFetch } from './config';
import { BookingDto, BookingStatus } from '@/types';

// Booking endpoints based on backend documentation

// GET /api/booking - Get all bookings
export async function getAllBookings(): Promise<BookingDto[]> {
  return apiFetch<BookingDto[]>('/Booking');
}

// GET /api/booking/{id} - Get booking by ID
export async function getBookingById(id: string): Promise<BookingDto> {
  console.log(`[Booking API] Fetching booking with ID: ${id}`);
  try {
    const result = await apiFetch<BookingDto>(`/Booking/${id}`);
    console.log(`[Booking API] Successfully fetched booking:`, result);
    return result;
  } catch (error) {
    console.error(`[Booking API] Failed to fetch booking ${id}:`, error);
    throw error;
  }
}

// POST /api/booking - Create booking
export async function createBooking(bookingData: BookingDto): Promise<BookingDto> {
  return apiFetch<BookingDto>('/Booking', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

// POST /api/Booking/{id}/success-booking - Mark booking as paid
export async function successBooking(id: string): Promise<void> {
  return apiFetch<void>(`/Booking/${id}/success-booking`, {
    method: 'POST',
  });
}

// POST /api/Booking/{id}/cancel-booking - Cancel booking
export async function cancelBooking(id: string): Promise<void> {
  return apiFetch<void>(`/Booking/${id}/cancel-booking`, {
    method: 'POST',
  });
}

// PUT /api/booking/{id} - Update booking (generic, use success/cancel for status changes)
export async function updateBooking(id: string, updates: Partial<BookingDto>): Promise<BookingDto> {
  return apiFetch<BookingDto>(`/Booking/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// Helper function to get bookings by user ID
export async function getBookingsByUserId(userId: string): Promise<BookingDto[]> {
  // Use dedicated backend endpoint instead of filtering all bookings client-side
  return apiFetch<BookingDto[]>(`/Booking/user/${userId}`);
}

// Helper function to get bookings by status
export async function getBookingsByStatus(status: BookingStatus): Promise<BookingDto[]> {
  const allBookings = await getAllBookings();
  return allBookings.filter(booking => booking.status === status);
}
