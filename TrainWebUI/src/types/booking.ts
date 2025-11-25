import { UserDto } from './user';
import { TripDto } from './trip';
import { SeatDto } from './seat';

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
  user?: UserDto;
  trip?: TripDto;
  seat?: SeatDto;
  status?: BookingStatus;
  createdAt?: string;
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
