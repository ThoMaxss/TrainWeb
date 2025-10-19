import { apiFetch } from './config';
import { TicketTemplateDto, CreateTicketTemplateRequest, UpdateTicketTemplateRequest } from '@/types';

const BASE = '/ticket-template';

export async function getAllTicketTemplates(): Promise<TicketTemplateDto[]> {
  return apiFetch<TicketTemplateDto[]>(`${BASE}`);
}

export async function getTicketTemplateById(id: string): Promise<TicketTemplateDto | null> {
  return apiFetch<TicketTemplateDto | null>(`${BASE}/${id}`);
}

export async function createTicketTemplate(payload: CreateTicketTemplateRequest): Promise<TicketTemplateDto> {
  return apiFetch<TicketTemplateDto>(`${BASE}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateTicketTemplate(id: string, payload: UpdateTicketTemplateRequest): Promise<TicketTemplateDto> {
  return apiFetch<TicketTemplateDto>(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteTicketTemplate(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, {
    method: 'DELETE',
  });
}
