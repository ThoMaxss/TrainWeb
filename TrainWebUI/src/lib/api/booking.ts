import { apiFetch } from './config';
import { BookingDto, BookingStatus } from '@/types';

// Booking endpoints based on backend documentation

// GET /api/booking - Get all bookings
export async function getAllBookings(): Promise<BookingDto[]> {
  return apiFetch<BookingDto[]>('/booking');
}

// GET /api/booking/{id} - Get booking by ID
export async function getBookingById(id: string): Promise<BookingDto> {
  return apiFetch<BookingDto>(`/booking/${id}`);
}

// POST /api/booking - Create booking
export async function createBooking(bookingData: BookingDto): Promise<BookingDto> {
  return apiFetch<BookingDto>('/booking', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

// Helper function to get bookings by user ID
export async function getBookingsByUserId(userId: string): Promise<BookingDto[]> {
  const allBookings = await getAllBookings();
  return allBookings.filter(booking => booking.user?.id === userId);
}

// Helper function to get bookings by status
export async function getBookingsByStatus(status: BookingStatus | 'Reserved' | 'Paid' | 'Cancelled'): Promise<BookingDto[]> {
  const allBookings = await getAllBookings();
  return allBookings.filter(booking => booking.status === status || booking.status === BookingStatus[status.toUpperCase() as keyof typeof BookingStatus]);
}
