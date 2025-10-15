import { BookingStatus, SeatType } from './common';
import { UserDto } from './user';
import { TripDto } from './trip';

// Seat DTO
export interface SeatDto {
  id: string;
  trainId: string;
  coach: number;
  seatNumber: string;
  type: SeatType;
  price: number;
  isAvailable: boolean;
  trip?: TripDto; // Optional trip relation for backward compatibility
}

// Passenger information for booking
export interface PassengerInfo {
  name: string;
  idNumber: string;
  phone?: string;
  seatId: string;
}

// Full passenger DTO (for detailed passenger data)
export interface PassengerDto {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  idNumber: string;
  phone: string;
  email: string;
}

// Main Booking DTO
export interface BookingDto {
  id: string;
  userId: string;
  tripId: string;
  seatIds: string[];
  user: UserDto;
  trip: TripDto;
  seats: SeatDto[];
  totalAmount: number;
  status: BookingStatus;
  bookingCode: string;
  passengerInfo: PassengerInfo[];
  createdAt: string;
  updatedAt: string;
}

// Create booking request
export interface CreateBookingRequest {
  tripId: string;
  seatIds: string[];
  passengerInfo: PassengerInfo[];
}
