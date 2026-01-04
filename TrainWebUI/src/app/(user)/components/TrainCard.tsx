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
  onBook?: () => void;
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
  onBook,
}: TrainCardProps) {
  const [showAllSeats, setShowAllSeats] = useState(false);
  const displayedSeats = showAllSeats ? seatClasses : seatClasses.slice(0, 2);

  return (
    <Card className="group overflow-hidden border-2 hover:border-primary transition-all">
      <div className="p-4">
        {/* Stylized train journey line */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full bg-primary p-2 shadow">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M7 20h10M12 17v3M5 10V7a5 5 0 0 1 10 0v3m-7 0h8a2 2 0 0 1 2 2v3a5 5 0 0 1-10 0v-3a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <Small className="text-xs text-primary font-bold mt-1">{trainCode}</Small>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-success" />
              <span className="font-semibold text-success text-base">{from}</span>
              <span className="text-muted-foreground text-xs">{departureDate}</span>
              <span className="ml-auto text-primary font-bold">{departure}</span>
            </div>
            <div className="flex items-center gap-2 relative">
              <div className="h-2 w-2 rounded-full bg-success" />
              <div className="flex-1 h-1 bg-primary rounded-full relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  <Small className="text-primary font-semibold">{duration}</Small>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary text-base">{to}</span>
              <span className="text-muted-foreground text-xs">{arrivalDate}</span>
              <span className="ml-auto text-primary font-bold">{arrival}</span>
            </div>
          </div>
          {/* Price badge - mobile */}
          <div className="lg:hidden min-w-[90px] text-right">
            <Small className="text-muted-foreground">Giá từ</Small>
            <H3 className="text-primary">{priceFrom}</H3>
          </div>
        </div>

        {/* Train name and badge */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold text-base px-3 py-1 rounded-full">
            {trainName}
          </Badge>
          <Small className="text-muted-foreground ml-2">Dừng tại: {stops}</Small>
        </div>

        {/* Seat classes */}
        <div className="space-y-2 mb-2">
          <Small className="flex items-center gap-2 text-muted-foreground">
            💺 Loại ghế / Toa & Giá vé
          </Small>
          <div className="grid gap-2 sm:grid-cols-2">
            {displayedSeats.map((seat, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-primary/10 px-2 py-2.5 transition-colors hover:border-primary hover:bg-primary/5"
              >
                <Small className="text-foreground font-medium">{seat.name}</Small>
                <Small className="font-semibold text-primary">{seat.price}</Small>
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
        <div className="space-y-2 mb-2">
          <Small className="text-muted-foreground">🔹 Tiện ích</Small>
          <div className="flex flex-wrap gap-2 items-center">
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
                  className="flex items-center min-h-[32px] min-w-[110px] justify-center gap-1.5 border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary-foreground hover:bg-primary/10 dark:hover:bg-primary/20 px-3 py-1 text-sm font-medium"
                >
                  {icon}
                  <span className="whitespace-nowrap">{amenity}</span>
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Price and actions */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-t pt-4 mt-2">
          <div className="flex flex-col items-center lg:items-start">
            <Small className="mb-1 text-muted-foreground">Giá vé tối thiểu</Small>
            <H3 className="mb-1 text-primary text-2xl font-bold">{priceFrom}</H3>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 hover:text-primary"
              onClick={onViewDetail}
            >
              Xem chi tiết
            </Button>
            <Button
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 font-semibold"
              onClick={onBook}
            >
              Đặt vé ngay
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
