/**
 * Mock Service - Simulates API responses with realistic delays
 * Fallback when backend is unavailable
 */

import type { 
  UserDto, 
  TrainDto, 
  TripDto, 
  BookingDto, 
  SeatDto, 
  TicketEntity,
  PaymentEntity,
  AuthResponse,
  PassengerDto
} from '@/types';
import { BookingStatus, PaymentStatus, PaymentMethod, UserRole, SeatType } from '@/types';
import { 
  MOCK_USERS, 
  MOCK_TRAINS, 
  MOCK_TRIPS, 
  MOCK_BOOKINGS,
  MOCK_PAYMENTS,
  generateSeatsForTrip,
  generateVietnameseName,
  INITIAL_MOCK_DATA
} from '@/lib/mock/data';
import { AppStorage } from '@/lib/utils/storage';
import { logger } from '@/lib/utils/logger';

export class MockService {
  private minDelay = 300;
  private maxDelay = 800;
  private failureRate = 0.02; // 2% failure rate for realism

  /**
   * Simulate network delay
   */
  private async delay(): Promise<void> {
    const ms = this.minDelay + Math.random() * (this.maxDelay - this.minDelay);
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Simulate occasional network failures
   */
  private shouldFail(): boolean {
    return Math.random() < this.failureRate;
  }

  /**
   * Initialize mock data on first load
   */
  public initializeMockData(): void {
    if (AppStorage.isSeeded()) {
      logger.log('Mock data already seeded');
      return;
    }

    logger.log('Seeding initial mock data...');
    
    // Seed users
    INITIAL_MOCK_DATA.users.forEach((user: UserDto) => AppStorage.saveUser(user));
    
    // Seed trips (bookings and payments will be generated on demand)
    INITIAL_MOCK_DATA.trips.forEach((trip: TripDto) => AppStorage.saveTrip(trip));
    
    AppStorage.markAsSeeded();
    logger.log('Mock data seeded successfully');
  }

  /**
   * Main request handler - routes to appropriate mock method
   */
  public async handleRequest(endpoint: string, options?: RequestInit): Promise<any> {
    await this.delay();

    if (this.shouldFail()) {
      throw new Error('Network error (simulated)');
    }

    const method = options?.method || 'GET';
    const body = options?.body ? JSON.parse(options.body as string) : null;

    logger.log(`[Mock] ${method} ${endpoint}`, body);

    // Auth endpoints
    if (endpoint.includes('/Auth/login')) return this.login(body);
    if (endpoint.includes('/Auth/register')) return this.register(body);
    if (endpoint.includes('/Auth/validate')) return this.validateToken(body);

    // User endpoints
    if (endpoint === '/User' && method === 'GET') return this.getAllUsers();
    if (endpoint.match(/\/User\/[\w-]+$/) && method === 'GET') return this.getUserById(endpoint);
    if (endpoint.match(/\/User\/[\w-]+$/) && method === 'PUT') return this.updateUser(endpoint, body);

    // Train endpoints
    if (endpoint === '/Train' && method === 'GET') return this.getAllTrains();
    if (endpoint.match(/\/Train\/[\w-]+$/) && method === 'GET') return this.getTrainById(endpoint);
    if (endpoint === '/Train' && method === 'POST') return this.createTrain(body);
    if (endpoint.match(/\/Train\/[\w-]+$/) && method === 'PUT') return this.updateTrain(endpoint, body);
    if (endpoint.match(/\/Train\/[\w-]+$/) && method === 'DELETE') return this.deleteTrain(endpoint);

    // Trip endpoints
    if (endpoint === '/Trip' && method === 'GET') return this.getAllTrips();
    if (endpoint.includes('/Trip/search')) return this.searchTrips(endpoint);
    if (endpoint.match(/\/Trip\/[\w-]+$/) && method === 'GET') return this.getTripById(endpoint);
    if (endpoint === '/Trip' && method === 'POST') return this.createTrip(body);

    // Seat endpoints
    if (endpoint.match(/\/Seat\/trip\/[\w-]+$/)) return this.getSeatsByTripId(endpoint);

    // Booking endpoints
    if (endpoint === '/Booking' && method === 'GET') return this.getAllBookings();
    if (endpoint.includes('/Booking/create') || (endpoint === '/Booking' && method === 'POST')) {
      return this.createBooking(body);
    }
    if (endpoint.match(/\/Booking\/[\w-]+$/) && method === 'GET') return this.getBookingById(endpoint);

    // Payment endpoints
    if (endpoint.includes('/Payment/create')) return this.createPayment(body);
    if (endpoint.includes('/Payment/success')) return this.successPayment(body);

    // Ticket endpoints
    if (endpoint.match(/\/Ticket\/generate\/[\w-]+$/)) return this.generateTickets(endpoint);
    if (endpoint.match(/\/Ticket\/[\w-]+\/qr$/)) return this.getTicketQR(endpoint);

    // TicketType endpoints (for admin tickets page)
    if (endpoint === '/TicketType' && method === 'GET') return this.getAllTicketTypes();
    if (endpoint === '/TicketType' && method === 'POST') return this.createTicketType(body);
    if (endpoint.match(/\/TicketType\/[\w-]+$/) && method === 'PUT') return this.updateTicketType(endpoint, body);
    if (endpoint.match(/\/TicketType\/[\w-]+$/) && method === 'DELETE') return this.deleteTicketType(endpoint);

    logger.warn(`[Mock] Unhandled endpoint: ${method} ${endpoint}`);
    return { error: 'Not implemented in mock' };
  }

  // ==================== AUTH ====================
  private async login(body: { email: string; password: string }): Promise<AuthResponse> {
    const user = AppStorage.getUserByEmail(body.email) || (Object.values(MOCK_USERS) as UserDto[]).find(u => u.email === body.email);
    
    if (!user) {
      return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    }

    AppStorage.setCurrentUser(user);
    
    // Map role enum to string for frontend
    const roleMap: Record<number, string> = {
      [UserRole.Passenger]: 'passenger',
      [UserRole.Staff]: 'staff', 
      [UserRole.Admin]: 'admin',
    };
    
    return {
      success: true,
      message: 'Đăng nhập thành công',
      token: `mock-jwt-token-${Date.now()}`,
      user: {
        id: user.id!,
        email: user.email!,
        fullName: user.fullName!,
        phoneNumber: user.phoneNumber,
        userRole: roleMap[user.role as number] || 'passenger',
      },
    };
  }

  private async register(body: any): Promise<AuthResponse> {
    const existingUser = AppStorage.getUserByEmail(body.email);
    if (existingUser) {
      return { success: false, message: 'Email đã được sử dụng' };
    }

    const newUser: UserDto = {
      id: `user-${Date.now()}`,
      fullName: body.fullName,
      email: body.email,
      phoneNumber: body.phoneNumber || '',
      role: UserRole.Passenger,
      dateOfBirth: body.dateOfBirth || '',
      address: body.address || '',
      isEmailVerified: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    AppStorage.saveUser(newUser);
    AppStorage.setCurrentUser(newUser);

    return {
      success: true,
      message: 'Đăng ký thành công',
      token: `mock-jwt-token-${Date.now()}`,
      user: {
        id: newUser.id!,
        email: newUser.email!,
        fullName: newUser.fullName!,
        phoneNumber: newUser.phoneNumber,
        userRole: 'passenger',
      },
    };
  }

  private async validateToken(body: { token: string }): Promise<{ valid: boolean }> {
    return { valid: !!body.token };
  }

  // ==================== USERS ====================
  private async getAllUsers(): Promise<UserDto[]> {
    return AppStorage.getUsers();
  }

  private async getUserById(endpoint: string): Promise<UserDto> {
    const id = endpoint.split('/').pop()!;
    const user = AppStorage.getUserById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  private async updateUser(endpoint: string, body: Partial<UserDto>): Promise<UserDto> {
    const id = endpoint.split('/').pop()!;
    const user = AppStorage.getUserById(id);
    if (!user) throw new Error('User not found');
    
    const updated = { ...user, ...body };
    // Update in storage (simplified - in real app would update array)
    return updated;
  }

  // ==================== TRAINS ====================
  private async getAllTrains(): Promise<TrainDto[]> {
    return MOCK_TRAINS;
  }

  private async getTrainById(endpoint: string): Promise<TrainDto> {
    const id = endpoint.split('/').pop()!;
    const train = MOCK_TRAINS.find((t: TrainDto) => t.id === id);
    if (!train) throw new Error('Train not found');
    return train;
  }

  private async createTrain(body: TrainDto): Promise<TrainDto> {
    const newTrain = { ...body, id: `train-${Date.now()}`, createdAt: new Date().toISOString() };
    MOCK_TRAINS.push(newTrain);
    return newTrain;
  }

  private async updateTrain(endpoint: string, body: Partial<TrainDto>): Promise<TrainDto> {
    const id = endpoint.split('/').pop()!;
    const index = MOCK_TRAINS.findIndex((t: TrainDto) => t.id === id);
    if (index === -1) throw new Error('Train not found');
    MOCK_TRAINS[index] = { ...MOCK_TRAINS[index], ...body };
    return MOCK_TRAINS[index];
  }

  private async deleteTrain(endpoint: string): Promise<void> {
    const id = endpoint.split('/').pop()!;
    const index = MOCK_TRAINS.findIndex((t: TrainDto) => t.id === id);
    if (index !== -1) MOCK_TRAINS.splice(index, 1);
  }

  // ==================== TRIPS ====================
  private async getAllTrips(): Promise<TripDto[]> {
    const stored = AppStorage.getTrips();
    return stored.length > 0 ? stored : MOCK_TRIPS.slice(0, 50);
  }

  private async searchTrips(endpoint: string): Promise<TripDto[]> {
    const url = new URL(endpoint, 'http://mock');
    const origin = url.searchParams.get('originStation');
    const destination = url.searchParams.get('destinationStation');
    const date = url.searchParams.get('tripDate');

    let trips = AppStorage.getTrips();
    if (trips.length === 0) trips = MOCK_TRIPS;

    if (origin) {
      trips = trips.filter(t => t.originStation?.toLowerCase().includes(origin.toLowerCase()));
    }
    if (destination) {
      trips = trips.filter(t => t.destinationStation?.toLowerCase().includes(destination.toLowerCase()));
    }
    // Date filtering would need to parse departure string
    // Skipping for simplicity in mock

    return trips;
  }

  private async getTripById(endpoint: string): Promise<TripDto> {
    const id = endpoint.split('/').pop()!;
    const trip = AppStorage.getTripById(id) || MOCK_TRIPS.find((t: TripDto) => t.id === id);
    if (!trip) throw new Error('Trip not found');
    return trip;
  }

  private async createTrip(body: TripDto): Promise<TripDto> {
    const newTrip = { ...body, id: `trip-${Date.now()}`, createdAt: new Date().toISOString() };
    AppStorage.saveTrip(newTrip);
    return newTrip;
  }

  // ==================== SEATS ====================
  private async getSeatsByTripId(endpoint: string): Promise<SeatDto[]> {
    const tripId = endpoint.split('/').pop()!;
    return generateSeatsForTrip(tripId);
  }

  // ==================== BOOKINGS ====================
  private async getAllBookings(): Promise<BookingDto[]> {
    const stored = AppStorage.getBookings();
    return stored.length > 0 ? stored : MOCK_BOOKINGS;
  }

  private async createBooking(body: any): Promise<BookingDto> {
    const trip = await this.getTripById(`/Trip/${body.tripId}`);
    const seat: SeatDto = {
      id: body.seatId || `seat-${Date.now()}`,
      trip,
      seatNumber: body.seatNumber || '1A',
      type: SeatType.Hard,
      isAvailable: false,
      price: 300000,
    };

    const newBooking: BookingDto = {
      id: `booking-${Date.now()}`,
      user: body.user || MOCK_USERS.user,
      trip,
      seat,
      status: BookingStatus.Reserved,
      createdAt: new Date().toISOString(),
    };

    AppStorage.saveBooking(newBooking);
    return newBooking;
  }

  private async getBookingById(endpoint: string): Promise<BookingDto> {
    const id = endpoint.split('/').pop()!;
    const booking = AppStorage.getBookingById(id) || MOCK_BOOKINGS.find((b: BookingDto) => b.id === id);
    if (!booking) throw new Error('Booking not found');
    return booking;
  }

  // ==================== PAYMENTS ====================
  private async createPayment(body: any): Promise<any> {
    return {
      paymentUrl: `https://mock-payment-gateway.com/pay/${Date.now()}`,
      paymentId: `payment-${Date.now()}`,
      amount: body.amount,
    };
  }

  private async successPayment(body: any): Promise<any> {
    if (body.bookingId) {
      AppStorage.updateBooking(body.bookingId, {
        status: BookingStatus.Paid,
      });
    }
    return { success: true, message: 'Payment successful' };
  }

  // ==================== TICKETS ====================
  private async generateTickets(endpoint: string): Promise<TicketEntity[]> {
    const bookingId = endpoint.split('/').pop()!;
    const booking = AppStorage.getBookingById(bookingId);
    if (!booking || !booking.seat) throw new Error('Booking not found');

    const ticket: TicketEntity = {
      id: `ticket-${Date.now()}`,
      bookingId: booking.id!,
      seat: booking.seat,
      qrCode: `QR-${Date.now()}`,
      status: 0, // Active
    };
    
    AppStorage.saveTicket(ticket);
    return [ticket];
  }

  private async getTicketQR(endpoint: string): Promise<string> {
    const id = endpoint.split('/')[2]; // Extract ID from /Ticket/{id}/qr
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
  }

  // ==================== TICKET TYPES ====================
  private mockTicketTypes = [
    { id: 'tt-001', name: 'Vé thường', discount: 0 },
    { id: 'tt-002', name: 'Vé sinh viên', discount: 20 },
    { id: 'tt-003', name: 'Vé người cao tuổi', discount: 30 },
    { id: 'tt-004', name: 'Vé trẻ em', discount: 50 },
    { id: 'tt-005', name: 'Vé VIP', discount: -20 }, // Premium ticket costs more
  ];

  private async getAllTicketTypes(): Promise<any[]> {
    return this.mockTicketTypes;
  }

  private async createTicketType(body: any): Promise<any> {
    const newType = { id: `tt-${Date.now()}`, ...body };
    this.mockTicketTypes.push(newType);
    return newType;
  }

  private async updateTicketType(endpoint: string, body: any): Promise<any> {
    const id = endpoint.split('/').pop()!;
    const index = this.mockTicketTypes.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTicketTypes[index] = { ...this.mockTicketTypes[index], ...body };
      return this.mockTicketTypes[index];
    }
    throw new Error('TicketType not found');
  }

  private async deleteTicketType(endpoint: string): Promise<void> {
    const id = endpoint.split('/').pop()!;
    const index = this.mockTicketTypes.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTicketTypes.splice(index, 1);
    }
  }
}

export const mockService = new MockService();
