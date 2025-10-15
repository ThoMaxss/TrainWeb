import { apiFetch } from './config';
import { PaymentEntity, CreatePaymentRequest, PaymentMethod } from '@/types';

// Payment endpoints based on backend documentation

// POST /api/payment/pay - Process payment
export async function processPayment(paymentData: CreatePaymentRequest): Promise<PaymentEntity> {
  return apiFetch<PaymentEntity>('/payment/pay', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
}

// Helper functions (these endpoints might need to be implemented on backend)

// Get available payment methods
export function getPaymentMethods(): PaymentMethod[] {
  return [PaymentMethod.VISA, PaymentMethod.MOMO, PaymentMethod.VNPAY];
}

// Since there's no payment history endpoint, you might need to:
// 1. Get all bookings for a user
// 2. Filter by paid status
// 3. Get payment records (if there's a way to query them)
export async function getPaymentHistory(userId: string): Promise<PaymentEntity[]> {
  // This would need to be implemented on the backend
  // For now, return empty array
  console.warn('getPaymentHistory not implemented on backend');
  return [];
}

// Verify payment status by checking booking status
export async function verifyPaymentByBookingId(bookingId: string): Promise<{ verified: boolean; status: string }> {
  try {
    // You would need to get booking details and check status
    // This is a placeholder implementation
    return {
      verified: true,
      status: 'Success'
    };
  } catch (error) {
    return {
      verified: false,
      status: 'Failed'
    };
  }
}
