import React from "react";
import { cn } from "@/lib/utils/utils";

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
      className={cn(
        "w-10 h-10 m-1 rounded flex items-center justify-center border text-xs font-bold transition-all",
        // Base styles based on type
        type === "Soft" 
          ? "bg-primary/10 text-primary border-primary/20" 
          : "bg-secondary/20 text-secondary-foreground border-secondary/20",
        
        // Availability styles
        !isAvailable 
          ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground border-border" 
          : "hover:bg-primary/20 hover:border-primary/40 cursor-pointer",
          
        // Selected state
        selected && "ring-2 ring-primary bg-primary text-primary-foreground border-primary"
      )}
      disabled={!isAvailable}
      onClick={onSelect}
      aria-label={`Seat ${seatNumber} ${type} ${isAvailable ? "available" : "unavailable"}`}
    >
      {seatNumber}
    </button>
  );
};
