import { apiFetch } from './config';
import { PaymentEntity, PaymentRequest, PaymentMethod } from '@/types';

// Payment endpoints based on backend documentation

// POST /api/Payment - Create payment
// Response can be PaymentEntity OR string (Momo URL)
export async function createPayment(paymentData: PaymentRequest): Promise<PaymentEntity | string> {
  return apiFetch<PaymentEntity | string>('/Payment', {
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

// GET /api/Payment/user/{userId} - Get all payments by user ID
export async function getPaymentsByUserId(userId: string): Promise<PaymentEntity[]> {
  return apiFetch<PaymentEntity[]>(`/Payment/user/${userId}`);
}

// Alias for backward compatibility
export const processPayment = createPayment;

// Get available payment methods
export function getPaymentMethods(): PaymentMethod[] {
  return [PaymentMethod.Visa, PaymentMethod.Momo, PaymentMethod.VnPay];
}

// Get payment history for a user (uses backend endpoint)
export async function getPaymentHistory(userId: string): Promise<PaymentEntity[]> {
  return getPaymentsByUserId(userId);
}
