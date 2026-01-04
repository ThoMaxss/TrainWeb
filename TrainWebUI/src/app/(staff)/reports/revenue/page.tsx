"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAllBookings } from "@/lib/api/booking"
import { BookingStatus } from "@/types"
import { getAllTrips } from "@/lib/api/trip"
import type { BookingDto as ApiBookingDto, TripDto as ApiTripDto } from "@/types"
import { RevenueKPICards } from "./components/RevenueKPICards"
import { RevenueInsightsBox } from "./components/RevenueInsightsBox"
import { RevenueTrendChart } from "./components/RevenueTrendChart"
import { PaymentMethodsPieChart } from "./components/PaymentMethodsPieChart"
import { RouteRevenueBarChart } from "./components/RouteRevenueBarChart"
import { RevenueDetailTable } from "./components/RevenueDetailTable"

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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Không thể tải danh sách đặt vé")
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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Không thể tải danh sách chuyến tàu")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate KPI data from real bookings
  const calculateKpiData = (bookings: ApiBookingDto[]) => {
    const totalBookings = bookings.length
  const cancelledBookings = bookings.filter(b => b.status === BookingStatus.Cancelled).length
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
  const activeBookings = dayBookings.filter(b => b.status !== BookingStatus.Cancelled)
  const cancelledBookings = dayBookings.filter(b => b.status === BookingStatus.Cancelled)
      
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
      if (booking.trip?.originStation && booking.trip?.destinationStation) {
        const route = `${booking.trip.originStation} - ${booking.trip.destinationStation}`
        const current = routeMap.get(route) || { revenue: 0, tickets: 0 }
        
  if (booking.status !== BookingStatus.Cancelled) {
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
        if (booking.trip?.originStation && booking.trip?.destinationStation) {
          const route = `${booking.trip.originStation} - ${booking.trip.destinationStation}`
          const current = routeMap.get(route) || { ticketsSold: 0, revenue: 0, refunds: 0 }
          
          if (booking.status === BookingStatus.Cancelled) {
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
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-destructive)",
    info: "var(--color-info)",
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
      <div className="flex h-screen flex-col bg-gradient-to-br from-muted via-primary/10 to-primary/20 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu báo cáo...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col bg-background items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <p className="text-destructive mb-3">Lỗi: {error}</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <ScrollArea className="flex-1">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <RevenueKPICards data={kpiData} />
          
          <RevenueInsightsBox />

          <div className="grid gap-4 lg:grid-cols-3">
            <RevenueTrendChart 
              data={revenueTrendData} 
              timeFilterLabel={getTimeFilterLabel()} 
            />
            <PaymentMethodsPieChart data={paymentMethodData} />
          </div>

          <RouteRevenueBarChart data={routeRevenueData} />

          <RevenueDetailTable data={detailedData} />
        </div>
      </ScrollArea>
    </div>
  )
}
