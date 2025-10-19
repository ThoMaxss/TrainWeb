"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Ticket,
  RefreshCw,
  XCircle,
  Download,
  Calendar,
  Filter,
  ChevronRight,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils/utils"
import { getAllBookings } from "@/lib/api/booking"
import { getAllTrips } from "@/lib/api/trip"
import type { BookingDto as ApiBookingDto, TripDto as ApiTripDto } from "@/types"

interface RevenueData {
  date: string
  revenue: number
  tickets: number
  refunds: number
}

interface RouteRevenueData {
  route: string
  revenue: number
  tickets: number
}

interface PaymentMethodData {
  method: string
  value: number
  percentage: number
  [key: string]: string | number // For Recharts compatibility
}

interface DetailedRevenueRow {
  date: string
  route: string
  ticketsSold: number
  revenue: number
  refunds: number
  netRevenue: number
}

export default function RevenueReportPage() {
  const router = useRouter()
  const [timeFilter, setTimeFilter] = useState<"today" | "7days" | "30days" | "custom">("7days")
  const [routeFilter, setRouteFilter] = useState<string>("all")
  const [trainTypeFilter, setTrainTypeFilter] = useState<string>("all")
  const [bookingsCache, setBookingsCache] = useState<ApiBookingDto[] | null>(null)
  const [tripsCache, setTripsCache] = useState<ApiTripDto[] | null>(null)
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

  // Calculate KPI data from real bookings
  const calculateKpiData = (bookings: ApiBookingDto[]) => {
    const totalBookings = bookings.length
    const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length
    const activeBookings = totalBookings - cancelledBookings
    
    // Mock revenue calculation since API doesn't provide price data
    const estimatedRevenue = activeBookings * 1000000 // 1M VND per ticket estimate
    const estimatedRefunds = cancelledBookings * 500000 // 500K VND refund estimate
    
    return {
      totalRevenue: estimatedRevenue,
      revenueChange: 12.5, // Mock change percentage
      ticketsSold: activeBookings,
      ticketsChange: 8.3, // Mock change percentage
      refunds: estimatedRefunds,
      refundsChange: -15.2, // Mock change percentage
      failedTransactions: cancelledBookings,
      failedChange: -5.1, // Mock change percentage
    }
  }

  // Calculate revenue trend data from bookings
  const calculateRevenueTrendData = (bookings: ApiBookingDto[]): RevenueData[] => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().slice(0, 10)
    }).reverse()

    return last7Days.map(date => {
      const dayBookings = bookings.filter(b => 
        b.createdAt && b.createdAt.startsWith(date)
      )
      const activeBookings = dayBookings.filter(b => b.status !== 'Cancelled')
      const cancelledBookings = dayBookings.filter(b => b.status === 'Cancelled')
      
      return {
        date: new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        revenue: activeBookings.length * 1000000, // Mock calculation
        tickets: activeBookings.length,
        refunds: cancelledBookings.length * 500000, // Mock calculation
      }
    })
  }

  // Calculate route revenue data from bookings and trips
  const calculateRouteRevenueData = (bookings: ApiBookingDto[], trips: ApiTripDto[]): RouteRevenueData[] => {
    const routeMap = new Map<string, { revenue: number; tickets: number }>()
    
    bookings.forEach(booking => {
      if (booking.trip?.departureStation && booking.trip?.arrivalStation) {
        const route = `${booking.trip.departureStation} - ${booking.trip.arrivalStation}`
        const current = routeMap.get(route) || { revenue: 0, tickets: 0 }
        
        if (booking.status !== 'Cancelled') {
          current.revenue += 1000000 // Mock revenue per ticket
          current.tickets += 1
        }
        
        routeMap.set(route, current)
      }
    })

    return Array.from(routeMap.entries())
      .map(([route, data]) => ({ route, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }

  // Mock payment method data (API doesn't provide this)
  const paymentMethodData: PaymentMethodData[] = [
    { method: "Thẻ tín dụng/Ghi nợ", value: 98320, percentage: 40 },
    { method: "Ví điện tử", value: 73740, percentage: 30 },
    { method: "Chuyển khoản", value: 49160, percentage: 20 },
    { method: "Tiền mặt", value: 24580, percentage: 10 },
  ]

  // Calculate detailed table data
  const calculateDetailedData = (bookings: ApiBookingDto[]): DetailedRevenueRow[] => {
    const last5Days = Array.from({ length: 5 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().slice(0, 10)
    }).reverse()

    return last5Days.flatMap(date => {
      const dayBookings = bookings.filter(b => 
        b.createdAt && b.createdAt.startsWith(date)
      )
      
      const routeMap = new Map<string, { ticketsSold: number; revenue: number; refunds: number }>()
      
      dayBookings.forEach(booking => {
        if (booking.trip?.departureStation && booking.trip?.arrivalStation) {
          const route = `${booking.trip.departureStation} - ${booking.trip.arrivalStation}`
          const current = routeMap.get(route) || { ticketsSold: 0, revenue: 0, refunds: 0 }
          
          if (booking.status === 'Cancelled') {
            current.refunds += 500000 // Mock refund amount
          } else {
            current.ticketsSold += 1
            current.revenue += 1000000 // Mock revenue per ticket
          }
          
          routeMap.set(route, current)
        }
      })

      return Array.from(routeMap.entries()).map(([route, data]) => ({
        date: new Date(date).toLocaleDateString("vi-VN"),
        route,
        ...data,
        netRevenue: data.revenue - data.refunds,
      }))
    }).slice(0, 5)
  }

  // State for calculated data
  const [kpiData, setKpiData] = useState({
    totalRevenue: 0,
    revenueChange: 0,
    ticketsSold: 0,
    ticketsChange: 0,
    refunds: 0,
    refundsChange: 0,
    failedTransactions: 0,
    failedChange: 0,
  })
  const [revenueTrendData, setRevenueTrendData] = useState<RevenueData[]>([])
  const [routeRevenueData, setRouteRevenueData] = useState<RouteRevenueData[]>([])
  const [detailedData, setDetailedData] = useState<DetailedRevenueRow[]>([])

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      const [bookings, trips] = await Promise.all([
        ensureBookingsLoaded(),
        ensureTripsLoaded()
      ])
      
      setKpiData(calculateKpiData(bookings))
      setRevenueTrendData(calculateRevenueTrendData(bookings))
      setRouteRevenueData(calculateRouteRevenueData(bookings, trips))
      setDetailedData(calculateDetailedData(bookings))
    }
    loadData()
  }, [])

  // Chart colors
  const COLORS = {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#06B6D4",
  }

  const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning]

  // Handle export
  const handleExport = (format: "excel" | "pdf") => {
    console.log(`Exporting ${format.toUpperCase()} report`, { 
      kpiData, 
      revenueTrendData: revenueTrendData.length, 
      routeRevenueData: routeRevenueData.length,
      detailedData: detailedData.length 
    })
    // In production, this would generate and download the report
  }

  // Get time filter label
  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case "today":
        return "Hôm nay"
      case "7days":
        return "7 ngày qua"
      case "30days":
        return "30 ngày qua"
      case "custom":
        return "Tùy chỉnh"
      default:
        return "7 ngày qua"
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-slate-600">Đang tải dữ liệu báo cáo...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-error mx-auto mb-3" />
          <p className="text-error mb-3">Lỗi: {error}</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <header className="border-b border-primary/50/50 bg-background/80 backdrop-blur-xl shadow-lg shadow-blue-100/20">
        <div className="flex h-16 items-center justify-between px-2 lg:px-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/staff-dashboard")}
              className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 shadow-lg shadow-green-500/30">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Báo cáo doanh thu
              </h1>
            </div>
          </div>

          {/* Filters */}
          <div className="hidden md:flex items-center gap-2">
            <Select value={timeFilter} onValueChange={(v: any) => setTimeFilter(v)}>
              <SelectTrigger className="w-[160px] border-primary hover:border-primary transition-colors">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="7days">7 ngày qua</SelectItem>
                <SelectItem value="30days">30 ngày qua</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>

            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="w-[180px] border-primary hover:border-primary transition-colors">
                <SelectValue placeholder="Tất cả tuyến" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tuyến</SelectItem>
                <SelectItem value="north-south">Hà Nội - TP.HCM</SelectItem>
                <SelectItem value="north-central">Hà Nội - Đà Nẵng</SelectItem>
                <SelectItem value="south-central">TP.HCM - Nha Trang</SelectItem>
              </SelectContent>
            </Select>

            <Select value={trainTypeFilter} onValueChange={setTrainTypeFilter}>
              <SelectTrigger className="w-[160px] border-primary hover:border-primary transition-colors">
                <SelectValue placeholder="Loại tàu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại tàu</SelectItem>
                <SelectItem value="se">Thống Nhất (SE)</SelectItem>
                <SelectItem value="spt">Sài Gòn (SPT)</SelectItem>
                <SelectItem value="snpt">Bắc Nam (SNPT)</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-8" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-200">
                  <Download className="h-4 w-4" />
                  Xuất báo cáo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleExport("excel")} className="gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4 text-success" />
                  Xuất Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2 cursor-pointer">
                  <FileText className="h-4 w-4 text-error" />
                  Xuất PDF (.pdf)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile export button */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("excel")} className="gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4 text-success" />
                  Xuất Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2 cursor-pointer">
                  <FileText className="h-4 w-4 text-error" />
                  Xuất PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden border-t border-primary/50/50 p-2 space-y-2 bg-background/50">
          <Select value={timeFilter} onValueChange={(v: any) => setTimeFilter(v)}>
            <SelectTrigger className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="custom">Tùy chỉnh</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tuyến" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tuyến</SelectItem>
                <SelectItem value="north-south">HN - HCM</SelectItem>
                <SelectItem value="north-central">HN - ĐN</SelectItem>
              </SelectContent>
            </Select>
            <Select value={trainTypeFilter} onValueChange={setTrainTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Loại tàu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="se">SE</SelectItem>
                <SelectItem value="spt">SPT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="p-2 lg:p-2 space-y-3">
          {/* KPI Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Revenue */}
            <Card className="border-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 shadow-xl shadow-green-500/10 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
              <div className="p-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-green-500/40">
                    <DollarSign className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1 border-0 font-semibold shadow-sm",
                      kpiData.revenueChange >= 0 ? "bg-success/10 text-success" : "bg-error/10 text-error",
                    )}
                  >
                    {kpiData.revenueChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(kpiData.revenueChange)}%
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-1">
                  {kpiData.totalRevenue.toLocaleString("vi-VN")}₫
                </h3>
                <p className="text-sm font-medium text-success">Tổng doanh thu</p>
              </div>
            </Card>

            {/* Tickets Sold */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <div className="p-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40">
                    <Ticket className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1 border-0 font-semibold shadow-sm",
                      kpiData.ticketsChange >= 0 ? "bg-success/10 text-success" : "bg-error/10 text-error",
                    )}
                  >
                    {kpiData.ticketsChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(kpiData.ticketsChange)}%
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-1">{kpiData.ticketsSold.toLocaleString("vi-VN")}</h3>
                <p className="text-sm font-medium text-primary">Vé đã bán</p>
              </div>
            </Card>

            {/* Refunds */}
            <Card className="border-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-xl shadow-amber-500/10 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
              <div className="p-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/40">
                    <RefreshCw className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1 border-0 font-semibold shadow-sm",
                      kpiData.refundsChange <= 0 ? "bg-success/10 text-success" : "bg-error/10 text-error",
                    )}
                  >
                    {kpiData.refundsChange <= 0 ? (
                      <ArrowDownRight className="h-3 w-3" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3" />
                    )}
                    {Math.abs(kpiData.refundsChange)}%
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-1">{kpiData.refunds.toLocaleString("vi-VN")}₫</h3>
                <p className="text-sm font-medium text-amber-700">Hoàn vé</p>
              </div>
            </Card>

            {/* Failed Transactions */}
            <Card className="border-0 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 shadow-xl shadow-red-500/10 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
              <div className="p-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/40">
                    <XCircle className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1 border-0 font-semibold shadow-sm",
                      kpiData.failedChange <= 0 ? "bg-success/10 text-success" : "bg-error/10 text-error",
                    )}
                  >
                    {kpiData.failedChange <= 0 ? (
                      <ArrowDownRight className="h-3 w-3" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3" />
                    )}
                    {Math.abs(kpiData.failedChange)}%
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-destructive mb-1">
                  {kpiData.failedTransactions.toLocaleString("vi-VN")}
                </h3>
                <p className="text-sm font-medium text-error">Giao dịch thất bại</p>
              </div>
            </Card>
          </div>

          {/* Insights Box */}
          <Card className="border-2 border-primary/60 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-violet-50/80 backdrop-blur-sm shadow-xl shadow-blue-500/10">
            <div className="p-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40 shrink-0">
                  <Info className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-3 text-lg font-bold text-primary">📊 Điểm nổi bật</h4>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-background/80 backdrop-blur-sm p-2 border border-primary/50 shadow-md hover:shadow-lg transition-all duration-200">
                      <p className="text-xs font-medium text-primary mb-1">Tuyến bán chạy nhất</p>
                      <p className="font-bold text-primary">Hà Nội - TP.HCM</p>
                      <p className="text-xs text-primary mt-1 font-medium">89.5 triệu ₫ • 448 vé</p>
                    </div>
                    <div className="rounded-xl bg-background/80 backdrop-blur-sm p-2 border border-primary/50 shadow-md hover:shadow-lg transition-all duration-200">
                      <p className="text-xs font-medium text-primary mb-1">Tỷ lệ hoàn vé</p>
                      <p className="font-bold text-success flex items-center gap-1">
                        <TrendingDown className="h-4 w-4" />
                        11.6% (-15.2%)
                      </p>
                      <p className="text-xs text-primary mt-1 font-medium">Giảm so với tuần trước</p>
                    </div>
                    <div className="rounded-xl bg-background/80 backdrop-blur-sm p-2 border border-primary/50 shadow-md hover:shadow-lg transition-all duration-200">
                      <p className="text-xs font-medium text-primary mb-1">Xu hướng</p>
                      <p className="font-bold text-success flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Tăng trưởng
                      </p>
                      <p className="text-xs text-primary mt-1 font-medium">Doanh thu tăng đều</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Charts Section */}
          <div className="grid gap-3 lg:grid-cols-3">
            {/* Revenue Trend - Line Chart */}
            <Card className="border-0 bg-background/80 backdrop-blur-sm shadow-xl shadow-blue-500/10 lg:col-span-2">
              <div className="p-2">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Xu hướng doanh thu</h3>
                    <p className="text-sm text-muted-foreground font-medium">{getTimeFilterLabel()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1.5 border-primary bg-primary/10/50">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-xs font-medium">Doanh thu</span>
                    </Badge>
                    <Badge variant="outline" className="gap-1.5 border-destructive/20 bg-error/10/50">
                      <div className="h-2 w-2 rounded-full bg-error"></div>
                      <span className="text-xs font-medium">Hoàn vé</span>
                    </Badge>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={revenueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
                    <YAxis
                      stroke="#6B7280"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => `${value / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any) => `${value.toLocaleString("vi-VN")}₫`}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke={COLORS.primary}
                      strokeWidth={3}
                      dot={{ fill: COLORS.primary, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="refunds"
                      stroke={COLORS.danger}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: COLORS.danger, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Payment Methods - Pie Chart */}
            <Card className="border-0 bg-background/80 backdrop-blur-sm shadow-xl shadow-blue-500/10">
              <div className="p-2">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-foreground">Phương thức thanh toán</h3>
                  <p className="text-sm text-muted-foreground font-medium">Phân bổ theo giá trị</p>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData as any}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any) => `${value.toLocaleString("vi-VN")}₫`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-2">
                  {paymentMethodData.map((item, index) => (
                    <div key={item.method} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full shadow-sm"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="text-muted-foreground font-medium">{item.method}</span>
                      </div>
                      <span className="font-bold text-foreground">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Route Revenue - Bar Chart */}
          <Card className="border-0 bg-background/80 backdrop-blur-sm shadow-xl shadow-blue-500/10">
            <div className="p-2">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Doanh thu theo tuyến</h3>
                  <p className="text-sm text-muted-foreground font-medium">Top 5 tuyến có doanh thu cao nhất</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={routeRevenueData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    type="number"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000}K`}
                  />
                  <YAxis type="category" dataKey="route" stroke="#6B7280" fontSize={12} tickLine={false} width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any, name: string) => {
                      if (name === "revenue") return [`${value.toLocaleString("vi-VN")}₫`, "Doanh thu"]
                      return [value, "Vé bán"]
                    }}
                  />
                  <Bar dataKey="revenue" fill={COLORS.primary} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Detailed Table */}
          <Card className="border-0 bg-background/80 backdrop-blur-sm shadow-xl shadow-blue-500/10">
            <div className="p-2">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Bảng chi tiết</h3>
                  <p className="text-sm text-muted-foreground font-medium">Doanh thu chi tiết theo ngày và tuyến</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-primary hover:bg-primary/10 hover:border-primary transition-colors bg-transparent"
                >
                  <Filter className="h-4 w-4" />
                  Lọc
                </Button>
              </div>

              <div className="rounded-xl border border-primary/50 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-50 hover:to-indigo-50">
                      <TableHead className="font-bold text-primary">Ngày</TableHead>
                      <TableHead className="font-bold text-primary">Tuyến</TableHead>
                      <TableHead className="text-right font-bold text-primary">Vé bán</TableHead>
                      <TableHead className="text-right font-bold text-primary">Doanh thu</TableHead>
                      <TableHead className="text-right font-bold text-primary">Hoàn vé</TableHead>
                      <TableHead className="text-right font-bold text-primary">Doanh thu ròng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailedData.map((row, index) => (
                      <TableRow key={index} className="hover:bg-primary/10/50 transition-colors">
                        <TableCell className="font-semibold text-foreground">{row.date}</TableCell>
                        <TableCell className="font-medium text-foreground">{row.route}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="border-primary bg-primary/10 text-primary font-semibold">
                            {row.ticketsSold}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-foreground">
                          {row.revenue.toLocaleString("vi-VN")}₫
                        </TableCell>
                        <TableCell className="text-right font-semibold text-error">
                          -{row.refunds.toLocaleString("vi-VN")}₫
                        </TableCell>
                        <TableCell className="text-right font-bold text-success">
                          {row.netRevenue.toLocaleString("vi-VN")}₫
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                <p className="font-medium">Hiển thị 5 trong 47 kết quả</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-primary hover:bg-primary/10 hover:border-primary transition-colors bg-transparent"
                >
                  Xem tất cả
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
