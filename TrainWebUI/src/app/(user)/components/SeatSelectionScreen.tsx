import { useState, useEffect } from "react";
import { ArrowLeft, Train, Sparkles, Filter, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StepIndicator } from "./StepIndicator";
import { SeatMap } from "./SeatMap";
import { SeatSummaryPanel } from "./SeatSummaryPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTripById, getSeatsByTripId } from "@/lib/api/trip";
import { TripDto, SeatDto } from "@/types";

interface SelectedSeat {
  id: string;
  coachNumber: number;
  seatNumber: string;
  seatType: string;
  price: number;
}

interface SeatSelectionScreenProps {
  tripId: string;
  onBack: () => void;
  onContinue: (selectedSeats: SelectedSeat[]) => void;
  preSelectedSeatType?: string | null;
}

export function SeatSelectionScreen({ tripId, onBack, onContinue, preSelectedSeatType }: SeatSelectionScreenProps) {
  const steps = [
    { label: "Chi tiết tàu", status: "completed" as const },
    { label: "Chọn ghế", status: "current" as const },
    { label: "Thanh toán", status: "upcoming" as const },
    { label: "Xác nhận", status: "upcoming" as const },
  ];

  const [trip, setTrip] = useState<TripDto | null>(null);
  const [seats, setSeats] = useState<SeatDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getTripById(tripId),
      getSeatsByTripId(tripId)
    ])
      .then(([tripData, seatsData]) => {
        setTrip(tripData);
        if (!seatsData) {
          console.warn(`⚠️ No seats found for trip ID: ${tripId}`);
          setSeats([]);
          setError("Không tìm thấy ghế cho chuyến tàu này.");
        } else {
          setSeats(seatsData);
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
        setError("Không thể tải dữ liệu từ server. Kiểm tra backend đang chạy.");
        setSeats([]);
      })
      .finally(() => setLoading(false));
  }, [tripId]);

  const handleSeatSelect = (seat: SeatDto) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat.id)
        ? prevSelected.filter((id) => id !== seat.id)
        : [...prevSelected, seat.id]
    );
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      setError("Vui lòng chọn ít nhất một ghế.");
      return;
    }
    // Chuyển đổi seats thành SelectedSeat format
    const selectedSeatDetails: SelectedSeat[] = seats
      .filter(seat => selectedSeats.includes(seat.id))
      .map(seat => ({
        id: seat.id,
        coachNumber: seat.coach,
        seatNumber: seat.seatNumber,
        seatType: preSelectedSeatType || "Ghế mềm",
        price: seat.price
      }));
    onContinue(selectedSeatDetails);
  };

  if (loading) {
    return <div>Loading...</div>; // Thay bằng component loading thích hợp
  }

  if (error) {
    return <div>{error}</div>; // Thay bằng component error thích hợp
  }

  return (
    <div>
      <StepIndicator steps={steps} />
      <h1>Chọn ghế cho chuyến đi của bạn</h1>
      <SeatMap
        tripId={tripId}
        coachNumber={1}
        seatType={preSelectedSeatType || "Ghế mềm"}
        layout="2+2"
        onSeatSelect={handleSeatSelect}
        selectedSeats={selectedSeats}
      />
      <SeatSummaryPanel
        selectedSeats={seats
          .filter(seat => selectedSeats.includes(seat.id))
          .map(seat => ({
            id: seat.id,
            coachNumber: seat.coach,
            seatNumber: seat.seatNumber,
            seatType: preSelectedSeatType || "Ghế mềm",
            price: seat.price
          }))
        }
        onRemoveSeat={(seatId) => {
          setSelectedSeats(prev => prev.filter(id => id !== seatId));
        }}
        onContinue={handleContinue}
      />
    </div>
  );
}
