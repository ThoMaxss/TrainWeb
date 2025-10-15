import { apiFetch } from './config';
import { TicketDto, CreateTicketRequest, UpdateTicketRequest } from '@/types';

const BASE = '/ticket';

export async function getAllTickets(): Promise<TicketDto[]> {
  return apiFetch<TicketDto[]>(`${BASE}`);
}

export async function getTicketById(id: string): Promise<TicketDto | null> {
  return apiFetch<TicketDto | null>(`${BASE}/${id}`);
}

export async function getTicketsByBookingId(bookingId: string): Promise<TicketDto[]> {
  const all = await getAllTickets();
  return all.filter(t => t.bookingId === bookingId);
}

export async function createTicket(payload: CreateTicketRequest): Promise<TicketDto> {
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
