"use client";

import { useEffect, useRef } from "react";
import { TripDto } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock } from "lucide-react";

interface RouteMapProps {
  trip: TripDto | null;
}

// Mock stations data với coordinates
// Trong production, data này nên đến từ backend
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

export function RouteMap({ trip }: RouteMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  if (!trip) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Chọn một chuyến tàu để xem bản đồ tuyến đường
          </p>
        </CardContent>
      </Card>
    );
  }

  const departureCoords = STATION_COORDINATES[trip.originStation || ''];
  const arrivalCoords = STATION_COORDINATES[trip.destinationStation || ''];

  // Calculate positions for SVG (normalized to 0-100%)
  const getPosition = (station: string) => {
    const coords = STATION_COORDINATES[station];
    if (!coords) return { x: 50, y: 50 };

    // Simple projection (not geographically accurate, just for visual)
    // Normalize coordinates to fit in our view
    const minLat = 10;
    const maxLat = 23;
    const minLng = 103;
    const maxLng = 110;

    const x = ((coords.lng - minLng) / (maxLng - minLng)) * 80 + 10;
    const y = ((maxLat - coords.lat) / (maxLat - minLat)) * 80 + 10;

    return { x, y };
  };

  const departurePos = getPosition(trip.originStation || '');
  const arrivalPos = getPosition(trip.destinationStation || '');

  // Generate intermediate points for curved path
  const midX = (departurePos.x + arrivalPos.x) / 2;
  const midY = (departurePos.y + arrivalPos.y) / 2;
  const controlX = midX;
  const controlY = midY - 10; // Curve upward

  const pathD = `M ${departurePos.x} ${departurePos.y} Q ${controlX} ${controlY} ${arrivalPos.x} ${arrivalPos.y}`;

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Bản đồ tuyến đường
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Train Route Info */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Tàu</p>
              <p className="font-bold">{trip.train?.name || "Không xác định"}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Tuyến</p>
              <p className="font-bold">
                {trip.originStation} → {trip.destinationStation}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Thời gian</p>
              <p className="font-bold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatTime(trip.departure || '')} - {formatTime(trip.arrival || '')}
              </p>
            </div>
          </div>
        </div>

        {/* SVG Map */}
        <div className="relative bg-gradient-to-br from-primary/5 to-success/5 dark:from-primary-950/20 dark:to-success-950/20 rounded-lg p-8 min-h-[400px]">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ minHeight: "400px" }}
          >
            {/* Route Path */}
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-success)" />
              </linearGradient>
              
              {/* Animated dash */}
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="var(--color-success)" />
              </marker>
            </defs>

            {/* Background route line */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />

            {/* Animated route line */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
              className="animate-pulse"
            />

            {/* Departure Station */}
            <g>
              <circle
                cx={departurePos.x}
                cy={departurePos.y}
                r="3"
                fill="var(--color-primary)"
                className="drop-shadow-lg"
              />
              <circle
                cx={departurePos.x}
                cy={departurePos.y}
                r="1.5"
                fill="var(--color-card-foreground)"
              />
              <text
                x={departurePos.x}
                y={departurePos.y - 5}
                textAnchor="middle"
                className="text-xs font-bold fill-primary"
              >
                {trip.originStation}
              </text>
            </g>

            {/* Arrival Station */}
            <g>
              <circle
                cx={arrivalPos.x}
                cy={arrivalPos.y}
                r="3"
                fill="var(--color-success)"
                className="drop-shadow-lg"
              />
              <circle
                cx={arrivalPos.x}
                cy={arrivalPos.y}
                r="1.5"
                fill="var(--color-card-foreground)"
              />
              <text
                x={arrivalPos.x}
                y={arrivalPos.y - 5}
                textAnchor="middle"
                className="text-xs font-bold fill-success"
              >
                {trip.destinationStation}
              </text>
            </g>

            {/* Train icon animation along path */}
            <g className="animate-bounce">
              <circle
                cx={midX}
                cy={controlY}
                r="2"
                fill="var(--color-warning)"
                className="drop-shadow-md"
              />
              <text
                x={midX}
                y={controlY - 4}
                textAnchor="middle"
                className="text-[8px] fill-accent"
              >
                🚄
              </text>
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-foreground" />
            <span className="text-sm text-muted-foreground">Ga đi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-foreground/60" />
            <span className="text-sm text-muted-foreground">Ga đến</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tàu đang chạy</span>
          </div>
        </div>

        {/* Station Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5" />
              <h4 className="font-semibold">
                {trip.originStation}
              </h4>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">Khởi hành:</p>
              <p className="font-bold">
                {formatTime(trip.departure || '')}
              </p>
              <Badge variant="outline" className="mt-2">
                Ga xuất phát
              </Badge>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5" />
              <h4 className="font-semibold">
                {trip.destinationStation}
              </h4>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">Đến nơi:</p>
              <p className="font-bold">
                {formatTime(trip.arrival || '')}
              </p>
              <Badge variant="outline" className="mt-2">
                Ga đích
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
