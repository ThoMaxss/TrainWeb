import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface SelectedSeat {
  id: string;
  coachNumber: number;
  seatNumber: string;
  seatType: string;
  price: number;
}

interface SeatSummaryPanelProps {
  selectedSeats: SelectedSeat[];
  onRemoveSeat: (seatId: string) => void;
  onContinue: () => void;
  isSticky?: boolean;
}

export function SeatSummaryPanel({
  selectedSeats,
  onRemoveSeat,
  onContinue,
  isSticky = false,
}: SeatSummaryPanelProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // Group seats by seat type
  const groupedSeats = selectedSeats.reduce((acc, seat) => {
    if (!acc[seat.seatType]) {
      acc[seat.seatType] = [];
    }
    acc[seat.seatType].push(seat);
    return acc;
  }, {} as Record<string, SelectedSeat[]>);

  // Calculate subtotals and total
  const subtotals = Object.entries(groupedSeats).map(([seatType, seats]) => ({
    seatType,
    count: seats.length,
    total: seats.reduce((sum, seat) => sum + seat.price, 0),
  }));

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  if (isSticky) {
    // Mobile sticky bottom view
    return (
      <div className="sticky bottom-0 z-40 border-t bg-background shadow-lg lg:hidden">
        <div className="p-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">
                {selectedSeats.length > 0 ? `${selectedSeats.length} ghế đã chọn` : "Chưa chọn ghế"}
              </div>
              {selectedSeats.length > 0 && (
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {formatPrice(totalPrice)}
                </div>
              )}
            </div>
            <Button
              size="lg"
              disabled={selectedSeats.length === 0}
              onClick={onContinue}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Tiếp tục thanh toán
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar view
  return (
    <Card className="sticky top-24 border-0 shadow-lg">
      <div className="border-b bg-card p-2">
        <h3>Ghế đã chọn</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {selectedSeats.length > 0 ? `${selectedSeats.length} ghế` : "Chưa có ghế nào"}
        </p>
      </div>

      <div className="p-2">
        {selectedSeats.length === 0 ? (
          <div className="py-5 text-center text-sm text-muted-foreground">
            <div className="mb-2 text-4xl">🎫</div>
            <div>Vui lòng chọn ghế</div>
            <div>để tiếp tục đặt vé</div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Grouped seats */}
            <AnimatePresence mode="popLayout">
              {Object.entries(groupedSeats).map(([seatType, seats]) => (
                <motion.div
                  key={seatType}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {seatType}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({seats.length} ghế)
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {seats.map((seat) => (
                      <motion.div
                        key={seat.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between rounded-lg border bg-card p-2 transition-colors hover:bg-card"
                      >
                        <div className="flex-1">
                          <div className="text-sm">
                            Toa {seat.coachNumber} – Ghế {seat.seatNumber}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(seat.price)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveSeat(seat.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-error"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Separator />

            {/* Subtotals */}
            <div className="space-y-2">
              {subtotals.map((subtotal) => (
                <div key={subtotal.seatType} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {subtotal.seatType} ({subtotal.count} ghế):
                  </span>
                  <span>{formatPrice(subtotal.total)}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between">
              <span>Tổng cộng:</span>
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <Button
              size="lg"
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Tiếp tục thanh toán
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
