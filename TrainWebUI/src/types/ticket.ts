import type { BookingDto } from './booking';

// Ticket status values based on provided schema
export enum TicketStatus {
  ACTIVE = 'active',
  USED = 'used',
  CANCELLED = 'cancelled',
}

// Ticket DTO matching backend data shape
export interface TicketDto {
  id: string;
  bookingId: string;
  qrCode: string;
  status: TicketStatus; // active | used | cancelled
  // Optional relation for convenience in some responses
  booking?: BookingDto;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTicketRequest {
  bookingId: string;
  qrCode: string;
  status: TicketStatus;
}

export type UpdateTicketRequest = Partial<CreateTicketRequest> & { id: string };
