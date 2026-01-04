import React from "react";

interface SeatItemProps {
  seatNumber: string;
  type: "Hard" | "Soft";
  isAvailable: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export const SeatItem: React.FC<SeatItemProps> = ({ seatNumber, type, isAvailable, selected, onSelect }) => {
  return (
    <button
      className={`w-10 h-10 m-1 rounded flex items-center justify-center border text-xs font-bold
        ${type === "Soft" ? "bg-blue-200" : "bg-yellow-200"}
        ${!isAvailable ? "opacity-40 cursor-not-allowed" : "hover:bg-green-200"}
        ${selected ? "ring-2 ring-green-500" : ""}
      `}
      disabled={!isAvailable}
      onClick={onSelect}
      aria-label={`Seat ${seatNumber} ${type} ${isAvailable ? "available" : "unavailable"}`}
    >
      {seatNumber}
    </button>
  );
};
