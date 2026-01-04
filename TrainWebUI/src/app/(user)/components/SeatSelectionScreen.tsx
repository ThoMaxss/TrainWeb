import { useState, useEffect } from "react";
import { ArrowLeft, Train, Sparkles, Filter, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepIndicator } from "./StepIndicator";
import { SeatMap } from "./SeatMap";
import { SeatSummaryPanel } from "./SeatSummaryPanel";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTripById } from "@/lib/api/trip";
import { getSeatsByTripId } from "@/lib/api/seat";
import { SEAT_TYPE_LABELS, SeatType, SeatDto } from "@/types/seat";
import { TripDto } from "@/types/trip";

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
    let mounted = true;
    
    console.log(`🔄 Loading seat selection screen for trip: ${tripId}`);
    
    Promise.all([getTripById(tripId), getSeatsByTripId(tripId)])
      .then(([tripData, seatsData]) => {
        if (!mounted) return;
        console.log(`✅ Trip data:`, tripData);
        console.log(`✅ Seats data:`, seatsData);
        
        setTrip(tripData);
        setSeats(seatsData);
        
        if (!seatsData || seatsData.length === 0) {
          console.warn(`⚠️ No seats returned for trip ${tripId}`);
          setError("Không có ghế nào cho chuyến tàu này.");
          setSelectedSeatType(null);
          setAvailableSeatTypes([]);
          return;
        }
        
        // Normalize type to SeatType enum
        const types = Array.from(
          new Set(
            seatsData
              .map(s => {
                if (typeof s.type === 'string') {
                  return s.type === 'Hard' ? SeatType.Hard : SeatType.Soft;
                }
                return s.type;
              })
              .filter((t): t is SeatType => t === SeatType.Hard || t === SeatType.Soft)
          )
        );
        console.log(`📊 Available seat types:`, types);
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
      })
      .catch((error) => {
        if (!mounted) return;
        console.error(`❌ Error loading seat selection:`, error);
        setError("Không thể tải dữ liệu từ server. Kiểm tra backend đang chạy.");
        setSeats([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    
    return () => { mounted = false; };
  }, [tripId, preSelectedSeatType]);

  const handleSeatSelect = (seat: SeatDto) => {
    if (!seat.id) return;
    setSelectedSeats((prevSelected) => {
      if (prevSelected.includes(seat.id!)) {
        return prevSelected.filter((id) => id !== seat.id);
      } else {
        return [...prevSelected, seat.id!];
      }
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      setError("Vui lòng chọn ít nhất một ghế.");
      return;
    }
    // Chuyển đổi seats thành SelectedSeat format
    const selectedSeatDetails: SelectedSeat[] = seats
      .filter(seat => seat.id && selectedSeats.includes(seat.id))
      .map(seat => {
        // Get seat type label from actual seat data
        let seatTypeLabel = "";
        if (seat.type !== undefined) {
          if (typeof seat.type === 'string') {
            seatTypeLabel = SEAT_TYPE_LABELS[seat.type === 'Hard' ? 0 : 1];
          } else {
            seatTypeLabel = SEAT_TYPE_LABELS[seat.type];
          }
        }
        return {
          id: seat.id!,
          coachNumber: 1,
          seatNumber: seat.seatNumber || '',
          seatType: seatTypeLabel,
          price: seat.price || 0
        };
      });
    onContinue(selectedSeatDetails);
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải sơ đồ chỗ ngồi..." />;
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
          seats={seats}
          loading={loading}
          error={error}
          selectedSeatIds={selectedSeats}
          selectedSeatType={selectedSeatType}
          onSelectSeat={handleSeatSelect}
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
