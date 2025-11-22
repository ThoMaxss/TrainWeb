"use client";

import { X, Train, User, MapPin, CreditCard, AlertCircle, Clock, Printer, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Ticket } from "./TicketsTable";

interface TicketDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onPrint: (ticketId: string) => void;
  onRefundExchange: (ticketId: string) => void;
  onCheckIn: (ticketId: string) => void;
  formatCurrency: (amount: number) => string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "upcoming":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 shadow-sm">Sắp đi</Badge>
    case "completed":
      return <Badge className="bg-muted text-foreground/90 hover:bg-muted border-0 shadow-sm">Đã đi</Badge>
    case "cancelled":
      return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-0 shadow-sm">Đã hủy</Badge>
    default:
      return null
  }
}

export function TicketDetailSheet({
  isOpen,
  onClose,
  ticket,
  onPrint,
  onRefundExchange,
  onCheckIn,
  formatCurrency,
}: TicketDetailSheetProps) {
  if (!ticket) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <div className="py-2">
          {/* Header */}
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h2 className="mb-1 text-xl font-semibold text-foreground">Chi tiết vé</h2>
              <p className="text-sm text-muted-foreground">{ticket.id}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* QR Code */}
          <div className="mb-3 flex justify-center">
            <div className="rounded-2xl border-2 border-dashed border-border bg-background p-2 shadow-inner">
              <div className="h-48 w-48 bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md">
                <div className="text-center">
                  <Train className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-primary font-medium">QR Code</p>
                  <p className="text-xs text-primary font-semibold mt-1">{ticket.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-3 flex justify-center">{getStatusBadge(ticket.status)}</div>

          {/* Train Info */}
          <Card className="mb-3 border-2 border-primary bg-gradient-to-br from-blue-50 to-indigo-50/50 shadow-md">
            <div className="p-2">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Train className="h-4 w-4 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Thông tin chuyến tàu</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Mã tàu:</span>
                  <span className="font-semibold text-foreground">{ticket.trainCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tuyến:</span>
                  <span className="font-semibold text-foreground">{ticket.route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ngày đi:</span>
                  <span className="font-semibold text-foreground">
                    {new Date(ticket.travelDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Giờ khởi hành:</span>
                  <span className="font-semibold text-foreground">{ticket.departureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Giờ đến:</span>
                  <span className="font-semibold text-foreground">{ticket.arrivalTime}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Passenger Info */}
          <Card className="mb-3 border-2 border-violet-200 bg-gradient-to-br from-purple-50 to-pink-50/50 shadow-md">
            <div className="p-2">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Thông tin hành khách</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Họ tên:</span>
                  <span className="font-semibold text-foreground">{ticket.passengerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Điện thoại:</span>
                  <span className="font-semibold text-foreground">{ticket.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="font-semibold text-foreground">{ticket.email || "N/A"}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Ticket Info */}
          <Card className="mb-3 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50/50 shadow-md">
            <div className="p-2">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Thông tin vé</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Loại vé:</span>
                  <span className="font-semibold text-foreground">{ticket.ticketClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ghế:</span>
                  <span className="font-semibold text-foreground">{ticket.seat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Giá vé:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(ticket.price)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Info */}
          <Card className="mb-3 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/50 shadow-md">
            <div className="p-2">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
                  <CreditCard className="h-4 w-4 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Thông tin thanh toán</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phương thức:</span>
                  <span className="font-semibold text-foreground">{ticket.paymentMethod || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Mã giao dịch:</span>
                  <span className="font-semibold text-foreground">{ticket.transactionId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ngày đặt:</span>
                  <span className="font-semibold text-foreground">
                    {new Date(ticket.bookingDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Policy */}
          <Card className="mb-3 border-2 border-border bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-md">
            <div className="p-2">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-600">
                  <AlertCircle className="h-4 w-4 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Chính sách vé</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <span>Vé có thể đổi/trả trước 24h so với giờ khởi hành</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <span>Phí đổi/trả: 20% giá trị vé</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <span>Check-in trước 30 phút khi lên tàu</span>
                </li>
              </ul>
            </div>
          </Card>

          <Separator className="my-3" />

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all"
              onClick={() => onPrint(ticket.id)}
            >
              <Printer className="h-4 w-4" />
              In vé
            </Button>

            {ticket.status === "upcoming" && (
              <>
                <Button
                  variant="outline"
                  className="w-full gap-2 border-2 border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors bg-transparent"
                  onClick={() => onRefundExchange(ticket.id)}
                >
                  <RefreshCw className="h-4 w-4" />
                  Hoàn/Đổi vé
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors bg-transparent"
                  onClick={() => onCheckIn(ticket.id)}
                >
                  <CheckCircle className="h-4 w-4" />
                  Check-in
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
