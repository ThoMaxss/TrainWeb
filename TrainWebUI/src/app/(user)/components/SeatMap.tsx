import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { getSeatsByTripId } from "@/lib/api/trip";
import { SeatDto } from "@/types";

interface SeatMapProps {
  tripId: string;
  coachNumber: number;
  seatType: string;
  layout: "2+2" | "3+3" | "2+1" | "4-berth" | "6-berth";
  onSeatSelect: (seat: SeatDto) => void;
  selectedSeats: string[];
}

// Helper functions for seat layout
const getLayoutConfig = (layout: SeatMapProps['layout']) => {
  switch (layout) {
    case "2+2":
      return { seatsPerRow: 4, leftSeats: 2, rightSeats: 2, hasAisle: true };
    case "3+3":
      return { seatsPerRow: 6, leftSeats: 3, rightSeats: 3, hasAisle: true };
    case "2+1":
      return { seatsPerRow: 3, leftSeats: 2, rightSeats: 1, hasAisle: true };
    case "4-berth":
      return { seatsPerRow: 2, leftSeats: 1, rightSeats: 1, hasAisle: false };
    case "6-berth":
      return { seatsPerRow: 3, leftSeats: 2, rightSeats: 1, hasAisle: false };
    default:
      return { seatsPerRow: 4, leftSeats: 2, rightSeats: 2, hasAisle: true };
  }
};

const renderSeatRow = (rowSeats: SeatDto[], config: ReturnType<typeof getLayoutConfig>, onSeatSelect: (seat: SeatDto) => void, selectedSeats: string[], seatType: string, coachNumber: number) => {
  const leftSeats = rowSeats.slice(0, config.leftSeats);
  const rightSeats = rowSeats.slice(config.leftSeats);

  return (
    <div className="flex items-center justify-center gap-2 mb-2">
      {/* Left side seats */}
      <div className="flex gap-1">
        {leftSeats.map((seat) => (
          <SeatButton 
            key={seat.id} 
            seat={seat} 
            onSeatSelect={onSeatSelect} 
            selectedSeats={selectedSeats}
            seatType={seatType}
            coachNumber={coachNumber}
          />
        ))}
      </div>
      
      {/* Aisle */}
      {config.hasAisle && <div className="w-8 border-l border-r border-border h-12 flex items-center justify-center">
        <div className="text-xs text-muted-foreground transform rotate-90">Lối đi</div>
      </div>}
      
      {/* Right side seats */}
      <div className="flex gap-1">
        {rightSeats.map((seat) => (
          <SeatButton 
            key={seat.id} 
            seat={seat} 
            onSeatSelect={onSeatSelect} 
            selectedSeats={selectedSeats}
            seatType={seatType}
            coachNumber={coachNumber}
          />
        ))}
      </div>
    </div>
  );
};

const SeatButton = ({ seat, onSeatSelect, selectedSeats, seatType, coachNumber }: {
  seat: SeatDto;
  onSeatSelect: (seat: SeatDto) => void;
  selectedSeats: string[];
  seatType: string;
  coachNumber: number;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <motion.div
          layoutId={`seat-${seat.id}`}
          className={`h-12 w-12 rounded-lg flex items-center justify-center cursor-pointer text-sm font-medium
          ${selectedSeats.includes(String(seat.id)) 
            ? "bg-primary text-primary-foreground shadow-md" 
            : seat.isAvailable 
              ? "bg-success/10 text-emerald-800 hover:bg-emerald-200 border border-emerald-300" 
              : "bg-error/10 text-destructive cursor-not-allowed border border-destructive/30"}
          `}
          onClick={() => seat.isAvailable && onSeatSelect(seat)}
          whileHover={seat.isAvailable ? { scale: 1.05 } : {}}
          whileTap={seat.isAvailable ? { scale: 0.95 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {seat.seatNumber}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div className="font-medium">Ghế {seat.seatNumber}</div>
          <div className="text-xs text-muted-foreground">
            {seat.isAvailable ? "Có thể đặt" : "Đã có khách"}
          </div>
          <div className="text-xs">
            Loại: {seatType} • Toa: {coachNumber}
          </div>
          {seat.price && (
            <div className="text-xs font-medium text-primary">
              {seat.price.toLocaleString()} VND
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function SeatMap({
  tripId,
  coachNumber,
  seatType,
  layout,
  onSeatSelect,
  selectedSeats,
}: SeatMapProps) {
  const [seats, setSeats] = useState<SeatDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSeatsByTripId(tripId)
      .then((data) => {
        if (!data) {
          console.warn(`⚠️ No seats found for trip ID: ${tripId}`);
          setSeats([]);
          setError("Không tìm thấy ghế cho chuyến tàu này.");
        } else {
          setSeats(data);
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
        setError("Không thể tải dữ liệu ghế từ server. Kiểm tra kết nối backend.");
        setSeats([]);
      })
      .finally(() => setLoading(false));
  }, [tripId]);

  if (loading) {
    const config = getLayoutConfig(layout);
    return (
      <div className="rounded-lg border bg-background p-2 animate-pulse">
        <div className="h-6 w-1/3 bg-muted rounded mb-2" />
        <div className="h-4 w-1/4 bg-card rounded mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: config.leftSeats }).map((_, j) => (
                  <div key={j} className="h-12 w-12 bg-card rounded-lg" />
                ))}
              </div>
              {config.hasAisle && <div className="w-8 h-12 bg-card rounded" />}
              <div className="flex gap-1">
                {Array.from({ length: config.rightSeats }).map((_, j) => (
                  <div key={j} className="h-12 w-12 bg-card rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-background p-2">
        <div className="text-error mb-3 p-2 bg-error/10 rounded-lg border border-destructive/20">
          <div className="font-medium">Lỗi tải dữ liệu ghế</div>
          <div className="text-sm mt-1">{error}</div>
        </div>
        {seats.length > 0 && (
          <div className="space-y-2">
            {/* Render fallback seats in simple grid */}
            <div className="grid grid-cols-5 gap-2">
              {seats.slice(0, 20).map((seat) => (
                <div key={seat.id} className="h-12 w-12 bg-card rounded-lg flex items-center justify-center text-sm">
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const config = getLayoutConfig(layout);
  
  // Group seats into rows based on layout
  const seatRows: SeatDto[][] = [];
  for (let i = 0; i < seats.length; i += config.seatsPerRow) {
    seatRows.push(seats.slice(i, i + config.seatsPerRow));
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      {/* Header */}
      <div className="mb-3">
        <div className="text-lg font-semibold text-foreground">
          Sơ đồ ghế tàu {tripId} - Toa {coachNumber}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Layout: {layout} • Loại ghế: {seatType}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-3 p-2 bg-card rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-success/10 border border-emerald-300 rounded"></div>
          <span className="text-sm text-foreground">Trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded"></div>
          <span className="text-sm text-foreground">Đã chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-error/10 border border-destructive/30 rounded"></div>
          <span className="text-sm text-foreground">Đã đặt</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="space-y-1">
        {seatRows.map((rowSeats, rowIndex) => (
          <div key={rowIndex}>
            {renderSeatRow(rowSeats, config, onSeatSelect, selectedSeats, seatType, coachNumber)}
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="text-sm text-muted-foreground">
          Tổng số ghế: {seats.length} • Còn trống: {seats.filter(s => s.isAvailable).length}
        </div>
      </div>
    </div>
  );
}
