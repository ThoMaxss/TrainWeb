"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Search,
  QrCode,
  Train,
  Calendar,
  Clock,
  User,
  MapPin,
  DollarSign,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Banknote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils/utils"
// Notifications can be wired to your preferred toast library; using console for now
import { getAllBookings } from "@/lib/api/booking"
import { getAllTrips } from "@/lib/api/trip"
import type { BookingDto as ApiBookingDto, TripDto as ApiTripDto } from "@/types"

interface Passenger {
  id: string
  name: string
  seat: string
  coach: number
  seatType: string
  price: number
  status: "active" | "checked-in" | "cancelled"
}

interface Ticket {
  id: string
  bookingCode: string
  trainCode: string
  trainName: string
  from: string
  to: string
  date: string
  departureTime: string
  arrivalTime: string
  passengers: Passenger[]
  totalAmount: number
  bookingDate: string
  status: "active" | "partially-cancelled" | "cancelled"
}

interface Transaction {
  id: string
  date: string
  type: "refund" | "exchange"
  ticketCode: string
  amount: number
  staffId: string
  staffName: string
  note: string
}

export default function RefundsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "refund" | "exchange">("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [activeTab, setActiveTab] = useState<"refund" | "exchange">("refund")
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [staffNote, setStaffNote] = useState("")
  const [selectedNewTrain, setSelectedNewTrain] = useState<string | null>(null)

  const [bookingsCache, setBookingsCache] = useState<ApiBookingDto[] | null>(null)
  const [tripsCache, setTripsCache] = useState<ApiTripDto[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recentTransactions: Transaction[] = []

  const [availableTrains, setAvailableTrains] = useState<{
    id: string
    code: string
    name: string
    date: string
    departureTime: string
    arrivalTime: string
    availableSeats: number
    priceDifference: number
  }[]>([])

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

  const ensureTripsLoaded = async () => {
    if (tripsCache) return tripsCache
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAllTrips()
      setTripsCache(data)
      return data
    } catch (e: any) {
      setError(e?.message || "Không thể tải danh sách chuyến tàu")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const mapBookingToTicket = (booking: ApiBookingDto): Ticket => {
    const trainName = booking.trip?.train?.name || ""
    const trainCode = booking.trip?.train?.name || ""
    const from = booking.trip?.departureStation || ""
    const to = booking.trip?.arrivalStation || ""
    const dep = booking.trip?.departureTime ? new Date(booking.trip.departureTime) : null
    const arr = booking.trip?.arrivalTime ? new Date(booking.trip.arrivalTime) : null
    const date = dep ? dep.toLocaleDateString("vi-VN") : ""
    const departureTime = dep
      ? dep.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : ""
    const arrivalTime = arr
      ? arr.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : ""

    const passengerName = booking.user?.name || "Hành khách"
    // Fix: seats is an array, get the first seat
    const firstSeat = booking.seats && booking.seats.length > 0 ? booking.seats[0] : null
    const seatNumber = firstSeat?.seatNumber || ""
    const coach = 0
    const seatType = firstSeat?.type ? String(firstSeat.type) : ""

    const passengers: Passenger[] = [
      {
        id: booking.user?.id || "",
        name: passengerName,
        seat: seatNumber,
        coach,
        seatType,
        price: 0,
        status: "active",
      },
    ]

    return {
      id: booking.id || "",
      bookingCode: booking.id || "",
      trainCode,
      trainName,
      from,
      to,
      date,
      departureTime,
      arrivalTime,
      passengers,
      totalAmount: 0,
      bookingDate: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("vi-VN") : "",
      status: "active",
    }
  }

  // Handle search
  const handleSearch = async () => {
    const q = searchQuery.trim().toUpperCase()
    if (!q) return
    const bookings = await ensureBookingsLoaded()
    const found = bookings.find((b) => (b.id || "").toUpperCase() === q)
    if (!found) {
      console.error("Không tìm thấy vé", { code: q })
      setSelectedTicket(null)
      setAvailableTrains([])
      return
    }

    const ticket = mapBookingToTicket(found)
    setSelectedTicket(ticket)
    console.log("Đã tìm thấy vé", { code: ticket.bookingCode })

    // Load alternative trips for exchange based on route (same origin/destination)
    const trips = await ensureTripsLoaded()
    const alternatives = trips
      .filter((t) => t.departureStation === ticket.from && t.arrivalStation === ticket.to)
      .slice(0, 5)
      .map((t) => ({
        id: t.id || "",
        code: t.train?.name || "",
        name: t.train?.name || "",
        date: t.departureTime ? new Date(t.departureTime).toLocaleDateString("vi-VN") : "",
        departureTime: t.departureTime
          ? new Date(t.departureTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
          : "",
        arrivalTime: t.arrivalTime
          ? new Date(t.arrivalTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
          : "",
        availableSeats: t.availableSeats || 0,
        priceDifference: 0,
      }))
    setAvailableTrains(alternatives)
  }

  // Toggle passenger selection
  const togglePassengerSelection = (passengerId: string) => {
    setSelectedPassengers((prev) =>
      prev.includes(passengerId) ? prev.filter((id) => id !== passengerId) : [...prev, passengerId],
    )
  }

  // Calculate refund amount
  const calculateRefund = () => {
    if (!selectedTicket) return { subtotal: 0, fee: 0, total: 0 }

    const selectedPassengerData = selectedTicket.passengers.filter((p) => selectedPassengers.includes(p.id))
    const subtotal = selectedPassengerData.reduce((sum, p) => sum + p.price, 0)
    const feePercentage = 0.1 // 10% fee
    const fee = subtotal * feePercentage
    const total = subtotal - fee

    return { subtotal, fee, total }
  }

  // Calculate exchange difference
  const calculateExchangeDifference = () => {
    if (!selectedTicket || !selectedNewTrain) return { oldTotal: 0, newTotal: 0, difference: 0 }

    const selectedTrain = availableTrains.find((t) => t.id === selectedNewTrain)
    if (!selectedTrain) return { oldTotal: 0, newTotal: 0, difference: 0 }

    const selectedPassengerData = selectedTicket.passengers.filter((p) => selectedPassengers.includes(p.id))
    const oldTotal = selectedPassengerData.reduce((sum, p) => sum + p.price, 0)
    const newTotal = oldTotal + selectedTrain.priceDifference * selectedPassengers.length
    const difference = newTotal - oldTotal

    return { oldTotal, newTotal, difference }
  }

  // Handle confirm action
  const handleConfirmAction = () => {
    if (!staffNote.trim()) {
      console.error("Vui lòng nhập ghi chú")
      return
    }

    if (activeTab === "refund") {
      console.info("API hoàn vé chưa được triển khai", {
        expectedAmount: calculateRefund().total,
      })
    } else {
      console.info("API đổi vé chưa được triển khai", {
        hasNewTrain: Boolean(selectedNewTrain),
      })
    }

    // Reset form state
    setShowConfirmDialog(false)
    setSelectedPassengers([])
    setStaffNote("")
    setSelectedNewTrain(null)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success hover:bg-success/10">Chưa check-in</Badge>
      case "checked-in":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Đã check-in</Badge>
      case "cancelled":
        return <Badge className="bg-card text-foreground hover:bg-card">Đã hủy</Badge>
      default:
        return null
    }
  }

  const refundData = calculateRefund()
  const exchangeData = calculateExchangeDifference()

  return (
    <div className="flex h-screen flex-col">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Hoàn/Đổi vé</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý yêu cầu hoàn tiền và đổi vé của khách hàng
            </p>
          </div>
          <Badge variant="outline" className="border-primary text-primary bg-primary/10">
            {recentTransactions.length} giao dịch hôm nay
          </Badge>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Nhập mã vé hoặc quét QR"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <QrCode className="h-4 w-4" />
          </Button>
          <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="mb-4">
        <div className="flex gap-2">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
            className={cn(
              "transition-all",
              filterType === "all"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
                : "border-border hover:bg-muted/50",
            )}
          >
            Tất cả
          </Button>
          <Button
            variant={filterType === "refund" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("refund")}
            className={cn(
              "transition-all",
              filterType === "refund"
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-md"
                : "border-border hover:bg-muted/50",
            )}
          >
            Hoàn vé
          </Button>
          <Button
            variant={filterType === "exchange" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("exchange")}
            className={cn(
              "transition-all",
              filterType === "exchange"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
                : "border-border hover:bg-muted/50",
            )}
          >
            Đổi vé
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-2 lg:p-2">
        <div className="grid gap-3 lg:grid-cols-[1fr_400px] h-full">
          {/* Left Panel - Ticket & Actions */}
          <div className="space-y-3 overflow-y-auto">
            {selectedTicket ? (
              <>
                {/* Ticket Detail Card */}
                <Card className="border-2 border-border/80 shadow-lg hover:shadow-xl transition-shadow bg-background/80 backdrop-blur-sm">
                  <div className="p-2">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">Thông tin vé</h3>
                        <p className="text-sm text-muted-foreground">
                          Mã đặt chỗ: <span className="font-semibold text-foreground">{selectedTicket.bookingCode}</span>
                        </p>
                      </div>
                      {getStatusBadge(selectedTicket.status)}
                    </div>

                    {/* Train Info */}
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 rounded-xl p-2 mb-3 border border-primary/50/50 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
                          <Train className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-foreground">
                          {selectedTicket.trainCode} - {selectedTicket.trainName}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Khởi hành</p>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success/10">
                              <MapPin className="h-4 w-4 text-success" />
                            </div>
                            <span className="font-semibold text-foreground">{selectedTicket.from}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{selectedTicket.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="font-medium">{selectedTicket.departureTime}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Đến</p>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-error/10">
                              <MapPin className="h-4 w-4 text-error" />
                            </div>
                            <span className="font-semibold text-foreground">{selectedTicket.to}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="font-medium">{selectedTicket.arrivalTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Passenger List */}
                    <div>
                      <h4 className="text-base font-bold text-foreground mb-3">Danh sách hành khách</h4>
                      <div className="space-y-2.5">
                        {selectedTicket.passengers.map((passenger) => (
                          <div
                            key={passenger.id}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-xl border-2 transition-all duration-200",
                              selectedPassengers.includes(passenger.id)
                                ? "border-primary bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
                                : "border-border bg-background hover:border-border hover:shadow-sm",
                              passenger.status === "cancelled" && "opacity-50",
                            )}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Checkbox
                                checked={selectedPassengers.includes(passenger.id)}
                                onCheckedChange={() => togglePassengerSelection(passenger.id)}
                                disabled={passenger.status === "cancelled"}
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                                  </div>
                                  <span className="font-semibold text-foreground">{passenger.name}</span>
                                  {getStatusBadge(passenger.status)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Toa {passenger.coach} - Ghế {passenger.seat} • {passenger.seatType}
                                </p>
                              </div>
                            </div>
                            <div className="text-right ml-3">
                              <p className="font-bold text-foreground">{passenger.price.toLocaleString("vi-VN")}₫</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Tabs - Refund/Exchange */}
                <Card className="border-2 border-border/80 shadow-lg hover:shadow-xl transition-shadow bg-background/80 backdrop-blur-sm">
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                    <div className="border-b border-border/80 p-2 bg-muted/50/50">
                      <TabsList className="grid w-full max-w-md grid-cols-2 bg-background border border-border">
                        <TabsTrigger
                          value="refund"
                          className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-primary-foreground transition-all"
                        >
                          <DollarSign className="h-4 w-4" />
                          Hoàn vé
                        </TabsTrigger>
                        <TabsTrigger
                          value="exchange"
                          className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-primary-foreground transition-all"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Đổi vé
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    {/* Refund Tab */}
                    <TabsContent value="refund" className="p-2 mt-0">
                      {selectedPassengers.length > 0 ? (
                        <div className="space-y-3">
                          {/* Refund Calculation */}
                          <div className="bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-xl p-2 border-2 border-destructive/10 shadow-md">
                            <h4 className="text-base font-bold mb-3 flex items-center gap-2 text-destructive">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-rose-600 shadow-sm">
                                <Banknote className="h-4 w-4 text-primary-foreground" />
                              </div>
                              Chi tiết hoàn tiền
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Tổng giá vé ({selectedPassengers.length} hành khách)
                                </span>
                                <span className="font-semibold text-foreground">
                                  {refundData.subtotal.toLocaleString("vi-VN")}₫
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Phí hoàn vé (10%)</span>
                                <span className="font-semibold text-error">
                                  -{refundData.fee.toLocaleString("vi-VN")}₫
                                </span>
                              </div>
                              <Separator className="bg-destructive/20" />
                              <div className="flex justify-between pt-1">
                                <span className="font-bold text-foreground">Số tiền hoàn lại</span>
                                <span className="text-xl font-bold text-error">
                                  {refundData.total.toLocaleString("vi-VN")}₫
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Policy Notice */}
                          <div className="flex gap-3 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 shrink-0">
                              <AlertCircle className="h-4 w-4 text-warning" />
                            </div>
                            <div className="text-sm">
                              <p className="font-semibold text-amber-900 mb-1">Chính sách hoàn vé</p>
                              <p className="text-amber-800 leading-relaxed">
                                Hoàn vé trước 24 giờ khởi hành: phí 10%. Sau thời gian này, vé sẽ không được hoàn lại.
                              </p>
                            </div>
                          </div>

                          {/* Action Button */}
                          <Button
                            onClick={() => setShowConfirmDialog(true)}
                            className="w-full gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all h-12 text-base font-semibold"
                            size="lg"
                          >
                            <DollarSign className="h-5 w-5" />
                            Thực hiện hoàn vé
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 mb-3 shadow-md">
                            <DollarSign className="h-10 w-10 text-error" />
                          </div>
                          <h4 className="text-lg font-bold text-foreground mb-2">Chọn hành khách để hoàn vé</h4>
                          <p className="text-muted-foreground max-w-sm mx-auto">
                            Tick vào checkbox để chọn hành khách cần hoàn vé
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    {/* Exchange Tab */}
                    <TabsContent value="exchange" className="p-2 mt-0">
                      {selectedPassengers.length > 0 ? (
                        <div className="space-y-3">
                          {/* Select New Train */}
                          <div>
                            <h4 className="text-base font-bold text-foreground mb-3">Chọn chuyến tàu mới</h4>
                            <RadioGroup value={selectedNewTrain || ""} onValueChange={setSelectedNewTrain}>
                              <div className="space-y-3">
                                {availableTrains.map((train) => (
                                  <div key={train.id}>
                                    <RadioGroupItem value={train.id} id={train.id} className="peer sr-only" />
                                    <Label
                                      htmlFor={train.id}
                                      className="flex items-center justify-between p-2 rounded-xl border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-blue-50 peer-data-[state=checked]:to-indigo-50 peer-data-[state=checked]:shadow-md hover:bg-muted/50 hover:border-border"
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
                                            <Train className="h-4 w-4 text-primary-foreground" />
                                          </div>
                                          <span className="font-semibold text-foreground">
                                            {train.code} - {train.name}
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="text-xs border-emerald-200 text-success bg-success/10"
                                          >
                                            {train.availableSeats} chỗ trống
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                          <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{train.date}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>
                                              {train.departureTime} - {train.arrivalTime}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right ml-3">
                                        {train.priceDifference === 0 ? (
                                          <span className="text-success font-semibold text-sm">Không đổi giá</span>
                                        ) : (
                                          <span className="text-warning font-semibold">
                                            +{train.priceDifference.toLocaleString("vi-VN")}₫
                                          </span>
                                        )}
                                      </div>
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Exchange Calculation */}
                          {selectedNewTrain && (
                            <>
                              <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 rounded-xl p-2 border-2 border-primary/50 shadow-md">
                                <h4 className="text-base font-bold mb-3 flex items-center gap-2 text-primary">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
                                    <RefreshCw className="h-4 w-4 text-primary-foreground" />
                                  </div>
                                  Chi tiết đổi vé
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Giá vé cũ ({selectedPassengers.length} hành khách)
                                    </span>
                                    <span className="font-semibold text-foreground">
                                      {exchangeData.oldTotal.toLocaleString("vi-VN")}₫
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Giá vé mới</span>
                                    <span className="font-semibold text-foreground">
                                      {exchangeData.newTotal.toLocaleString("vi-VN")}₫
                                    </span>
                                  </div>
                                  <Separator className="bg-primary/30" />
                                  <div className="flex justify-between pt-1">
                                    <span className="font-bold text-foreground">Chênh lệch</span>
                                    <span
                                      className={cn(
                                        "text-xl font-bold",
                                        exchangeData.difference >= 0 ? "text-warning" : "text-success",
                                      )}
                                    >
                                      {exchangeData.difference >= 0 ? "+" : ""}
                                      {exchangeData.difference.toLocaleString("vi-VN")}₫
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Policy Notice */}
                              <div className="flex gap-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-primary shadow-sm">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                  <AlertCircle className="h-4 w-4 text-primary" />
                                </div>
                                <div className="text-sm">
                                  <p className="font-semibold text-primary mb-1">Chính sách đổi vé</p>
                                  <p className="text-primary leading-relaxed">
                                    Đổi vé được thực hiện miễn phí. Khách hàng chỉ cần trả chênh lệch giá vé (nếu có).
                                  </p>
                                </div>
                              </div>

                              {/* Action Button */}
                              <Button
                                onClick={() => setShowConfirmDialog(true)}
                                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all h-12 text-base font-semibold"
                                size="lg"
                              >
                                <RefreshCw className="h-5 w-5" />
                                Thực hiện đổi vé
                              </Button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 mb-3 shadow-md">
                            <RefreshCw className="h-10 w-10 text-primary" />
                          </div>
                          <h4 className="text-lg font-bold text-foreground mb-2">Chọn hành khách để đổi vé</h4>
                          <p className="text-muted-foreground max-w-sm mx-auto">
                            Tick vào checkbox để chọn hành khách cần đổi vé
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </Card>
              </>
            ) : (
              // Empty State
              <Card className="border-2 border-dashed border-border bg-background/50 backdrop-blur-sm">
                <div className="p-16 text-center">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100 via-purple-100 to-blue-100 mb-3 shadow-lg">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Tìm kiếm vé để bắt đầu</h3>
                  <p className="text-muted-foreground mb-5 max-w-md mx-auto">
                    Nhập mã vé hoặc quét QR code để tra cứu thông tin vé
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      className="gap-2 border-border hover:bg-muted/50 transition-all bg-transparent"
                    >
                      <QrCode className="h-4 w-4" />
                      Quét QR
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Panel - Transaction Log */}
          <Card className="border-2 border-border/80 shadow-lg hover:shadow-xl transition-shadow flex flex-col bg-background/80 backdrop-blur-sm">
            <div className="p-2 border-b border-border/80 bg-gradient-to-r from-slate-50 to-blue-50/30">
              <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
                  <FileText className="h-4 w-4 text-primary-foreground" />
                </div>
                Lịch sử giao dịch
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5">Các giao dịch hoàn/đổi vé gần đây</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-3">
                {recentTransactions
                  .filter(
                    (tx) =>
                      filterType === "all" ||
                      (filterType === "refund" && tx.type === "refund") ||
                      (filterType === "exchange" && tx.type === "exchange"),
                  )
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-2 rounded-xl border-2 border-border hover:border-primary hover:shadow-md transition-all cursor-pointer bg-background"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {transaction.type === "refund" ? (
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-100 to-rose-100 shadow-sm">
                              <DollarSign className="h-4 w-4 text-error" />
                            </div>
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 shadow-sm">
                              <RefreshCw className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-sm text-foreground">
                              {transaction.type === "refund" ? "Hoàn vé" : "Đổi vé"}
                            </p>
                            <p className="text-xs text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "font-bold text-sm",
                            transaction.type === "refund" ? "text-error" : "text-primary",
                          )}
                        >
                          {transaction.type === "refund" ? "-" : "+"}
                          {transaction.amount.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mã vé:</span>
                          <span className="font-semibold text-foreground">{transaction.ticketCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nhân viên:</span>
                          <span className="text-foreground">{transaction.staffName}</span>
                        </div>
                        <p className="text-muted-foreground text-xs mt-2 italic leading-relaxed">{transaction.note}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md border-2 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              {activeTab === "refund" ? (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-rose-600 shadow-md">
                    <DollarSign className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span>Xác nhận hoàn vé</span>
                </>
              ) : (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
                    <RefreshCw className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span>Xác nhận đổi vé</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {/* Summary */}
            <div
              className={cn(
                "p-2 rounded-xl border shadow-sm",
                activeTab === "refund"
                  ? "bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/10"
                  : "bg-gradient-to-br from-blue-50 to-indigo-50 border-primary/50",
              )}
            >
              <p className="text-sm font-semibold mb-3 text-foreground">Tóm tắt giao dịch</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã vé:</span>
                  <span className="font-semibold text-foreground">{selectedTicket?.bookingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số hành khách:</span>
                  <span className="font-semibold text-foreground">{selectedPassengers.length}</span>
                </div>
                <Separator className={activeTab === "refund" ? "bg-destructive/20" : "bg-primary/30"} />
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-foreground">
                    {activeTab === "refund" ? "Số tiền hoàn:" : "Chênh lệch:"}
                  </span>
                  <span
                    className={cn("font-bold text-base", activeTab === "refund" ? "text-error" : "text-primary")}
                  >
                    {activeTab === "refund"
                      ? refundData.total.toLocaleString("vi-VN")
                      : exchangeData.difference >= 0
                        ? `+${exchangeData.difference.toLocaleString("vi-VN")}`
                        : exchangeData.difference.toLocaleString("vi-VN")}
                    ₫
                  </span>
                </div>
              </div>
            </div>

            {/* Staff Note */}
            <div>
              <Label htmlFor="staffNote" className="mb-2 block font-semibold text-foreground">
                Ghi chú <span className="text-error">*</span>
              </Label>
              <Textarea
                id="staffNote"
                placeholder="Nhập lý do hoàn/đổi vé..."
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                className="min-h-[100px] border-border focus:border-primary focus:ring-blue-400/20"
              />
            </div>

            {/* Warning */}
            <div className="flex gap-3 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 shrink-0">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">
                Hành động này không thể hoàn tác. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="border-border hover:bg-muted/50"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={cn(
                "gap-2 shadow-md hover:shadow-lg transition-all",
                activeTab === "refund"
                  ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
              )}
            >
              {activeTab === "refund" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Xác nhận hoàn vé
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Xác nhận đổi vé
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
