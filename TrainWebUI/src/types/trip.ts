import { TrainDto } from './train';

export interface TripEntity {
  id: string;
  trainId: string;
  departure: string;
  arrival: string;
  originStation: string;
  destinationStation: string;
  seatsAvailable: number;
}

export interface TripDto {
  id?: string;
  train?: TrainDto;
  departure?: string;
  arrival?: string;
  originStation?: string;
  destinationStation?: string;
  seatsAvailable?: number;
}

export interface TripSearchFilters {
  originStation?: string;
  destinationStation?: string;
  departureDate?: string;
  trainType?: string;
}

export interface TripSearchParams {
  originStation: string;
  destinationStation: string;
  departureDate: string;
  returnDate?: string;
}
