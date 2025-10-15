"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrainCard } from "./TrainCard";
import { searchTrips, getAllTrips, getSeatsByTripId } from "@/lib/api/trip";
import { TripDto, SeatDto } from "@/types";
import { H2, Body } from "@/components/ui/typography";

interface TrainResultsProps {
  onViewDetail?: (tripId: string, trainId?: string) => void;
  searchParams?: {
    originStation?: string;
    destinationStation?: string;
    departure?: string; // ISO date string
  };
  pageSize?: number;
}

function formatCurrencyVND(amount?: number) {
  if (!amount) return "";
  try {
    return amount.toLocaleString("vi-VN") + "đ";
  } catch {
    return `${amount}đ`;
  }
}

export function TrainResults({ onViewDetail, searchParams, pageSize = 5 }: TrainResultsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState<TripDto[]>([]);
  const [page, setPage] = useState(1);
  const [seatInfo, setSeatInfo] = useState<Record<string, { priceFrom?: string; seatClasses: Array<{ name: string; price: string }> }>>({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        let data: TripDto[];
        if (searchParams && (searchParams.originStation || searchParams.destinationStation || searchParams.departure)) {
          data = await searchTrips(searchParams);
        } else {
          data = await getAllTrips();
        }
        if (!mounted) return;
        setTrips(data);
      } catch (e) {
        console.error('API Error:', e);
        if (!mounted) return;
        setError("Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy ở https://localhost:7128");
        setTrips([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [JSON.stringify(searchParams)]);

  const totalPages = Math.max(1, Math.ceil(trips.length / pageSize));
  const pageTrips = useMemo(() => {
    const start = (page - 1) * pageSize;
    return trips.slice(start, start + pageSize);
  }, [trips, page, pageSize]);

  // Load seat pricing for visible trips only
  useEffect(() => {
    let active = true;
    async function loadSeats() {
      const ids = pageTrips.map((t) => t.id).filter(Boolean) as string[];
      if (ids.length === 0) return;
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const seats = await getSeatsByTripId(id);
              if (!seats) {
                console.warn(`⚠️ No seats found for trip ID: ${id}`);
                return { id, info: { priceFrom: undefined, seatClasses: [] } };
              }
              const availableSeats = seats.filter((s) => s.isAvailable && typeof s.price === "number") as Required<SeatDto>[];
              const minPrice = availableSeats.length ? Math.min(...availableSeats.map((s) => s.price!)) : undefined;
              // Group by type for preview classes
              const byType = new Map<string, number>();
              for (const s of availableSeats) {
                const typeName = s.type === "Soft" ? "Ngồi mềm điều hòa" : "Ngồi cứng điều hòa";
                if (!byType.has(typeName)) byType.set(typeName, s.price!);
                else byType.set(typeName, Math.min(byType.get(typeName)!, s.price!));
              }
              const seatClasses = Array.from(byType.entries()).slice(0, 4).map(([name, price]) => ({ name, price: formatCurrencyVND(price) }));
              return { id, info: { priceFrom: minPrice ? formatCurrencyVND(minPrice) : undefined, seatClasses } };
            } catch (error) {
              console.error(`❌ Error loading seats for trip ${id}:`, error);
              return { id, info: { priceFrom: undefined, seatClasses: [] } };
            }
          })
        );
        if (!active) return;
        setSeatInfo((prev) => {
          const next = { ...prev };
          for (const r of results) next[r.id] = r.info;
          return next;
        });
      } catch {
        // ignore seat errors at list level
      }
    }
    loadSeats();
    return () => {
      active = false;
    };
  }, [pageTrips.map((t) => t.id).join(",")]);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <Body className="text-muted-foreground">Đang tìm kiếm chuyến tàu...</Body>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-muted/30" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <H2 className="text-foreground">
          Tìm thấy <span className="text-primary">{trips.length}</span> chuyến tàu
        </H2>
      </div>

      <div className="space-y-3">
        {pageTrips.map((trip, index) => {
          const trainName = trip.train?.type || "Tàu";
          const trainCode = trip.train?.name || trip.train?.id || "";
          const departure = trip.departureTime ? new Date(trip.departureTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "--:--";
          const departureDate = trip.departureTime ? new Date(trip.departureTime).toLocaleDateString("vi-VN") : "";
          // Note: arrival isn't in TripDto; keep blank or compute when backend adds
          const arrival = "";
          const arrivalDate = "";
          const from = trip.departureStation || "";
          const to = trip.arrivalStation || "";
          const duration = "--"; // needs backend to provide or compute
          const stops = ""; // optional until backend provides
          const sInfo = (trip.id && seatInfo[trip.id]) || { seatClasses: [] };
          const priceFrom = sInfo.priceFrom;

          return (
            <TrainCard
              key={trip.id ?? index}
              trainName={trainName}
              trainCode={trainCode}
              departure={departure}
              arrival={arrival}
              departureDate={departureDate}
              arrivalDate={arrivalDate}
              from={from}
              to={to}
              duration={duration}
              stops={stops}
              priceFrom={priceFrom || "Liên hệ"}
              seatClasses={sInfo.seatClasses}
              amenities={["Wifi", "Điều hòa", "Vé điện tử QR"]}
              onViewDetail={() => onViewDetail?.(trip.id || "", trip.train?.id)}
            />
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-3">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              size="icon"
              className={`h-10 w-10 ${page === i + 1 ? "bg-primary hover:bg-hover-primary" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-warning bg-warning/10 p-4">
          <AlertCircle className="h-5 w-5 text-warning shrink-0" />
          <Body className="text-warning">{error}</Body>
        </div>
      )}
    </div>
  );
}
