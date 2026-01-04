import { apiFetch } from './config';
import { withRequestCache } from './request-cache';
import { TripDto, SeatDto } from '@/types';

// Trip endpoints based on backend documentation

// GET /api/Trip - Get all trips
export async function getAllTrips(): Promise<TripDto[]> {
  return withRequestCache('getAllTrips', () => apiFetch<TripDto[]>('/Trip'));
}

// GET /api/Trip/{id} - Get trip by ID
export async function getTripById(id: string): Promise<TripDto> {
  return withRequestCache(`getTripById:${id}`, () => apiFetch<TripDto>(`/Trip/${id}`));
}

// POST /api/Trip - Create trip
export async function createTrip(tripData: TripDto): Promise<TripDto> {
  return apiFetch<TripDto>('/Trip', {
    method: 'POST',
    body: JSON.stringify(tripData),
  });
}

// PUT /api/Trip/{id} - Update trip
export async function updateTrip(id: string, tripData: TripDto): Promise<TripDto> {
  return apiFetch<TripDto>(`/Trip/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tripData),
  });
}

// DELETE /api/Trip/{id} - Delete trip
export async function deleteTrip(id: string): Promise<void> {
  return apiFetch<void>(`/Trip/${id}`, {
    method: 'DELETE',
  });
}

// GET /api/Seat/trip/{tripId} - Get seats by trip ID
export async function getSeatsByTripId(tripId: string): Promise<SeatDto[] | null> {
  try {
    const seats = await withRequestCache(`getSeatsByTripId:${tripId}`, () => 
      apiFetch<SeatDto[]>(`/Seat/trip/${tripId}`)
    );
    return seats;
  } catch (error) {
    console.error(`Failed to fetch seats for trip ${tripId}:`, error);
    return null;
  }
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
    if (params.originStation && trip.originStation !== params.originStation) return false;
    if (params.destinationStation && trip.destinationStation !== params.destinationStation) return false;
    if (params.departure && trip.departure) {
      const tripDate = new Date(trip.departure).toDateString();
      const searchDate = new Date(params.departure).toDateString();
      if (tripDate !== searchDate) return false;
    }
    return true;
  });
}
