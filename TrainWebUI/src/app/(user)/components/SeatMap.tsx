"use client";
import React from "react";
import { SeatDto, SeatType } from "@/types/seat";
import { SeatItem } from "./SeatItem";

interface SeatMapProps {
  seats: SeatDto[];
  loading: boolean;
  error: string | null;
  selectedSeatIds: string[];
  selectedSeatType: SeatType | null;
  onSelectSeat?: (seat: SeatDto) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  loading,
  error,
  selectedSeatIds,
  selectedSeatType,
  onSelectSeat,
}) => {

  // Filter seats by type if selected, and ensure all required properties exist
  let filteredSeats = seats.filter(
    seat => seat.seatNumber && seat.type !== undefined && seat.isAvailable !== undefined
  );
  if (selectedSeatType !== null) {
    filteredSeats = filteredSeats.filter(seat => {
      const seatType = typeof seat.type === 'string' 
        ? (seat.type === 'Hard' ? SeatType.Hard : SeatType.Soft)
        : seat.type;
      return seatType === selectedSeatType;
    });
  }
  const validSeats = filteredSeats;
  // Group seats by row (assuming seatNumber like "A1", "A2", ...)
  const seatRows: Record<string, SeatDto[]> = {};
  validSeats.forEach(seat => {
    const row = seat.seatNumber!.charAt(0);
    if (!seatRows[row]) seatRows[row] = [];
    seatRows[row].push(seat);
  });

  if (loading) return <div>Đang tải sơ đồ ghế...</div>;
  if (error) return <div className="text-destructive">{error}</div>;

  return (
    <div className="inline-block p-4 bg-card rounded shadow border border-border">
      {Object.keys(seatRows).sort().map(row => (
        <div key={row} className="flex mb-2">
          <span className="w-6 font-bold flex items-center justify-center mr-2 text-foreground">{row}</span>
          {seatRows[row]
            .sort((a, b) => parseInt(a.seatNumber!.slice(1)) - parseInt(b.seatNumber!.slice(1)))
            .map(seat => (
              <SeatItem
                key={seat.id}
                seatNumber={seat.seatNumber!}
                type={typeof seat.type === 'string' ? (seat.type as "Hard" | "Soft") : (seat.type === 0 ? "Hard" : "Soft")}
                isAvailable={seat.isAvailable!}
                selected={selectedSeatIds.includes(seat.id!)}
                onSelect={() => onSelectSeat?.(seat)}
              />
            ))}
        </div>
      ))}
    </div>
  );
};
