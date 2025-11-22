"use client";

import { TripDto } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, Calendar } from "lucide-react";

interface RoutePreviewProps {
  trip: TripDto | null;
}

// Mock stations data với coordinates
const STATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Hà Nội": { lat: 21.0245, lng: 105.8412 },
  "Sài Gòn": { lat: 10.7769, lng: 106.7009 },
  "Đà Nẵng": { lat: 16.0544, lng: 108.2022 },
  "Huế": { lat: 16.4637, lng: 107.5909 },
  "Nha Trang": { lat: 12.2388, lng: 109.1967 },
  "Vinh": { lat: 18.6793, lng: 105.6811 },
  "Lào Cai": { lat: 22.4856, lng: 103.9707 },
  "Hải Phòng": { lat: 20.8449, lng: 106.6881 },
  "Quy Nhơn": { lat: 13.7830, lng: 109.2196 },
};

export function RoutePreview({ trip }: RoutePreviewProps) {
  if (!trip) {
    return (
      <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Chọn một lịch trình để xem bản đồ tuyến đường
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate positions for SVG
  const getPosition = (station: string) => {
    const coords = STATION_COORDINATES[station];
    if (!coords) return { x: 50, y: 50 };

    const minLat = 10;
    const maxLat = 23;
    const minLng = 103;
    const maxLng = 110;

    const x = ((coords.lng - minLng) / (maxLng - minLng)) * 80 + 10;
    const y = ((maxLat - coords.lat) / (maxLat - minLat)) * 80 + 10;

    return { x, y };
  };

  const departurePos = getPosition(trip.originStation || "");
  const arrivalPos = getPosition(trip.destinationStation || "");

  const midX = (departurePos.x + arrivalPos.x) / 2;
  const midY = (departurePos.y + arrivalPos.y) / 2;
  const controlX = midX;
  const controlY = midY - 10;

  const pathD = `M ${departurePos.x} ${departurePos.y} Q ${controlX} ${controlY} ${arrivalPos.x} ${arrivalPos.y}`;

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Xem trước tuyến đường
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Trip Info */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tàu</p>
              <p className="font-bold text-lg">{trip.train?.name || "Không xác định"}</p>
              <p className="text-xs text-muted-foreground">
                {trip.train?.type || "N/A"}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Tuyến</p>
              <p className="font-semibold text-sm">
                {(trip.originStation || "")} → {(trip.destinationStation || "")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Chỗ ngồi</p>
              <p className="font-semibold text-sm">
                {trip.seatsAvailable ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* SVG Map */}
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg p-6 mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full min-h-[300px]">
            <defs>
              <linearGradient id="adminRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Route Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <path
              d={pathD}
              fill="none"
              stroke="url(#adminRouteGradient)"
              strokeWidth="1"
              className="drop-shadow-md"
            />

            {/* Departure Station */}
            <g>
              <circle cx={departurePos.x} cy={departurePos.y} r="3" fill="#3b82f6" />
              <circle cx={departurePos.x} cy={departurePos.y} r="1.5" fill="#fff" />
              <text
                x={departurePos.x}
                y={departurePos.y - 5}
                textAnchor="middle"
                className="text-[10px] font-bold fill-blue-600"
              >
                {trip.originStation || "—"}
              </text>
            </g>

            {/* Arrival Station */}
            <g>
              <circle cx={arrivalPos.x} cy={arrivalPos.y} r="3" fill="#10b981" />
              <circle cx={arrivalPos.x} cy={arrivalPos.y} r="1.5" fill="#fff" />
              <text
                x={arrivalPos.x}
                y={arrivalPos.y - 5}
                textAnchor="middle"
                className="text-[10px] font-bold fill-green-600"
              >
                {trip.destinationStation}
              </text>
            </g>

            {/* Train icon */}
            <g>
              <circle cx={midX} cy={controlY} r="2" fill="#f59e0b" />
              <text
                x={midX}
                y={controlY - 4}
                textAnchor="middle"
                className="text-[8px]"
              >
                🚄
              </text>
            </g>
          </svg>
        </div>

        {/* Station Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5" />
              <h4 className="font-semibold">
                {trip.originStation}
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-muted-foreground">
                  {trip.departure ? formatDate(trip.departure) : "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-bold">
                  {trip.departure ? formatTime(trip.departure) : "—"}
                </span>
              </div>
              <Badge variant="outline">
                Ga xuất phát
              </Badge>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5" />
              <h4 className="font-semibold">
                {trip.destinationStation || "—"}
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-muted-foreground">
                  {trip.arrival ? formatDate(trip.arrival) : "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-bold">
                  {trip.arrival ? formatTime(trip.arrival) : "—"}
                </span>
              </div>
              <Badge variant="outline">
                Ga đích
              </Badge>
            </div>
          </div>
        </div>

        {/* Capacity Info */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chỗ còn trống</p>
              <p className="text-2xl font-bold">
                {(trip.seatsAvailable ?? 0).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
