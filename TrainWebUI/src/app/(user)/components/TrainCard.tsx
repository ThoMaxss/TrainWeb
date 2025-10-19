// 🎨 Enhanced train card with unified design system and dark mode
import { Clock, MapPin, Wifi, Wind, UtensilsCrossed, QrCode, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { H3, Body, Small } from "@/components/ui/typography";

interface TrainCardProps {
  trainName: string;
  trainCode: string;
  departure: string;
  arrival: string;
  departureDate: string;
  arrivalDate: string;
  from: string;
  to: string;
  duration: string;
  stops: string;
  priceFrom: string;
  seatClasses: Array<{
    name: string;
    price: string;
  }>;
  amenities: string[];
  onViewDetail?: () => void;
}

export function TrainCard({
  trainName,
  trainCode,
  departure,
  arrival,
  departureDate,
  arrivalDate,
  from,
  to,
  duration,
  stops,
  priceFrom,
  seatClasses,
  amenities,
  onViewDetail,
}: TrainCardProps) {
  const [showAllSeats, setShowAllSeats] = useState(false);
  const displayedSeats = showAllSeats ? seatClasses : seatClasses.slice(0, 2);

  return (
    <Card className="group overflow-hidden border bg-background rounded-xl shadow-sm transition-all hover:border-primary hover:shadow-lg">
      <div className="p-2">
        <div className="grid gap-3 lg:grid-cols-[1fr_280px]">
          {/* Main info */}
          <div className="space-y-3">
            {/* Train name and route */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <H3>{trainCode}</H3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
                    {trainName}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Small className="text-muted-foreground">{from} → {to}</Small>
                </div>
              </div>
              
              {/* Price badge - mobile */}
              <div className="lg:hidden">
                <div className="text-right">
                  <Small className="text-muted-foreground">Giá từ</Small>
                  <H3 className="text-primary">{priceFrom}</H3>
                </div>
              </div>
            </div>

            {/* Time and duration */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <Body className="font-semibold">{departure}</Body>
                  <Small className="text-muted-foreground">{departureDate}</Small>
                </div>
              </div>
              
              <div className="flex flex-1 items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-border via-primary to-border"></div>
                <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-1">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <Small className="text-primary">{duration}</Small>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-border via-primary to-border"></div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-center">
                  <Body className="font-semibold">{arrival}</Body>
                  <Small className="text-muted-foreground">{arrivalDate}</Small>
                </div>
              </div>
            </div>

            {/* Stops */}
            <Small className="text-muted-foreground">
              Dừng tại: {stops}
            </Small>

            {/* Seat classes */}
            <div className="space-y-2">
              <Small className="flex items-center gap-2 text-muted-foreground">
                💺 Loại ghế / Toa & Giá vé
              </Small>
              <div className="grid gap-2 sm:grid-cols-2">
                {displayedSeats.map((seat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border bg-card px-2 py-2.5 transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <Small className="text-foreground">{seat.name}</Small>
                    <Small className="font-medium text-primary">{seat.price}</Small>
                  </div>
                ))}
              </div>
              {seatClasses.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllSeats(!showAllSeats)}
                  className="w-full text-primary hover:bg-primary/10 hover:text-primary"
                >
                  {showAllSeats ? (
                    <>
                      Thu gọn <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Xem các loại ghế ({seatClasses.length - 2} loại khác) <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <Small className="text-muted-foreground">🔹 Tiện ích</Small>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => {
                  let icon;
                  switch (amenity) {
                    case "Wifi":
                      icon = <Wifi className="h-4 w-4" />;
                      break;
                    case "Điều hòa":
                      icon = <Wind className="h-4 w-4" />;
                      break;
                    case "Toa ăn uống":
                      icon = <UtensilsCrossed className="h-4 w-4" />;
                      break;
                    case "Vé điện tử QR":
                      icon = <QrCode className="h-4 w-4" />;
                      break;
                    default:
                      icon = null;
                  }
                  return (
                    <Badge
                      key={index}
                      variant="outline"
                      className="gap-1.5 border-success/30 bg-success/10 text-success hover:bg-success/20"
                    >
                      {icon}
                      {amenity}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Price and actions */}
          <div className="flex flex-col justify-between border-t pt-3 lg:border-l lg:border-t-0 lg:pl-3 lg:pt-0">
            <div className="hidden lg:block">
              <Small className="mb-2 text-muted-foreground">Giá vé</Small>
              <H3 className="mb-1 text-primary">{priceFrom}</H3>
              <Small className="text-muted-foreground">Tối thiểu</Small>
            </div>

            <div className="mt-3 space-y-2">
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
                onClick={onViewDetail}
              >
                Xem chi tiết
              </Button>
              <Button className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent/80">
                Đặt vé ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
