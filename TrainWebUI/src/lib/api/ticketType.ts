import { apiFetch } from './config';
import { TicketTypeDto } from '@/types';

// TicketType endpoints based on backend documentation

// GET /api/TicketType - Get all ticket types
export async function getAllTicketTypes(): Promise<TicketTypeDto[]> {
  return apiFetch<TicketTypeDto[]>('/TicketType');
}

// GET /api/TicketType/{id} - Get ticket type by ID
export async function getTicketTypeById(id: string): Promise<TicketTypeDto> {
  return apiFetch<TicketTypeDto>(`/TicketType/${id}`);
}

// POST /api/TicketType - Create ticket type
export async function createTicketType(ticketTypeData: TicketTypeDto): Promise<TicketTypeDto> {
  return apiFetch<TicketTypeDto>('/TicketType', {
    method: 'POST',
    body: JSON.stringify(ticketTypeData),
  });
}

// PUT /api/TicketType/{id} - Update ticket type
export async function updateTicketType(id: string, ticketTypeData: TicketTypeDto): Promise<TicketTypeDto> {
  return apiFetch<TicketTypeDto>(`/TicketType/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ticketTypeData),
  });
}

// DELETE /api/TicketType/{id} - Delete ticket type
export async function deleteTicketType(id: string): Promise<void> {
  return apiFetch<void>(`/TicketType/${id}`, {
    method: 'DELETE',
  });
}
