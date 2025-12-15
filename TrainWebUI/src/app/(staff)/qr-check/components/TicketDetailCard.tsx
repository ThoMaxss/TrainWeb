import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TrainFront, User, MapPin, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

type TicketStatus = "not-checked-in" | "checked-in" | "cancelled";

interface ScannedTicket {
  id: string;
  trainCode: string;
  route: string;
  passengerName: string;
  seat: string;
  price: number;
  travelDate: string;
  departureTime: string;
  ticketClass: string;
  status: TicketStatus;
}

interface TicketDetailCardProps {
  ticket: ScannedTicket | null;
  onCheckIn?: () => void;
  onClear: () => void;
}

function getStatusBadge(status: TicketStatus) {
  switch (status) {
    case "checked-in":
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/10 gap-1">
          <CheckCircle className="h-3 w-3" />
          Đã check-in
        </Badge>
      );
    case "not-checked-in":
      return (
        <Badge className="bg-warning/10 text-warning hover:bg-warning/10 gap-1">
          <AlertTriangle className="h-3 w-3" />
          Chưa check-in
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 gap-1">
          <XCircle className="h-3 w-3" />
          Đã hủy
        </Badge>
      );
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export function TicketDetailCard({ ticket, onCheckIn, onClear }: TicketDetailCardProps) {
  if (!ticket) {
    return (
      <Card className="p-4 text-center border-2 border-dashed border-border/50">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <TrainFront className="h-12 w-12 opacity-30" />
          <p className="text-sm">Quét mã QR hoặc nhập mã vé để hiển thị thông tin</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Thông tin vé</h3>
        {getStatusBadge(ticket.status)}
      </div>

      <div className="space-y-4">
        {/* Train Info */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <TrainFront className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Tàu</p>
            <p className="font-semibold text-foreground">{ticket.trainCode}</p>
            <p className="text-sm text-muted-foreground mt-1">{ticket.route}</p>
          </div>
        </div>

        <Separator />

        {/* Passenger Info */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
            <User className="h-5 w-5 text-success" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Hành khách</p>
            <p className="font-semibold text-foreground">{ticket.passengerName}</p>
            <div className="flex gap-3 mt-2 text-sm">
              <span className="text-muted-foreground">Ghế: <span className="font-medium text-foreground">{ticket.seat}</span></span>
              <span className="text-muted-foreground">Loại: <span className="font-medium text-foreground">{ticket.ticketClass}</span></span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Travel Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Giờ khởi hành</p>
              <p className="font-semibold text-foreground">{ticket.departureTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Ngày đi</p>
              <p className="font-semibold text-foreground">{ticket.travelDate}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Price */}
        <div className="flex justify-between items-center py-2 px-3 bg-background rounded-lg">
          <span className="text-sm font-medium text-muted-foreground">Giá vé</span>
          <span className="text-lg font-bold text-primary">{formatCurrency(ticket.price)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {ticket.status === "not-checked-in" && onCheckIn && (
            <Button onClick={onCheckIn} className="flex-1 bg-success/90 hover:bg-success text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Check-in
            </Button>
          )}
          <Button onClick={onClear} variant="outline" className={ticket.status === "not-checked-in" && onCheckIn ? "" : "flex-1"}>
            Quét vé khác
          </Button>
        </div>
      </div>
    </Card>
  );
}
