import { UserDto } from './user';
import { TripDto } from './trip';
import { SeatDto } from './seat';
import { TicketEntity } from './ticket';
import { PaymentStatus } from './payment';

export enum BookingStatus {
  Reserved = 0,
  Paid = 1,
  Cancelled = 2
}

export interface BookingEntity {
  id: string;
  userId: string;
  tripId: string;
  seatId: string;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingDto {
  id?: string;
  userId?: string;
  tripId?: string;
  seatId?: string;
  ticketTypeId?: string;
  amount?: number;
  status?: BookingStatus | string;
  paymentStatus?: PaymentStatus | string;
  paymentId?: string | null;
  ticketId?: string | null;
  ticketStatus?: string | null;
  createdAt?: string;
  expiresAt?: string;
  seatSummary?: any;
  tripSummary?: any;
  user?: UserDto;
  trip?: TripDto;
  seat?: SeatDto;
  ticket?: TicketEntity; // Ticket reference for creating bookings
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.Reserved]: 'Đã đặt',
  [BookingStatus.Paid]: 'Đã thanh toán',
  [BookingStatus.Cancelled]: 'Đã hủy'
};

export function isBookingStatus(value: number): value is BookingStatus {
  return value >= 0 && value <= 2;
}

// Additional types for booking workflow
export interface Passenger {
  name: string;
  idNumber: string;
  phone: string;
}

export interface PassengerDto {
  name: string;
  idNumber: string;
  phone: string;
}

export interface SelectedSeat {
  seatId: string;
  seatNumber: string;
  type: string;
  price: number;
}
