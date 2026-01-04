import { apiFetch } from "./config";
import { withRequestCache } from "./request-cache";
import { SeatType, SeatDto as AppSeatDto } from "@/types/seat";

// GET /api/trips/{tripId}/seats - Get all seats by trip ID
export async function getSeatsByTripId(tripId: string): Promise<AppSeatDto[]> {
  try {
    const data = await withRequestCache(`getSeatsByTripId:${tripId}`, () =>
      apiFetch<AppSeatDto[]>(`/trips/${tripId}/seats`)
    );
    console.log(`✅ Fetched seats for trip ${tripId}:`, data);
    
    // Normalize type to SeatType enum
    return data.map(seat => ({
      ...seat,
      type:
        typeof seat.type === "string"
          ? seat.type === "Hard"
            ? SeatType.Hard
            : SeatType.Soft
          : seat.type,
    }));
  } catch (error) {
    console.error(`❌ Error fetching seats for trip ${tripId}:`, error);
    throw error;
  }
}

// GET /api/trips/{tripId}/seats/{seatId} - Get seat by ID
export async function getSeatById(tripId: string, seatId: string): Promise<AppSeatDto> {
  const seat = await apiFetch<AppSeatDto>(`/trips/${tripId}/seats/${seatId}`);
  return {
    ...seat,
    type:
      typeof seat.type === "string"
        ? seat.type === "Hard"
          ? SeatType.Hard
          : SeatType.Soft
        : seat.type,
  };
}

// POST /api/trips/{tripId}/seats - Create seat
export async function createSeat(tripId: string, seatData: AppSeatDto): Promise<AppSeatDto> {
  return apiFetch<AppSeatDto>(`/trips/${tripId}/seats`, {
    method: 'POST',
    body: JSON.stringify(seatData),
  });
}

// PUT /api/trips/{tripId}/seats/{seatId} - Update seat
export async function updateSeat(tripId: string, seatId: string, seatData: AppSeatDto): Promise<AppSeatDto> {
  return apiFetch<AppSeatDto>(`/trips/${tripId}/seats/${seatId}`, {
    method: 'PUT',
    body: JSON.stringify(seatData),
  });
}

// DELETE /api/trips/{tripId}/seats/{seatId} - Delete seat
export async function deleteSeat(tripId: string, seatId: string): Promise<void> {
  return apiFetch<void>(`/trips/${tripId}/seats/${seatId}`, {
    method: 'DELETE',
  });
}

// PATCH /api/trips/{tripId}/seats/{seatId}/availability - Update seat availability
export async function updateSeatAvailability(
  tripId: string,
  seatId: string,
  isAvailable: boolean
): Promise<void> {
  return apiFetch<void>(`/trips/${tripId}/seats/${seatId}/availability?isAvailable=${isAvailable}`, {
    method: 'PATCH',
  });
}
