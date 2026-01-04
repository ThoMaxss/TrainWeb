import { apiFetch } from './config';
import { PaymentEntity, PaymentRequest, PaymentMethod } from '@/types';

// Payment endpoints based on backend documentation

// POST /api/Payment/create - Create payment per BE
// Response: PaymentDto
export async function createPayment(paymentData: PaymentRequest): Promise<PaymentEntity> {
  return apiFetch<PaymentEntity>('/Payment/create', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
}

// POST /api/Payment/{id}/success - Mark payment as successful
export async function successPayment(id: string): Promise<void> {
  return apiFetch<void>(`/Payment/${id}/success`, {
    method: 'POST',
  });
}

// GET /api/Payment/{id} - Get payment by ID
export async function getPaymentById(id: string): Promise<PaymentEntity> {
  return apiFetch<PaymentEntity>(`/Payment/${id}`);
}

// GET /api/Payment/booking/{bookingId} - Get all payments by booking ID (matches BE)
export async function getPaymentsByBookingId(bookingId: string): Promise<PaymentEntity[]> {
  return apiFetch<PaymentEntity[]>(`/Payment/booking/${bookingId}`);
}

// Alias for backward compatibility
export const processPayment = createPayment;

// Get available payment methods
export function getPaymentMethods(): PaymentMethod[] {
  return [PaymentMethod.Visa, PaymentMethod.Momo, PaymentMethod.VnPay];
}

// Get payment history for a user (uses backend endpoint)
// If needed: aggregate by user on client-side from bookings
export async function getPaymentHistoryByBooking(bookingId: string): Promise<PaymentEntity[]> {
  return getPaymentsByBookingId(bookingId);
}
