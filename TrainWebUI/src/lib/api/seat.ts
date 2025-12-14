import { apiFetch } from "./config";
import { withRequestCache } from "./request-cache";
import { SeatType, SeatDto as AppSeatDto } from "@/types/seat";

// Use the app-wide SeatDto type, but normalize type from API
export async function getSeatsByTripId(tripId: string): Promise<AppSeatDto[]> {
  try {
    const data = await withRequestCache(`getSeatsByTripId:${tripId}`, () =>
      apiFetch<any[]>(`/Seat/trip/${tripId}`)
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
