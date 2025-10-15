import { apiFetch } from './config';
import { TripDto, SeatDto } from '@/types';

// Trip endpoints based on backend documentation

// GET /api/trip - Get all trips
export async function getAllTrips(): Promise<TripDto[]> {
  return apiFetch<TripDto[]>('/trip');
}

// GET /api/trip/{id} - Get trip by ID
export async function getTripById(id: string): Promise<TripDto> {
  return apiFetch<TripDto>(`/trip/${id}`);
}

// POST /api/trip - Create trip
export async function createTrip(tripData: TripDto): Promise<TripDto> {
  return apiFetch<TripDto>('/trip', {
    method: 'POST',
    body: JSON.stringify(tripData),
  });
}

// PUT /api/trip/{id} - Update trip
export async function updateTrip(id: string, tripData: TripDto): Promise<TripDto> {
  return apiFetch<TripDto>(`/trip/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tripData),
  });
}

// DELETE /api/trip/{id} - Delete trip
export async function deleteTrip(id: string): Promise<void> {
  return apiFetch<void>(`/trip/${id}`, {
    method: 'DELETE',
  });
}

// GET /api/trip/{id}/seats - Get seats by trip ID
export async function getSeatsByTripId(tripId: string): Promise<SeatDto[] | null> {
  return apiFetch<SeatDto[]>(`/trip/${tripId}/seats`);
}

// Custom search functions (you may need to implement these on backend)
export async function searchTrips(params: {
  originStation?: string;
  destinationStation?: string;
  departure?: string;
}): Promise<TripDto[]> {
  // Filter trips based on parameters
  const allTrips = await getAllTrips();
  
  return allTrips.filter(trip => {
    if (params.originStation && trip.departureStation !== params.originStation) return false;
    if (params.destinationStation && trip.arrivalStation !== params.destinationStation) return false;
    if (params.departure) {
      const tripDate = new Date(trip.departureTime).toDateString();
      const searchDate = new Date(params.departure).toDateString();
      if (tripDate !== searchDate) return false;
    }
    return true;
  });
}
