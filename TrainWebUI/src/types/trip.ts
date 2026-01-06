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
  trainId?: string;
  trainName?: string;
  trainType?: string;
  departure?: string;
  arrival?: string;
  originStationId?: string;
  originStationName?: string;
  destinationStationId?: string;
  destinationStationName?: string;
  seatsAvailable?: number;
}

export interface TripSearchFilters {
  originStationName?: string;
  destinationStationName?: string;
  departureDate?: string;
  trainType?: string;
}

export interface TripSearchParams {
  originStationName: string;
  destinationStationName: string;
  departureDate: string;
  returnDate?: string;
}
