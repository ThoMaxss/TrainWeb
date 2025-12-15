"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileDown,
  Eye,
  Printer,
  RefreshCw,
  CheckCircle,
  ChevronLeft,
  X,
  Train,
  User,
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/utils";

interface Ticket {
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

export default function ManageTicketPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "upcoming" | "completed" | "cancelled"
  >("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Mock ticket data
  const [tickets] = useState<Ticket[]>([
    {
      id: "VNR-12345",
      trainCode: "SE3",
      route: "Hà Nội → Đà Nẵng",
      passengerName: "Nguyễn Văn A",
      seat: "Toa 3 - 12A",
      price: 850000,
      travelDate: "2025-10-15",
      status: "upcoming",
      bookingDate: "2025-10-01",
      ticketClass: "Giường nằm khoang 4",
      departureTime: "19:30",
      arrivalTime: "09:45",
      phone: "0912345678",
      email: "nguyenvana@email.com",
      paymentMethod: "VISA",
      transactionId: "TXN001234",
    },
    {
      id: "VNR-12346",
      trainCode: "SE1",
      route: "Hà Nội → Sài Gòn",
      passengerName: "Trần Thị B",
      seat: "Toa 5 - 08B",
      price: 1350000,
      travelDate: "2025-10-12",
      status: "upcoming",
      bookingDate: "2025-09-28",
      ticketClass: "Giường nằm khoang 2",
      departureTime: "19:00",
      arrivalTime: "04:30",
      phone: "0923456789",
      email: "tranthib@email.com",
      paymentMethod: "MoMo",
      transactionId: "TXN001235",
    },
    {
      id: "VNR-12347",
      trainCode: "TN2",
      route: "Hà Nội → Vinh",
      passengerName: "Lê Văn C",
      seat: "Toa 2 - 15A",
      price: 450000,
      travelDate: "2025-09-28",
      status: "completed",
      bookingDate: "2025-09-15",
      ticketClass: "Ngồi cứng",
      departureTime: "06:00",
      arrivalTime: "11:30",
      phone: "0934567890",
      email: "levanc@email.com",
      paymentMethod: "VNPay",
      transactionId: "TXN001236",
    },
    {
      id: "VNR-12348",
      trainCode: "SE5",
      route: "Sài Gòn → Nha Trang",
      passengerName: "Phạm Thị D",
      seat: "Toa 4 - 20C",
      price: 680000,
      travelDate: "2025-10-08",
      status: "cancelled",
      bookingDate: "2025-09-20",
      ticketClass: "Ngồi mềm điều hòa",
      departureTime: "14:30",
      arrivalTime: "22:15",
      phone: "0945678901",
      email: "phamthid@email.com",
      paymentMethod: "VISA",
      transactionId: "TXN001237",
    },
    {
      id: "VNR-12349",
      trainCode: "ĐP1",
      route: "Hà Nội → Lào Cai",
      passengerName: "Hoàng Văn E",
      seat: "Toa 6 - 05A",
      price: 520000,
      travelDate: "2025-10-20",
      status: "upcoming",
      bookingDate: "2025-10-02",
      ticketClass: "Giường nằm khoang 6",
      departureTime: "21:45",
      arrivalTime: "05:30",
      phone: "0956789012",
      email: "hoangvane@email.com",
      paymentMethod: "MasterCard",
      transactionId: "TXN001238",
    },
    {
      id: "VNR-12350",
      trainCode: "SE7",
      route: "Đà Nẵng → Huế",
      passengerName: "Võ Thị F",
      seat: "Toa 1 - 03B",
      price: 180000,
      travelDate: "2025-09-25",
      status: "completed",
      bookingDate: "2025-09-10",
      ticketClass: "Ngồi cứng",
      departureTime: "08:00",
      arrivalTime: "10:30",
      phone: "0967890123",
      email: "vothif@email.com",
      paymentMethod: "MoMo",
      transactionId: "TXN001239",
    },
    {
      id: "VNR-12351",
      trainCode: "SE4",
      route: "Sài Gòn → Hà Nội",
      passengerName: "Đặng Văn G",
      seat: "Toa 7 - 18A",
      price: 1450000,
      travelDate: "2025-10-18",
      status: "upcoming",
      bookingDate: "2025-10-01",
      ticketClass: "Giường nằm khoang 2 VIP",
      departureTime: "18:30",
      arrivalTime: "04:15",
      phone: "0978901234",
      email: "dangvang@email.com",
      paymentMethod: "VISA",
      transactionId: "TXN001240",
    },
    {
      id: "VNR-12352",
      trainCode: "TN4",
      route: "Vinh → Hà Nội",
      passengerName: "Bùi Thị H",
      seat: "Toa 3 - 10C",
      price: 420000,
      travelDate: "2025-10-05",
      status: "cancelled",
      bookingDate: "2025-09-22",
      ticketClass: "Ngồi mềm",
      departureTime: "13:00",
      arrivalTime: "18:15",
      phone: "0989012345",
      email: "buithih@email.com",
      paymentMethod: "VNPay",
      transactionId: "TXN001241",
    },
  ]);

  // Filter tickets based on search and active filter
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.route.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all" || ticket.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Get ticket counts for filter chips
  const ticketCounts = {
    all: tickets.length,
    upcoming: tickets.filter((t) => t.status === "upcoming").length,
    completed: tickets.filter((t) => t.status === "completed").length,
    cancelled: tickets.filter((t) => t.status === "cancelled").length,
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/10">
            Sắp đi
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-card text-foreground hover:bg-card">
            Đã đi
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10">
            Đã hủy
          </Badge>
        );
      default:
        return null;
    }
  };

  // Handle view detail
  const handleViewDetail = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
  };

  // Handle print ticket
  const handlePrint = (ticketId: string) => {
    console.log("Print ticket:", ticketId);
    // In production, this would trigger print dialog
  };

  // Handle refund/exchange
  const handleRefundExchange = (ticketId: string) => {
    console.log("Refund/Exchange ticket:", ticketId);
    // In production, this would open refund/exchange modal
  };

  // Handle check-in
  const handleCheckIn = (ticketId: string) => {
    console.log("Check-in ticket:", ticketId);
    // In production, this would mark ticket as checked in
  };

  // Handle export Excel
  const handleExportExcel = () => {
    console.log("Export to Excel");
    // In production, this would export data to Excel
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ticket Management Info Section - Converted from sticky header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex h-16 items-center justify-between">
            {/* Back Button + Title */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/staff-dashboard')}
                className="hover:bg-primary/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                  <Train className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-primary">Quản lý vé</h1>
              </div>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExportExcel}
              className="gap-2 bg-gradient-to-r from-success to-success/80 hover:from-success/80 hover:to-success/90"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Xuất Excel</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search and Filters */}
        <Card className="border-0 bg-background shadow-md">
          <div className="p-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Nhập mã vé, tên hành khách, hoặc tuyến..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-border focus-visible:ring-blue-500"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
                className={cn(
                  activeFilter === "all" &&
                    "bg-primary hover:bg-hover-primary"
                )}
              >
                Tất cả ({ticketCounts.all})
              </Button>
              <Button
                variant={activeFilter === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("upcoming")}
                className={cn(
                  activeFilter === "upcoming" &&
                    "bg-success hover:bg-success/80"
                )}
              >
                Sắp đi ({ticketCounts.upcoming})
              </Button>
              <Button
                variant={activeFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("completed")}
                className={cn(
                  activeFilter === "completed" &&
                    "bg-muted-foreground hover:bg-muted-foreground"
                )}
              >
                Đã đi ({ticketCounts.completed})
              </Button>
              <Button
                variant={activeFilter === "cancelled" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("cancelled")}
                className={cn(
                  activeFilter === "cancelled" &&
                    "bg-destructive hover:bg-destructive/90"
                )}
              >
                Đã hủy ({ticketCounts.cancelled})
              </Button>
            </div>
          </div>
        </Card>

        {/* Ticket Table */}
        {filteredTickets.length > 0 ? (
          <Card className="border-0 bg-background shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="font-medium">Mã vé</TableHead>
                    <TableHead className="font-medium">Chuyến tàu</TableHead>
                    <TableHead className="font-medium">Hành khách</TableHead>
                    <TableHead className="font-medium">Ghế</TableHead>
                    <TableHead className="font-medium">Giá vé</TableHead>
                    <TableHead className="font-medium">Ngày đi</TableHead>
                    <TableHead className="font-medium">Trạng thái</TableHead>
                    <TableHead className="font-medium text-right">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="group hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <TableCell>
                        <div className="font-medium text-primary">
                          {ticket.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.trainCode}</div>
                          <div className="text-sm text-muted-foreground">
                            {ticket.route}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {ticket.passengerName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{ticket.seat}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(ticket.price)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(ticket.travelDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetail(ticket)}
                            className="h-8 w-8 hover:bg-primary/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePrint(ticket.id)}
                            className="h-8 w-8 hover:bg-primary/10"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          {ticket.status === "upcoming" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRefundExchange(ticket.id)
                                }
                                className="h-8 w-8 hover:bg-accent/10"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCheckIn(ticket.id)}
                                className="h-8 w-8 hover:bg-success/10"
                              >
                                <CheckCircle className="h-4 w-4" />
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
        ) : (
          // Empty State
          <Card className="border-0 bg-background shadow-md">
            <div className="flex flex-col items-center justify-center py-16 px-2 text-center">
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <AlertCircle className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-2 text-foreground">
                Không tìm thấy vé nào phù hợp
              </h3>
              <p className="text-muted-foreground">
                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Detail Drawer */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedTicket && (
            <div className="py-2">
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h2 className="mb-1 text-foreground">Chi tiết vé</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedTicket.id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDetailOpen(false)}
                  className="hover:bg-card"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* QR Code */}
              <div className="mb-3 flex justify-center">
                <div className="rounded-xl border-2 border-dashed border-border bg-background p-4">
                  <div className="h-48 w-48 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Train className="h-12 w-12 mx-auto mb-2 text-primary" />
                      <p className="text-xs text-primary">QR Code</p>
                      <p className="text-xs text-primary font-medium">
                        {selectedTicket.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-3 flex justify-center">
                {getStatusBadge(selectedTicket.status)}
              </div>

              {/* Train Info */}
              <Card className="mb-3 border-2 border-primary/50 bg-primary/10">
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Train className="h-5 w-5 text-primary" />
                    <h3 className="text-foreground">Thông tin chuyến tàu</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Mã tàu:
                      </span>
                      <span className="font-medium">
                        {selectedTicket.trainCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Tuyến:
                      </span>
                      <span className="font-medium">
                        {selectedTicket.route}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Ngày đi:
                      </span>
                      <span className="font-medium">
                        {new Date(selectedTicket.travelDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Giờ khởi hành:
                      </span>
                      <span className="font-medium">
                        {selectedTicket.departureTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Giờ đến:
                      </span>
                      <span className="font-medium">
                        {selectedTicket.arrivalTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Passenger Info */}
              <Card className="mb-3 border-2 border-secondary/20 bg-secondary/10">
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-secondary" />
                    <h3 className="text-foreground">Thông tin hành khách</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Họ tên:
                      </span>
                      <span className="font-medium">
                        {selectedTicket.passengerName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Điện thoại:
                      </span>
                      <span className="font-medium">
                        {selectedTicket.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Email:
                      </span>
                      <span className="font-medium">
                        {selectedTicket.email}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Ticket Info */}
              <Card className="mb-3 border-2 border-success/20 bg-success/10">
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-success" />
                    <h3 className="text-foreground">Thông tin vé</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Loại vé:
                      </span>
                      <span className="font-medium">
                        {selectedTicket.ticketClass}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Ghế:
                      </span>
                      <span className="font-medium">{selectedTicket.seat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Giá vé:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(selectedTicket.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Info */}
              <Card className="mb-3 border-2 border-accent/20 bg-accent/10">
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-accent" />
                    <h3 className="text-foreground">Thông tin thanh toán</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Phương thức:
                      </span>
                      <span className="font-medium">
                        {selectedTicket.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Mã giao dịch:
                      </span>
                      <span className="font-medium">
                        {selectedTicket.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Ngày đặt:
                      </span>
                      <span className="font-medium">
                        {new Date(
                          selectedTicket.bookingDate
                        ).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Policy */}
              <Card className="mb-3 border-2 border-border bg-card">
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-foreground">Chính sách vé</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Vé có thể đổi/trả trước 24h so với giờ khởi hành
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Phí đổi/trả: 20% giá trị vé</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Check-in trước 30 phút khi lên tàu</span>
                    </li>
                  </ul>
                </div>
              </Card>

              <Separator className="my-3" />

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  className="w-full gap-2 bg-primary hover:bg-hover-primary"
                  onClick={() => handlePrint(selectedTicket.id)}
                >
                  <Printer className="h-4 w-4" />
                  In vé
                </Button>

                {selectedTicket.status === "upcoming" && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-accent/20 text-accent hover:bg-accent/10"
                      onClick={() => handleRefundExchange(selectedTicket.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Hoàn/Đổi vé
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-success/20 text-success hover:bg-success/10"
                      onClick={() => handleCheckIn(selectedTicket.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Check-in
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}