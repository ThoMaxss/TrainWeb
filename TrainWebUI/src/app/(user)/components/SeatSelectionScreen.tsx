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
import { TripDto, SeatDto, SeatType } from "@/types";
import { SEAT_TYPE_LABELS } from "@/types/seat";

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
  const [selectedSeatType, setSelectedSeatType] = useState<SeatType | null>(null);
  const [availableSeatTypes, setAvailableSeatTypes] = useState<SeatType[]>([]);

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
          // Determine available seat types from data
          const types = Array.from(
            new Set(
              seatsData
                .map(s => s.type)
                .filter((t): t is SeatType => typeof t === 'number')
            )
          );
          setAvailableSeatTypes(types);
          // Initialize selected seat type: from preSelectedSeatType label or first available
          if (types.length > 0) {
            let initial: SeatType | null = null;
            if (preSelectedSeatType) {
              const matchEntry = Object.entries(SEAT_TYPE_LABELS).find(([, label]) => label === preSelectedSeatType);
              if (matchEntry) initial = Number(matchEntry[0]) as SeatType;
            }
            setSelectedSeatType(initial ?? types[0]);
          } else {
            setSelectedSeatType(null);
          }
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
    if (!seat.id) return;
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat.id!)
        ? prevSelected.filter((id) => id !== seat.id)
        : [...prevSelected, seat.id!]
    );
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      setError("Vui lòng chọn ít nhất một ghế.");
      return;
    }
    // Chuyển đổi seats thành SelectedSeat format
    const selectedSeatDetails: SelectedSeat[] = seats
      .filter(seat => seat.id && selectedSeats.includes(seat.id))
      .map(seat => ({
        id: seat.id!,
        coachNumber: 1,
        seatNumber: seat.seatNumber || '',
        seatType: selectedSeatType != null ? SEAT_TYPE_LABELS[selectedSeatType] : "",
        price: seat.price || 0
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <StepIndicator steps={steps} />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Chọn ghế cho chuyến đi của bạn</h1>
          {trip && (
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Train className="h-4 w-4" />
                <span>{trip.train?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{trip.originStation || 'N/A'} → {trip.destinationStation || 'N/A'}</span>
              </div>
              {trip.departure && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(trip.departure).toLocaleString('vi-VN')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Seat type selector - IMPROVED UI */}
        <Card className="mb-6 p-4">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Chọn loại ghế</h3>
            </div>
            <p className="text-sm text-muted-foreground">Lựa chọn loại ghế phù hợp với nhu cầu của bạn</p>
          </div>
          
          <Tabs
            value={selectedSeatType != null ? String(selectedSeatType) : "all"}
            onValueChange={(val) => {
              if (val === "all") {
                setSelectedSeatType(null);
                setSelectedSeats([]);
                return;
              }
              const num = Number(val);
              if (!Number.isNaN(num)) {
                setSelectedSeatType(num as SeatType);
                setSelectedSeats([]); // reset selections when switching type
              }
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="all" className="py-3 text-base">
                <div className="flex flex-col items-center gap-1">
                  <Sparkles className="h-5 w-5" />
                  <span>Tất cả</span>
                </div>
              </TabsTrigger>
              {availableSeatTypes.map((t) => (
                <TabsTrigger key={t} value={String(t)} className="py-3 text-base">
                  <div className="flex flex-col items-center gap-1">
                    <Train className="h-5 w-5" />
                    <span className="font-medium">{SEAT_TYPE_LABELS[t]}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {selectedSeatType !== null && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-primary font-medium">
                ✓ Đang hiển thị ghế: {SEAT_TYPE_LABELS[selectedSeatType]}
              </p>
            </div>
          )}
        </Card>

        <SeatMap
          tripId={tripId}
          coachNumber={1}
          seatType={selectedSeatType}
          layout="2+2"
          onSeatSelect={handleSeatSelect}
          selectedSeats={selectedSeats}
        />
        <SeatSummaryPanel
          selectedSeats={seats
            .filter(seat => seat.id && selectedSeats.includes(seat.id))
            .map(seat => ({
              id: seat.id!,
              coachNumber: 1,
              seatNumber: seat.seatNumber || '',
              seatType: selectedSeatType != null ? SEAT_TYPE_LABELS[selectedSeatType] : "",
              price: seat.price || 0
            }))
          }
          onRemoveSeat={(seatId) => {
            setSelectedSeats(prev => prev.filter(id => id !== seatId));
          }}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
}
