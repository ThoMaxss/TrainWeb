/**
 * Comprehensive mock data for demo
 * Vietnamese railway system - GoRail
 * Matches actual backend types exactly
 */

import type { UserDto, TrainDto, TripDto, BookingDto, TicketEntity, SeatDto, PaymentEntity } from '@/types';
import { UserRole, SeatType, BookingStatus, PaymentMethod, PaymentStatus } from '@/types';

// ==================== USERS ====================
export const MOCK_USERS: Record<string, UserDto> = {
  admin: {
    id: 'admin-001',
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@gorail.vn',
    phoneNumber: '0901234567',
    role: UserRole.Admin,
    dateOfBirth: '1985-05-15',
    address: '1 Hoàng Hoa Thám, Ba Đình, Hà Nội',
    isEmailVerified: true,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2026-01-03T08:00:00Z',
  },
  staff: {
    id: 'staff-001',
    fullName: 'Trần Thị Nhân Viên',
    email: 'staff@gorail.vn',
    phoneNumber: '0907654321',
    role: UserRole.Staff,
    dateOfBirth: '1990-08-20',
    address: '234 Nguyễn Trãi, Quận 1, TP.HCM',
    isEmailVerified: true,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2026-01-03T07:30:00Z',
  },
  user: {
    id: 'user-001',
    fullName: 'Lê Minh Khách',
    email: 'user@gorail.vn',
    phoneNumber: '0912345678',
    role: UserRole.Passenger,
    dateOfBirth: '1995-03-10',
    address: '456 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
    isEmailVerified: true,
    isActive: true,
    createdAt: '2025-01-02T00:00:00Z',
    lastLoginAt: '2026-01-03T09:00:00Z',
  },
};

// ==================== TRAINS ====================
export const MOCK_TRAINS: TrainDto[] = [
  { id: 'train-001', name: 'SE1 - Thống Nhất', type: 'Express' },
  { id: 'train-002', name: 'SE2 - Đồng Nai', type: 'Express' },
  { id: 'train-003', name: 'SE3 - Hương Giang', type: 'Express' },
  { id: 'train-004', name: 'SE4 - Sài Gòn', type: 'Express' },
  { id: 'train-005', name: 'SE5 - Bắc Nam', type: 'Standard' },
];

// ==================== TRIPS ====================
const today = new Date('2026-01-03');

interface RouteConfig {
  from: string;
  to: string;
  duration: number; // hours
}

const ROUTES: RouteConfig[] = [
  { from: 'Ga Hà Nội', to: 'Ga Sài Gòn', duration: 30 },
  { from: 'Ga Sài Gòn', to: 'Ga Hà Nội', duration: 30 },
  { from: 'Ga Hà Nội', to: 'Ga Đà Nẵng', duration: 16 },
  { from: 'Ga Hà Nội', to: 'Ga Nha Trang', duration: 24 },
  { from: 'Ga Sài Gòn', to: 'Ga Nha Trang', duration: 8 },
  { from: 'Ga Đà Nẵng', to: 'Ga Sài Gòn', duration: 14 },
];

function generateTrips(): TripDto[] {
  const trips: TripDto[] = [];
  let tripId = 1;

  // Generate trips for next 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const tripDate = new Date(today);
    tripDate.setDate(tripDate.getDate() + dayOffset);
    const dateStr = tripDate.toISOString().split('T')[0];

    ROUTES.forEach((route, routeIdx) => {
      // 2-3 trips per route per day
      const tripsPerDay = 2 + (routeIdx % 2);
      
      for (let tripNum = 0; tripNum < tripsPerDay; tripNum++) {
        const train = MOCK_TRAINS[tripId % MOCK_TRAINS.length];
        const baseHour = 6 + tripNum * 6; // Stagger departures
        const departureTime = `${baseHour.toString().padStart(2, '0')}:${(tripNum * 30).toString().padStart(2, '0')}`;
        
        const arrivalHours = route.duration + (tripNum * 0.5);
        const arrivalHour = (baseHour + Math.floor(arrivalHours)) % 24;
        const arrivalMin = Math.floor((arrivalHours % 1) * 60);
        const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;

        const seatsAvailable = 60 + Math.floor(Math.random() * 60); // 60-120 seats available

        trips.push({
          id: `trip-${tripId.toString().padStart(4, '0')}`,
          train,
          departure: `${dateStr}T${departureTime}:00Z`,
          arrival: `${dateStr}T${arrivalTime}:00Z`,
          originStation: route.from,
          destinationStation: route.to,
          seatsAvailable,
        });

        tripId++;
      }
    });
  }

  return trips;
}

export const MOCK_TRIPS: TripDto[] = generateTrips();

// ==================== VIETNAMESE NAMES ====================
const VIETNAMESE_SURNAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const VIETNAMESE_MIDDLE_NAMES = ['Văn', 'Thị', 'Đức', 'Minh', 'Hoàng', 'Anh', 'Quốc', 'Hữu', 'Thanh', 'Xuân'];
const VIETNAMESE_GIVEN_NAMES = ['An', 'Bình', 'Cường', 'Dũng', 'Hà', 'Linh', 'Mai', 'Nam', 'Phương', 'Quân', 'Sơn', 'Tâm', 'Vân', 'Yến'];

export function generateVietnameseName(): string {
  const surname = VIETNAMESE_SURNAMES[Math.floor(Math.random() * VIETNAMESE_SURNAMES.length)];
  const middleName = VIETNAMESE_MIDDLE_NAMES[Math.floor(Math.random() * VIETNAMESE_MIDDLE_NAMES.length)];
  const givenName = VIETNAMESE_GIVEN_NAMES[Math.floor(Math.random() * VIETNAMESE_GIVEN_NAMES.length)];
  return `${surname} ${middleName} ${givenName}`;
}

// ==================== BOOKINGS ====================
function generateBookings(): BookingDto[] {
  const bookings: BookingDto[] = [];
  const statuses = [BookingStatus.Paid, BookingStatus.Paid, BookingStatus.Paid, BookingStatus.Reserved, BookingStatus.Cancelled];
  
  for (let i = 1; i <= 30; i++) {
    const trip = MOCK_TRIPS[i % Math.min(50, MOCK_TRIPS.length)];
    const bookingDate = new Date(today);
    bookingDate.setDate(bookingDate.getDate() - Math.floor(Math.random() * 15));
    
    const seat: SeatDto = {
      id: `seat-${i.toString().padStart(4, '0')}`,
      trip,
      seatNumber: `${Math.floor(i / 10) + 1}${String.fromCharCode(65 + (i % 10))}`,
      type: i % 3 === 0 ? SeatType.Soft : SeatType.Hard,
      isAvailable: false,
      price: i % 3 === 0 ? 450000 : 300000,
    };
    
    bookings.push({
      id: `booking-${i.toString().padStart(6, '0')}`,
      user: MOCK_USERS.user,
      trip,
      seat,
      status: statuses[i % statuses.length],
      createdAt: bookingDate.toISOString(),
    });
  }
  
  return bookings;
}

export const MOCK_BOOKINGS: BookingDto[] = generateBookings();

// ==================== PAYMENTS ====================
export const MOCK_PAYMENTS: PaymentEntity[] = MOCK_BOOKINGS.map((booking, idx) => ({
  id: `payment-${(idx + 1).toString().padStart(6, '0')}`,
  bookingId: booking.id!,
  booking,
  amount: booking.seat?.price || 300000,
  method: [PaymentMethod.VnPay, PaymentMethod.Momo, PaymentMethod.Visa][idx % 3],
  status: booking.status === BookingStatus.Paid ? PaymentStatus.Success : PaymentStatus.Pending,
  createdAt: booking.createdAt!,
}));

// ==================== SEATS ====================
export function generateSeatsForTrip(tripId: string): SeatDto[] {
  const trip = MOCK_TRIPS.find(t => t.id === tripId);
  if (!trip) return [];
  
  const seats: SeatDto[] = [];
  const totalSeats = 120; // Fixed size for simplicity
  const availableCount = trip.seatsAvailable || 60;
  const occupied = totalSeats - availableCount;
  
  for (let i = 1; i <= totalSeats; i++) {
    const seatType = i % 4 === 0 ? SeatType.Soft : SeatType.Hard;
    const basePrice = 300000;
    const price = seatType === SeatType.Soft ? basePrice * 1.5 : basePrice;
    const isAvailable = i > occupied;
    
    seats.push({
      id: `seat-${tripId}-${i.toString().padStart(3, '0')}`,
      trip,
      seatNumber: `${Math.floor((i - 1) / 10) + 1}${String.fromCharCode(65 + ((i - 1) % 10))}`,
      type: seatType,
      price,
      isAvailable,
    });
  }
  
  return seats;
}

// ==================== TICKETS ====================
export function generateTicketsForBooking(bookingId: string): TicketEntity[] {
  const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
  if (!booking || !booking.seat) return [];
  
  return [{
    id: `ticket-${bookingId}`,
    bookingId,
    seat: booking.seat,
    qrCode: `QR-${bookingId}-${Date.now()}`,
    status: booking.status === BookingStatus.Paid ? 0 : 2, // Active or Cancelled
  }];
}

// ==================== INITIAL DATA ====================
export const INITIAL_MOCK_DATA = {
  users: Object.values(MOCK_USERS),
  trains: MOCK_TRAINS,
  trips: MOCK_TRIPS.slice(0, 100), // First 100 trips
};
