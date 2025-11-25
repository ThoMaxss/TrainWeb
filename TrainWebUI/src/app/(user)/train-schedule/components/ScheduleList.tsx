"use client";

import { TripDto } from "@/types";
import { ScheduleCard } from "./ScheduleCard";
import { AlertCircle } from "lucide-react";

interface ScheduleListProps {
  trips: TripDto[];
  loading: boolean;
  onViewRoute: (trip: TripDto) => void;
}

export function ScheduleList({ trips, loading, onViewRoute }: ScheduleListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Không tìm thấy chuyến tàu
        </h3>
        <p className="text-muted-foreground">
          Vui lòng thử lại với bộ lọc khác hoặc chọn ngày khác.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <ScheduleCard key={trip.id} trip={trip} onViewRoute={onViewRoute} />
      ))}
    </div>
  );
}
