import { TrainFront, User, MapPin, Clock, CheckCircle, RotateCcw, XCircle, Camera, Keyboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type TicketStatus = "not-checked-in" | "checked-in" | "cancelled"

interface ScannedTicket {
  id: string
  trainCode: string
  route: string
  passengerName: string
  seat: string
  price: number
  travelDate: string
  departureTime: string
  ticketClass: string
  status: TicketStatus
  checkedInAt?: string
  checkedInBy?: string
}

interface TicketInfoCardProps {
  ticket: ScannedTicket
  formatCurrency: (amount: number) => string
  onCheckIn: () => void
  onCancelCheckIn: () => void
  onScanNew: () => void
  onManualInput: () => void
}

function getStatusBadge(status: TicketStatus) {
  switch (status) {
    case "not-checked-in":
      return <Badge className="bg-warning/10 text-warning hover:bg-warning/10">Chưa check-in</Badge>
    case "checked-in":
      return <Badge className="bg-success/10 text-success hover:bg-success/10">Đã check-in</Badge>
    case "cancelled":
      return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10">Đã hủy</Badge>
  }
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}

export function TicketInfoCard({ ticket, formatCurrency, onCheckIn, onCancelCheckIn, onScanNew, onManualInput }: TicketInfoCardProps) {
  return (
    <div className="space-y-4">
      <Card className="border rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">Thông tin vé</h3>
              <p className="text-sm text-muted-foreground font-medium">{ticket.id}</p>
            </div>
            {getStatusBadge(ticket.status)}
          </div>

          <Separator className="mb-4" />

          {/* Train info */}
          <div className="mb-4 rounded-xl bg-primary/5 border border-primary/20 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <TrainFront className="h-4 w-4 text-primary-foreground" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Chuyến tàu</h4>
            </div>
            <div className="space-y-2">
              <InfoRow label="Mã tàu:" value={ticket.trainCode} />
              <InfoRow label="Tuyến:" value={ticket.route} />
              <InfoRow label="Ngày đi:" value={new Date(ticket.travelDate).toLocaleDateString("vi-VN")} />
              <InfoRow label="Giờ khởi hành:" value={ticket.departureTime} />
            </div>
          </div>

          {/* Passenger info */}
          <div className="mb-4 rounded-xl bg-secondary/5 border border-secondary/20 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Hành khách</h4>
            </div>
            <div className="space-y-2">
              <InfoRow label="Họ tên:" value={ticket.passengerName} />
            </div>
          </div>

          {/* Ticket info */}
          <div className="mb-4 rounded-xl bg-success/5 border border-success/20 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Chi tiết vé</h4>
            </div>
            <div className="space-y-2">
              <InfoRow label="Loại vé:" value={ticket.ticketClass} />
              <InfoRow label="Ghế:" value={ticket.seat} />
              <InfoRow label="Giá vé:" value={formatCurrency(ticket.price)} />
            </div>
          </div>

          {/* Check-in info */}
          {ticket.status === "checked-in" && (
            <div className="rounded-xl bg-muted border border-border p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted-foreground">
                  <Clock className="h-4 w-4 text-primary-foreground" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Check-in</h4>
              </div>
              <div className="space-y-2">
                <InfoRow label="Thời gian:" value={ticket.checkedInAt || ""} />
                <InfoRow label="Nhân viên:" value={ticket.checkedInBy || ""} />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-border bg-muted/30 p-4 space-y-3">
          {ticket.status === "not-checked-in" && (
            <Button
              onClick={onCheckIn}
              className="w-full h-12 gap-2 bg-success hover:bg-success/90 rounded-xl font-semibold"
            >
              <CheckCircle className="h-5 w-5" />
              Xác nhận check-in
            </Button>
          )}

          {ticket.status === "checked-in" && (
            <Button
              onClick={onCancelCheckIn}
              variant="outline"
              className="w-full h-12 gap-2 border-warning text-warning hover:bg-warning/10 rounded-xl font-semibold"
            >
              <RotateCcw className="h-5 w-5" />
              Hủy check-in
            </Button>
          )}

          {ticket.status === "cancelled" && (
            <div className="text-center py-4">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
              <p className="text-sm text-muted-foreground font-medium">Vé đã bị hủy</p>
            </div>
          )}
        </div>
      </Card>

      {/* Next scan */}
      <Card className="border bg-primary text-primary-foreground rounded-lg overflow-hidden">
        <div className="p-4">
          <h4 className="mb-4 font-semibold">Quét vé tiếp theo</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onScanNew}
              variant="outline"
              className="h-11 bg-background text-primary hover:bg-background/90 border-0 rounded-xl font-semibold"
            >
              <Camera className="h-4 w-4 mr-2" />
              Quét vé mới
            </Button>
            <Button
              onClick={onManualInput}
              variant="outline"
              className="h-11 bg-background/90 text-primary hover:bg-background border-0 rounded-xl font-semibold"
            >
              <Keyboard className="h-4 w-4 mr-2" />
              Nhập mã
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
