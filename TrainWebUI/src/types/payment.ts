import { BookingDto } from './booking';

export enum PaymentMethod {
  Visa = 0,
  Momo = 1,
  VnPay = 2
}

export enum PaymentStatus {
  Success = 0,
  Pending = 1,
  Failed = 2
}

export interface PaymentEntity {
  id: string;
  bookingId?: string; // legacy
  booking?: BookingDto; // backend returns nested booking dto
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}

export interface PaymentRequest {
  booking: { id: string };
  amount?: number;
  method: PaymentMethod;
  status: PaymentStatus;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.Visa]: 'Visa',
  [PaymentMethod.Momo]: 'Momo',
  [PaymentMethod.VnPay]: 'VnPay'
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.Success]: 'Thành công',
  [PaymentStatus.Pending]: 'Đang xử lý',
  [PaymentStatus.Failed]: 'Thất bại'
};

export function isPaymentMethod(value: number): value is PaymentMethod {
  return value >= 0 && value <= 2;
}

export function isPaymentStatus(value: number): value is PaymentStatus {
  return value >= 0 && value <= 2;
}
