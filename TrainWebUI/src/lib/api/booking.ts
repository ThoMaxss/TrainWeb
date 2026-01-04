import { apiFetch } from './config';
import { BookingDto, BookingStatus } from '@/types';

const BASE = '/Booking';

// Booking endpoints based on backend documentation

// GET /api/Booking/user/{userId}
export async function getAllBookingsByUser(userId: string): Promise<BookingDto[]> {
  return apiFetch<BookingDto[]>(`${BASE}/user/${userId}`);
}

// Admin-only (quota heavy) - GET /api/Booking
export async function getAllBookings(): Promise<BookingDto[]> {
  return apiFetch<BookingDto[]>(`${BASE}`);
}

// GET /api/Booking/{id}
export async function getBookingById(id: string): Promise<BookingDto> {
  return apiFetch<BookingDto>(`${BASE}/${id}`);
}

// POST /api/Booking - Create booking (Reserved)
export async function createBooking(payload: {
  userId: string;
  tripId: string;
  seatId: string;
  ticketTypeId?: string;
}): Promise<BookingDto> {
  return apiFetch<BookingDto>(`${BASE}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// POST /api/Booking/{id}/success-booking - mark paid & create ticket if needed
export async function successBooking(id: string): Promise<void> {
  return apiFetch<void>(`${BASE}/${id}/success-booking`, {
    method: 'POST',
  });
}

// POST /api/Booking/{id}/cancel-booking
export async function cancelBooking(id: string, reason?: string): Promise<void> {
  return apiFetch<void>(`${BASE}/${id}/cancel-booking`, {
    method: 'POST',
    body: JSON.stringify({ cancellationReason: reason }),
  });
}

// Not supported by BE
export async function updateBooking(_id: string, _updates: Partial<BookingDto>): Promise<BookingDto> {
  throw new Error('updateBooking is not supported by the backend API');
}

export async function getBookingsByUserId(userId: string): Promise<BookingDto[]> {
  return getAllBookingsByUser(userId);
}

export async function getBookingsByStatus(userId: string, status: BookingStatus): Promise<BookingDto[]> {
  const allBookings = await getAllBookingsByUser(userId);
  return allBookings.filter(booking => booking.status === status);
}
