import { TrainDto } from './train';

export interface TripDto {
  id: string;
  trainId: string;
  train: TrainDto;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  basePrice: number;
  availableSeats: number;
  totalSeats: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Params cho search chuyến tàu
export interface TripSearchParams {
  departureStation: string;
  arrivalStation: string;
  departureDate: string;
  returnDate?: string;
}
