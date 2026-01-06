import { SeatDto } from './seat';

export enum TicketStatus {
  Active = 0,
  Used = 1,
  Cancelled = 2
}

export interface TicketTypeDto {
  id?: string;
  name?: string | null;
  discountPercent?: number;
}

export interface TicketEntity {
  id?: string; // Optional when creating, required in response
  bookingId?: string; // Optional vì response từ backend không có
  seat?: SeatDto; // Backend trả về nested seat object
  ticketType?: TicketTypeDto; // Backend trả về nested ticketType
  qrCode?: string;
  status: TicketStatus | string; // Backend trả về string "Active" thay vì số
}

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.Active]: 'Đang hoạt động',
  [TicketStatus.Used]: 'Đã sử dụng',
  [TicketStatus.Cancelled]: 'Đã hủy'
};

// Helper to convert string status to enum
export function parseTicketStatus(status: string | TicketStatus): TicketStatus {
  if (typeof status === 'number') return status;
  
  switch (status.toLowerCase()) {
    case 'active': return TicketStatus.Active;
    case 'used': return TicketStatus.Used;
    case 'cancelled': return TicketStatus.Cancelled;
    default: return TicketStatus.Active;
  }
}
