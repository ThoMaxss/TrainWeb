export interface TicketTemplateDto {
  id: string;
  name: string;
  code: string; // unique, e.g., ECON, VIP
  defaultPrice: number;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateTicketTemplateRequest = Omit<TicketTemplateDto, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTicketTemplateRequest = Partial<CreateTicketTemplateRequest> & { id: string };
