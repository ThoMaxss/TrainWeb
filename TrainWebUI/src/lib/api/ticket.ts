import { apiFetch, API_CONFIG } from './config';
import { TicketEntity as TicketDto, TicketStatus, parseTicketStatus } from '@/types';
import { SEAT_TYPE_LABELS } from '@/types/seat';

// Define local request types to match backend contract
type CreateTicketRequest = {
  seat?: { id: string; [key: string]: unknown };
  ticketType?: { id: string; [key: string]: unknown };
  status: TicketStatus;
};

type UpdateTicketRequest = Partial<CreateTicketRequest>;

const BASE = '/Ticket'; // PascalCase theo API doc

export async function getAllTickets(): Promise<TicketDto[]> {
  const tickets = await apiFetch<TicketDto[]>(`${BASE}`);
  
  // Normalize status from string to enum
  return tickets.map(ticket => ({
    ...ticket,
    status: typeof ticket.status === 'string' ? parseTicketStatus(ticket.status) : ticket.status,
  }));
}

export async function getTicketById(id: string): Promise<TicketDto | null> {
  const ticket = await apiFetch<TicketDto | null>(`${BASE}/${id}`);
  
  if (ticket && typeof ticket.status === 'string') {
    return {
      ...ticket,
      status: parseTicketStatus(ticket.status),
    };
  }
  
  return ticket;
}

export async function getTicketsByBookingId(bookingId: string): Promise<TicketDto[]> {
  const all = await getAllTickets();
  return all.filter(t => t.bookingId === bookingId);
}

export async function createTicket(payload: TicketDto | CreateTicketRequest): Promise<TicketDto> {
  return apiFetch<TicketDto>(`${BASE}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateTicket(id: string, payload: UpdateTicketRequest): Promise<TicketDto> {
  return apiFetch<TicketDto>(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteTicket(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Helper function to get seat type name from ticket
 * Since backend returns seat.type as string "Hard" or "Soft" instead of number
 */
export function getSeatTypeName(ticket: TicketDto): string {
  if (!ticket.seat || !ticket.seat.type) return 'N/A';
  
  // If type is string (from backend)
  if (typeof ticket.seat.type === 'string') {
    return ticket.seat.type === 'Hard' ? 'Ghế cứng' : 'Ghế mềm';
  }
  
  // If type is number (enum)
  return SEAT_TYPE_LABELS[ticket.seat.type] || 'N/A';
}

/**
 * Helper function to get seat number from ticket
 */
export function getSeatNumber(ticket: TicketDto): string {
  return ticket.seat?.seatNumber || 'N/A';
}

/**
 * Helper function to get seat price from ticket
 */
export function getSeatPrice(ticket: TicketDto): number {
  return ticket.seat?.price || 0;
}

export function getTicketQrUrl(id: string): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_ROOT}${BASE}/${id}/qrcode`;
}
