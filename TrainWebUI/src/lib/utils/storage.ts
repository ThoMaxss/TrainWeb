/**
 * LocalStorage manager for persistent demo data
 */

import type { BookingDto, TicketEntity, UserDto, TripDto } from '@/types';

const STORAGE_KEYS = {
  BOOKINGS: 'gorail_bookings',
  TICKETS: 'gorail_tickets',
  USERS: 'gorail_users',
  TRIPS: 'gorail_trips',
  SEEDED: 'gorail_seeded',
  USER_SESSION: 'gorail_user_session',
} as const;

export class AppStorage {
  // Bookings
  static getBookings(): BookingDto[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveBooking(booking: BookingDto): void {
    try {
      const bookings = this.getBookings();
      bookings.push(booking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (error) {
      console.error('Failed to save booking:', error);
    }
  }

  static updateBooking(bookingId: string, updates: Partial<BookingDto>): void {
    try {
      const bookings = this.getBookings();
      const index = bookings.findIndex(b => b.id === bookingId);
      if (index !== -1) {
        bookings[index] = { ...bookings[index], ...updates };
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  }

  static getBookingById(id: string): BookingDto | null {
    const bookings = this.getBookings();
    return bookings.find(b => b.id === id) || null;
  }

  static getBookingsByUserId(userId: string): BookingDto[] {
    const bookings = this.getBookings();
    return bookings.filter(b => b.user?.id === userId);
  }

  // Tickets
  static getTickets(): TicketEntity[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveTicket(ticket: TicketEntity): void {
    try {
      const tickets = this.getTickets();
      tickets.push(ticket);
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    } catch (error) {
      console.error('Failed to save ticket:', error);
    }
  }

  static getTicketsByBookingId(bookingId: string): TicketEntity[] {
    const tickets = this.getTickets();
    return tickets.filter(t => t.bookingId === bookingId);
  }

  // Users
  static getUsers(): UserDto[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveUser(user: UserDto): void {
    try {
      const users = this.getUsers();
      users.push(user);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  }

  static getUserById(id: string): UserDto | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  static getUserByEmail(email: string): UserDto | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  }

  // Trips
  static getTrips(): TripDto[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveTrip(trip: TripDto): void {
    try {
      const trips = this.getTrips();
      trips.push(trip);
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    } catch (error) {
      console.error('Failed to save trip:', error);
    }
  }

  static getTripById(id: string): TripDto | null {
    const trips = this.getTrips();
    return trips.find(t => t.id === id) || null;
  }

  // Session
  static getCurrentUser(): UserDto | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: UserDto): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to set current user:', error);
    }
  }

  static clearCurrentUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  }

  // Seeding
  static isSeeded(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SEEDED) === 'true';
  }

  static markAsSeeded(): void {
    localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
  }

  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
