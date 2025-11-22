"use client";

import { TripDto } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Train, 
  MapPin, 
  Clock, 
  Calendar,
  ArrowRight,
  Users,
  DollarSign,
  Map
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface ScheduleCardProps {
  trip: TripDto;
  onViewRoute: (trip: TripDto) => void;
}

export function ScheduleCard({ trip, onViewRoute }: ScheduleCardProps) {
  const departureDate = trip.departure ? new Date(trip.departure) : null;
  const arrivalDate = trip.arrival ? new Date(trip.arrival) : null;
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateDuration = () => {
    if (!arrivalDate || !departureDate) return '—';
    const diff = arrivalDate.getTime() - departureDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getAvailabilityStatus = () => {
    const available = trip.seatsAvailable ?? 0;
    const percentage = available > 40 ? 60 : available > 15 ? 30 : available > 0 ? 10 : 0;
    if (percentage > 50) return { label: "Còn nhiều chỗ", variant: "default" as const };
    if (percentage > 20) return { label: "Còn ít chỗ", variant: "secondary" as const };
    if (percentage > 0) return { label: "Sắp hết chỗ", variant: "destructive" as const };
    return { label: "Hết chỗ", variant: "outline" as const };
  };

  const status = getAvailabilityStatus();

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
      <CardContent className="p-6">
        {/* Header: Train Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Train className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">{trip.train?.name || "Không xác định"}</h3>
              <p className="text-sm text-muted-foreground">Mã: {trip.train?.id || "N/A"}</p>
            </div>
          </div>
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        </div>

        {/* Route: Departure -> Arrival */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 mb-4">
          {/* Departure */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4" />
              <span>Ga đi</span>
            </div>
            <p className="font-bold text-xl text-foreground">{trip.originStation || '—'}</p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">{departureDate ? formatTime(departureDate) : '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {departureDate ? <span>{formatDate(departureDate)}</span> : <span>—</span>}
            </div>
          </div>

          {/* Arrow + Duration */}
          <div className="flex flex-col items-center justify-center px-4">
            <ArrowRight className="h-6 w-6 text-muted-foreground mb-2" />
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {calculateDuration()}
            </Badge>
          </div>

          {/* Arrival */}
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-end gap-2 text-muted-foreground text-sm">
              <span>Ga đến</span>
              <MapPin className="h-4 w-4" />
            </div>
            <p className="font-bold text-xl text-foreground">{trip.destinationStation || '—'}</p>
            <div className="flex items-center justify-end gap-2 text-sm">
              <span className="font-semibold">{arrivalDate ? formatTime(arrivalDate) : '—'}</span>
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
              {arrivalDate ? <span>{formatDate(arrivalDate)}</span> : <span>—</span>}
              <Calendar className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Footer: Seats + Price + Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{trip.seatsAvailable ?? 0} chỗ trống</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold text-lg">—</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewRoute(trip)}
              className="gap-2"
            >
              <Map className="h-4 w-4" />
              Xem tuyến
            </Button>
            <Button
              size="sm"
              disabled={(trip.seatsAvailable ?? 0) === 0}
              className="gap-2"
            >
              Đặt vé
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
