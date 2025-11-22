import { BookingDto } from './booking';

export interface TicketTemplateDto {
  id: string;
  booking: BookingDto;
  templateUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketTemplateRequest {
  bookingId: string;
  templateUrl: string;
}

export interface UpdateTicketTemplateRequest {
  templateUrl?: string;
}
