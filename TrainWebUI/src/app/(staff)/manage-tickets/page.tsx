"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  MapPin,
  CreditCard,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils/utils"
import { getAllBookings } from "@/lib/api/booking"
import type { BookingDto as ApiBookingDto } from "@/types"

interface Ticket {
  id: string
  trainCode: string
  route: string
  passengerName: string
  seat: string
  price: number
  travelDate: string
  status: "upcoming" | "completed" | "cancelled"
  bookingDate: string
  ticketClass: string
  departureTime: string
  arrivalTime: string
  phone: string
  email: string
  paymentMethod: string
  transactionId: string
}

export default function ManageTicketsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [bookingsCache, setBookingsCache] = useState<ApiBookingDto[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ensureBookingsLoaded = async () => {
    if (bookingsCache) return bookingsCache
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAllBookings()
      setBookingsCache(data)
      return data
    } catch (e: any) {
      setError(e?.message || "Không thể tải danh sách đặt vé")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const mapBookingToTicket = (booking: ApiBookingDto): Ticket => {
    const trainCode = booking.trip?.train?.name || ""
    const route = booking.trip?.originStation && booking.trip?.destinationStation
      ? `${booking.trip.originStation} → ${booking.trip.destinationStation}`
      : ""
    const passengerName = booking.user?.name || "Hành khách"
    const seat = booking.seat?.seatNumber ? `Toa 0 - ${booking.seat.seatNumber}` : ""
    const price = 0 // API doesn't provide price in current structure
    const travelDate = booking.trip?.departure
      ? new Date(booking.trip.departure).toISOString().slice(0, 10)
      : ""
    const status: Ticket["status"] = booking.status === "Cancelled" ? "cancelled" : "upcoming"
    const bookingDate = booking.createdAt
      ? new Date(booking.createdAt).toISOString().slice(0, 10)
      : ""
    const ticketClass = booking.seat?.type ? String(booking.seat.type) : ""
    const departureTime = booking.trip?.departure
      ? new Date(booking.trip.departure).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : ""
    const arrivalTime = booking.trip?.arrival
      ? new Date(booking.trip.arrival).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : ""

    return {
      id: booking.id || "",
      trainCode,
      route,
      passengerName,
      seat,
      price,
      travelDate,
      status,
      bookingDate,
      ticketClass,
      departureTime,
      arrivalTime,
      phone: "", // Not available in API
      email: "", // Not available in API
      paymentMethod: "", // Not available in API
      transactionId: "", // Not available in API
    }
  }

  // Load bookings on component mount
  useEffect(() => {
    const loadBookings = async () => {
      const bookings = await ensureBookingsLoaded()
      const mappedTickets = bookings.map(mapBookingToTicket)
      setTickets(mappedTickets)
    }
    loadBookings()
  }, [])

  // Filter tickets based on search and active filter
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.route.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = activeFilter === "all" || ticket.status === activeFilter

    return matchesSearch && matchesFilter
  })

  // Get ticket counts for filter chips
  const ticketCounts = {
    all: tickets.length,
    upcoming: tickets.filter((t) => t.status === "upcoming").length,
    completed: tickets.filter((t) => t.status === "completed").length,
    cancelled: tickets.filter((t) => t.status === "cancelled").length,
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 shadow-sm">Sắp đi</Badge>
      case "completed":
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-0 shadow-sm">Đã đi</Badge>
      case "cancelled":
        return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-0 shadow-sm">Đã hủy</Badge>
      default:
        return null
    }
  }

  // Handle view detail
  const handleViewDetail = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsDetailOpen(true)
  }

  // Handle print ticket
  const handlePrint = (ticketId: string) => {
    console.log("Print ticket:", ticketId)
    // In production, this would trigger print dialog
  }

  // Handle refund/exchange
  const handleRefundExchange = (ticketId: string) => {
    console.log("Refund/Exchange ticket:", ticketId)
    // In production, this would open refund/exchange modal
  }

  // Handle check-in
  const handleCheckIn = (ticketId: string) => {
    console.log("Check-in ticket:", ticketId)
    // In production, this would mark ticket as checked in
  }

  // Handle export Excel
  const handleExportExcel = () => {
    console.log("Export to Excel", { ticketCount: tickets.length })
    // In production, this would export data to Excel
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-slate-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-error mx-auto mb-3" />
          <p className="text-error mb-3">Lỗi: {error}</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-primary/50/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 shadow-sm">
        <div className="container mx-auto px-2 lg:px-2">
          <div className="flex h-16 items-center justify-between">
            {/* Back Button + Title */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push("/staff-dashboard")} className="hover:bg-primary/10 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
                  <Train className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold text-slate-900">Quản lý vé</h1>
              </div>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExportExcel}
              className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/30 transition-all"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Xuất Excel</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-2 lg:px-2 py-5">
        {/* Search and Filters */}
        <Card className="mb-3 border-0 bg-background shadow-lg shadow-slate-200/50">
          <div className="p-2">
            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Nhập mã vé, tên hành khách, hoặc tuyến..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-slate-200 focus-visible:ring-blue-500 focus-visible:ring-2 transition-shadow"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
                className={cn(
                  "transition-all",
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/30"
                    : "hover:bg-primary/10 hover:border-primary",
                )}
              >
                Tất cả ({ticketCounts.all})
              </Button>
              <Button
                variant={activeFilter === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("upcoming")}
                className={cn(
                  "transition-all",
                  activeFilter === "upcoming"
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md shadow-emerald-500/30"
                    : "hover:bg-emerald-50 hover:border-emerald-300",
                )}
              >
                Sắp đi ({ticketCounts.upcoming})
              </Button>
              <Button
                variant={activeFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("completed")}
                className={cn(
                  "transition-all",
                  activeFilter === "completed"
                    ? "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-md shadow-slate-500/30"
                    : "hover:bg-slate-50 hover:border-slate-300",
                )}
              >
                Đã đi ({ticketCounts.completed})
              </Button>
              <Button
                variant={activeFilter === "cancelled" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("cancelled")}
                className={cn(
                  "transition-all",
                  activeFilter === "cancelled"
                    ? "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-md shadow-rose-500/30"
                    : "hover:bg-rose-50 hover:border-rose-300",
                )}
              >
                Đã hủy ({ticketCounts.cancelled})
              </Button>
            </div>
          </div>
        </Card>

        {/* Ticket Table */}
        {filteredTickets.length > 0 ? (
          <Card className="border-0 bg-background shadow-lg shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50/30 hover:from-slate-50 hover:to-blue-50/30 border-b border-slate-200">
                    <TableHead className="font-semibold text-slate-700">Mã vé</TableHead>
                    <TableHead className="font-semibold text-slate-700">Chuyến tàu</TableHead>
                    <TableHead className="font-semibold text-slate-700">Hành khách</TableHead>
                    <TableHead className="font-semibold text-slate-700">Ghế</TableHead>
                    <TableHead className="font-semibold text-slate-700">Giá vé</TableHead>
                    <TableHead className="font-semibold text-slate-700">Ngày đi</TableHead>
                    <TableHead className="font-semibold text-slate-700">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="group hover:bg-primary/10/50 transition-colors cursor-pointer border-b border-slate-100"
                    >
                      <TableCell>
                        <div className="font-semibold text-primary">{ticket.id}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-slate-900">{ticket.trainCode}</div>
                          <div className="text-sm text-slate-500">{ticket.route}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">{ticket.passengerName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600">{ticket.seat}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900">{formatCurrency(ticket.price)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600">
                          {new Date(ticket.travelDate).toLocaleDateString("vi-VN")}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetail(ticket)}
                            className="h-8 w-8 hover:bg-primary/10 transition-colors"
                          >
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePrint(ticket.id)}
                            className="h-8 w-8 hover:bg-primary/10 transition-colors"
                          >
                            <Printer className="h-4 w-4 text-indigo-600" />
                          </Button>
                          {ticket.status === "upcoming" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRefundExchange(ticket.id)}
                                className="h-8 w-8 hover:bg-amber-100 transition-colors"
                              >
                                <RefreshCw className="h-4 w-4 text-warning" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCheckIn(ticket.id)}
                                className="h-8 w-8 hover:bg-emerald-100 transition-colors"
                              >
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
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
          <Card className="border-0 bg-background shadow-lg shadow-slate-200/50">
            <div className="flex flex-col items-center justify-center py-16 px-2 text-center">
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                <AlertCircle className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Không tìm thấy vé nào phù hợp</h3>
              <p className="text-slate-500">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
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
                  <h2 className="mb-1 text-xl font-semibold text-slate-900">Chi tiết vé</h2>
                  <p className="text-sm text-slate-500">{selectedTicket.id}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDetailOpen(false)}
                  className="hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* QR Code */}
              <div className="mb-3 flex justify-center">
                <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-background p-2 shadow-inner">
                  <div className="h-48 w-48 bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md">
                    <div className="text-center">
                      <Train className="h-12 w-12 mx-auto mb-2 text-primary" />
                      <p className="text-xs text-primary font-medium">QR Code</p>
                      <p className="text-xs text-primary font-semibold mt-1">{selectedTicket.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-3 flex justify-center">{getStatusBadge(selectedTicket.status)}</div>

              {/* Train Info */}
              <Card className="mb-3 border-2 border-primary bg-gradient-to-br from-blue-50 to-indigo-50/50 shadow-md">
                <div className="p-2">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                      <Train className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Thông tin chuyến tàu</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Mã tàu:</span>
                      <span className="font-semibold text-slate-900">{selectedTicket.trainCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Tuyến:</span>
                      <span className="font-semibold text-slate-900">{selectedTicket.route}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Ngày đi:</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(selectedTicket.travelDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Giờ khởi hành:</span>
                      <span className="font-semibold text-slate-900">{selectedTicket.departureTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Giờ đến:</span>
                      <span className="font-semibold text-slate-900">{selectedTicket.arrivalTime}</span>
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
                    <h3 className="font-semibold text-slate-900">Thông tin hành khách</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Họ tên:</span>
                      <span className="font-semibold text-slate-900">{selectedTicket.passengerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Điện thoại:</span>
                      <span className="font-semibold text-slate-900">{selectedTicket.phone || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Email:</span>
                      <span className="font-semibold text-slate-900">{selectedTicket.email || "N/A"}</span>
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
                    <h3 className="font-semibold text-slate-900">Thông tin vé</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Loại vé:</span>
                      <span className="font-semibold text-slate-900">{selectedTicket.ticketClass}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Ghế:</span>
                      <span className="font-semibold text-slate-900">{selectedTicket.seat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Giá vé:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(selectedTicket.price)}</span>
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
                    <h3 className="font-semibold text-slate-900">Thông tin thanh toán</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Phương thức:</span>
                      <span className="font-semibold text-slate-900">{selectedTicket.paymentMethod || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Mã giao dịch:</span>
                      <span className="font-semibold text-slate-900">{selectedTicket.transactionId || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Ngày đặt:</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(selectedTicket.bookingDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Policy */}
              <Card className="mb-3 border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-md">
                <div className="p-2">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-600">
                      <AlertCircle className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Chính sách vé</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-500" />
                      <span>Vé có thể đổi/trả trước 24h so với giờ khởi hành</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-500" />
                      <span>Phí đổi/trả: 20% giá trị vé</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-500" />
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
                  onClick={() => handlePrint(selectedTicket.id)}
                >
                  <Printer className="h-4 w-4" />
                  In vé
                </Button>

                {selectedTicket.status === "upcoming" && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-2 border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors bg-transparent"
                      onClick={() => handleRefundExchange(selectedTicket.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Hoàn/Đổi vé
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors bg-transparent"
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
  )
}
