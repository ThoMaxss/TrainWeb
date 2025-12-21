export enum SeatType {
  Hard = 0,
  Soft = 1
}

export interface SeatEntity {
  id: string;
  tripId: string;
  seatNumber: string;
  type: SeatType;
  isAvailable: boolean;
  price: number;
}

export interface SeatDto {
  id?: string;
  trip?: any;
  seatNumber?: string;
  type?: SeatType | "Hard" | "Soft";
  isAvailable?: boolean;
  price?: number;
}

export const SEAT_TYPE_LABELS: Record<SeatType, string> = {
  [SeatType.Hard]: 'Ghế cứng',
  [SeatType.Soft]: 'Ghế mềm'
};

export function isSeatType(value: number): value is SeatType {
  return value >= 0 && value <= 1;
}

export function normalizeSeatType(type: SeatType | "Hard" | "Soft" | undefined): SeatType | undefined {
  if (type === undefined) return undefined;
  if (type === "Hard") return SeatType.Hard;
  if (type === "Soft") return SeatType.Soft;
  return type as SeatType;
}
