"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Train, Clock, MapPin, CheckCircle2, ChevronDown, ChevronUp, Calendar, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getTrainById } from "@/lib/api/train";
import { getSeatsByTripId, getTripById } from "@/lib/api/trip";
import type { TrainDto, TripDto, SeatDto } from "@/types";

interface TrainDetailPageProps {
  params: { id: string };
}

// Step Indicator Component
function StepIndicator({ steps }: { steps: Array<{ label: string; status: "completed" | "current" | "upcoming" }> }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      {steps.map((step, index) => (
        <div key={index} className="flex min-w-0 flex-1 items-center">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                step.status === "completed"
                  ? "bg-success text-primary-foreground"
                  : step.status === "current"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.status === "completed" ? "✓" : index + 1}
            </div>
            <span
              className={`truncate text-sm font-medium ${
                step.status === "current"
                  ? "text-primary"
                  : step.status === "completed"
                  ? "text-success"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`mx-3 h-px flex-1 ${
                steps[index + 1]?.status === "completed" ? "bg-success" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function TrainDetailPage({ params }: TrainDetailPageProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const passedTrainId = sp.get("trainId") || params.id;
  const tripId = sp.get("tripId") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [train, setTrain] = useState<TrainDto | null>(null);
  const [trip, setTrip] = useState<TripDto | null>(null);
  const [seats, setSeats] = useState<SeatDto[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    Promise.all([
      getTrainById(passedTrainId),
      getTripById(tripId),
      getSeatsByTripId(tripId),
    ])
      .then(([trainData, tripData, seatData]) => {
        if (!mounted) return;
        setTrain(trainData);
        setTrip(tripData);
        if (!seatData) {
          console.warn(`⚠️ No seats found for trip ID: ${tripId}`);
          setSeats([]);
        } else {
          setSeats(seatData);
        }
      })
      .catch((error) => {
        if (!mounted) return;
        console.error('API Error:', error);
        setError("Không thể tải dữ liệu từ server. Vui lòng kiểm tra backend đang chạy ở https://localhost:7128");
        setTrain(null);
        setTrip(null);
        setSeats([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [passedTrainId, tripId]);

  const steps = [
    { label: "Chi tiết tàu", status: "current" as const },
    { label: "Chọn ghế", status: "upcoming" as const },
    { label: "Thanh toán", status: "upcoming" as const },
    { label: "Xác nhận", status: "upcoming" as const },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleContinue = (seatType?: string) => {
    // Navigate to booking flow if needed
    router.push(`/booking/${passedTrainId}?tripId=${tripId}${seatType ? `&seatType=${encodeURIComponent(seatType)}` : ""}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-card">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-3" />
          <p className="text-muted-foreground">Đang tải thông tin tàu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // still render using fallback if available
  }

  // Compute times and price
  const departure = trip?.departureTime ? new Date(trip.departureTime) : null;
  const arrival = trip?.arrivalTime ? new Date(trip.arrivalTime) : null;
  const durationMs = departure && arrival ? arrival.getTime() - departure.getTime() : null;
  const durationText = durationMs && durationMs > 0
    ? `${Math.floor(durationMs / 3600000)}h ${Math.round((durationMs % 3600000) / 60000)}m`
    : "--";

  const availableSeats = seats.filter((s) => s.isAvailable && typeof s.price === "number") as Required<SeatDto>[];
  const minPrice = availableSeats.length ? Math.min(...availableSeats.map((s) => s.price!)) : undefined;

  const seatGroups = (() => {
    const map = new Map<string, { name: string; available: number; price: number }>();
    for (const s of seats) {
      const typeName = s.type === "Soft" ? "Ngồi mềm" : s.type === "Hard" ? "Ngồi cứng" : (s.type ?? "Ghế");
      const current = map.get(typeName) || { name: typeName, available: 0, price: Number.POSITIVE_INFINITY };
      if (s.isAvailable) current.available += 1;
      if (typeof s.price === "number") current.price = Math.min(current.price, s.price);
      map.set(typeName, current);
    }
    return Array.from(map.values()).map(g => ({ ...g, price: isFinite(g.price) ? g.price : 0 }));
  })();

  return (
    <div className="min-h-screen bg-card">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
        <div className="container mx-auto px-2 lg:px-2 py-2">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" onClick={handleBack} className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                    <Train className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="leading-tight">SE3 - Tàu Thống Nhất</h1>
                    <p className="text-sm text-muted-foreground">Hà Nội → Đà Nẵng</p>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1.5 border-primary bg-primary/10 text-primary">
                  <Calendar className="h-3.5 w-3.5" />
                  15/11/2025
                </Badge>
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          <StepIndicator steps={steps} />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-2 lg:px-2 py-5">
        <div className="mx-auto max-w-5xl space-y-3">
          {/* Train Journey Info */}
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 text-primary-foreground">
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <div className="mb-1 text-sm text-primary-foreground">Khởi hành</div>
                  <div className="mb-1">{departure ? departure.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "--:--"}</div>
                  <div className="text-sm text-primary-foreground">{trip?.departureStation ?? ""}</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-2 flex items-center gap-2 rounded-full bg-background/20 px-2 py-1.5 backdrop-blur-sm">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{durationText}</span>
                  </div>
                  <div className="h-px w-full bg-background/30"></div>
                </div>
                <div className="text-right md:text-left">
                  <div className="mb-1 text-sm text-primary-foreground">Đến nơi</div>
                  <div className="mb-1">{arrival ? arrival.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "--:--"}</div>
                  <div className="text-sm text-primary-foreground">{trip?.arrivalStation ?? ""}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Seat Types */}
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="border-b bg-card p-2">
              <h2>Chọn loại ghế & Giá vé</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Chọn loại ghế phù hợp với nhu cầu của bạn
              </p>
            </div>

            <div className="divide-y">
              {seatGroups.map((seat, index) => (
                <div key={index} className="p-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3>{seat.name}</h3>
                        <Badge
                          variant={seat.available > 10 ? "secondary" : "destructive"}
                          className={
                            seat.available > 10
                              ? "bg-success/10 text-success hover:bg-success/10"
                              : ""
                          }
                        >
                          {seat.available > 10 ? (
                            <>
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                              Còn {seat.available} chỗ
                            </>
                          ) : (
                            <>
                              <Info className="mr-1 h-3.5 w-3.5" />
                              Sắp hết ({seat.available} chỗ)
                            </>
                          )}
                        </Badge>
                      </div>

                      <div className="mb-1 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        {seat.price?.toLocaleString("vi-VN")}đ
                      </div>
                    </div>

                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      onClick={() => handleContinue(seat.name)}
                    >
                      Chọn ghế
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Ticket Policy */}
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="p-2">
              <h3 className="mb-3">Chính sách vé</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                  <div>
                    <div className="mb-1">Hoàn/Đổi vé linh hoạt</div>
                    <p className="text-sm text-muted-foreground">
                      Hoàn 70% giá vé khi hủy trước 24h. Đổi vé miễn phí trước 12h.
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                  <div>
                    <div className="mb-1">Vé điện tử QR Code</div>
                    <p className="text-sm text-muted-foreground">
                      Nhận vé điện tử qua email ngay sau khi thanh toán. Không cần in vé.
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                  <div>
                    <div className="mb-1">Xuất hóa đơn VAT</div>
                    <p className="text-sm text-muted-foreground">
                      Xuất hóa đơn VAT cho doanh nghiệp. Yêu cầu trong vòng 7 ngày sau khi đặt vé.
                    </p>
                  </div>
                </div>

                <Separator />
                
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                  <div>
                    <div className="mb-1">Bảo hiểm hành trình</div>
                    <p className="text-sm text-muted-foreground">
                      Tùy chọn mua thêm bảo hiểm hành trình với mức phí 50.000đ/người.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="sticky bottom-0 z-40 border-t bg-background shadow-lg">
        <div className="container mx-auto px-2 lg:px-2 py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="hidden sm:block">
              <div className="text-sm text-muted-foreground">Giá từ</div>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {minPrice ? `${minPrice.toLocaleString("vi-VN")}đ` : "--"}
              </div>
            </div>
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 sm:flex-none sm:px-12"
              onClick={() => handleContinue()}
            >
              Chọn loại ghế & Tiếp tục
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
