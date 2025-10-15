import { PaymentStatus, PaymentMethod } from './common';
import { BookingDto } from './booking';

// Main Payment Entity
export interface PaymentEntity {
  id: string;
  bookingId: string;
  booking?: BookingDto;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentUrl?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Create payment request
export interface CreatePaymentRequest {
  id?: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod | 'Visa' | 'Momo' | 'VnPay'; // Support both enum and string
  status?: PaymentStatus | 'Success' | 'Pending' | 'Failed';
  createdAt?: string;
}

// Payment response
export interface PaymentResponse {
  id: string;
  paymentUrl?: string;
  status: PaymentStatus;
  transactionId?: string;
}
