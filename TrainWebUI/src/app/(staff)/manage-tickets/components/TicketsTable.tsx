"use client";

import { Eye, Printer, RefreshCw, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface Ticket {
  id: string;
  trainCode: string;
  route: string;
  passengerName: string;
  seat: string;
  price: number;
  travelDate: string;
  status: "upcoming" | "completed" | "cancelled";
  bookingDate: string;
  ticketClass: string;
  departureTime: string;
  arrivalTime: string;
  phone: string;
  email: string;
  paymentMethod: string;
  transactionId: string;
}

interface TicketsTableProps {
  tickets: Ticket[];
  onViewDetail: (ticket: Ticket) => void;
  onPrint: (ticketId: string) => void;
  onRefundExchange: (ticketId: string) => void;
  onCheckIn: (ticketId: string) => void;
  formatCurrency: (amount: number) => string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "upcoming":
      return <Badge className="bg-success/10 text-success hover:bg-success/10 border-0 shadow-sm">Sắp đi</Badge>
    case "completed":
      return <Badge className="bg-muted text-foreground/90 hover:bg-muted border-0 shadow-sm">Đã đi</Badge>
    case "cancelled":
      return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 border-0 shadow-sm">Đã hủy</Badge>
    default:
      return null
  }
}

export function TicketsTable({
  tickets,
  onViewDetail,
  onPrint,
  onRefundExchange,
  onCheckIn,
  formatCurrency,
}: TicketsTableProps) {
  return (
    <Card className="border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted border-b">
              <TableHead className="font-semibold text-foreground/90">Mã vé</TableHead>
              <TableHead className="font-semibold text-foreground/90">Chuyến tàu</TableHead>
              <TableHead className="font-semibold text-foreground/90">Hành khách</TableHead>
              <TableHead className="font-semibold text-foreground/90">Ghế</TableHead>
              <TableHead className="font-semibold text-foreground/90">Giá vé</TableHead>
              <TableHead className="font-semibold text-foreground/90">Ngày đi</TableHead>
              <TableHead className="font-semibold text-foreground/90">Trạng thái</TableHead>
              <TableHead className="font-semibold text-foreground/90 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                className="group hover:bg-primary/10 transition-colors cursor-pointer border-b border-border/50"
              >
                <TableCell>
                  <div className="font-semibold text-primary">{ticket.id}</div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold text-foreground">{ticket.trainCode}</div>
                    <div className="text-sm text-muted-foreground">{ticket.route}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{ticket.passengerName}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">{ticket.seat}</div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-foreground">{formatCurrency(ticket.price)}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {new Date(ticket.travelDate).toLocaleDateString("vi-VN")}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetail(ticket)}
                      className="h-8 w-8 hover:bg-primary/10 transition-colors"
                    >
                      <Eye className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPrint(ticket.id)}
                      className="h-8 w-8 hover:bg-primary/10 transition-colors"
                    >
                      <Printer className="h-4 w-4 text-primary" />
                    </Button>
                    {ticket.status === "upcoming" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRefundExchange(ticket.id)}
                          className="h-8 w-8 hover:bg-warning/10 transition-colors"
                        >
                          <RefreshCw className="h-4 w-4 text-warning" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onCheckIn(ticket.id)}
                          className="h-8 w-8 hover:bg-success/10 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 text-success" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
