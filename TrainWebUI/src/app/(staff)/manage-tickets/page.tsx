"use client"

import { useState, useEffect } from "react"
import { FileDown, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/PageHeader"
import { getAllBookings } from "@/lib/api/booking"
import type { BookingDto as ApiBookingDto } from "@/types"
import { BookingStatus } from "@/types"
import { TicketSearchFilters } from "./components/TicketSearchFilters"
import { TicketsTable, type Ticket } from "./components/TicketsTable"
import { TicketsEmptyState } from "./components/TicketsEmptyState"
import { TicketDetailSheet } from "./components/TicketDetailSheet"

export default function ManageTicketsPage() {
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
  const status: Ticket["status"] = booking.status === BookingStatus.Cancelled ? "cancelled" : "upcoming"
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

  // Handle view detail
  const handleViewDetail = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsDetailOpen(true)
  }

  // Handle print ticket
  const handlePrint = (ticketId: string) => {
    console.log("Print ticket:", ticketId)
  }

  // Handle refund/exchange
  const handleRefundExchange = (ticketId: string) => {
    console.log("Refund/Exchange ticket:", ticketId)
  }

  // Handle check-in
  const handleCheckIn = (ticketId: string) => {
    console.log("Check-in ticket:", ticketId)
  }

  // Handle export Excel
  const handleExportExcel = () => {
    console.log("Export to Excel", { ticketCount: tickets.length })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
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
      <div className="p-2 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-2 lg:px-2">
          <PageHeader
            title="Manage Tickets"
            description="Search, filter, and inspect tickets"
            actions={
              <Button onClick={handleExportExcel} className="h-9">
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </Button>
            }
          />
        </div>
      </div>

      <div className="container mx-auto px-2 lg:px-2 py-5">
        <TicketSearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          ticketCounts={ticketCounts}
        />

        {filteredTickets.length > 0 ? (
          <TicketsTable
            tickets={filteredTickets}
            onViewDetail={handleViewDetail}
            onPrint={handlePrint}
            onRefundExchange={handleRefundExchange}
            onCheckIn={handleCheckIn}
            formatCurrency={formatCurrency}
          />
        ) : (
          <TicketsEmptyState />
        )}
      </div>

      <TicketDetailSheet
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        ticket={selectedTicket}
        onPrint={handlePrint}
        onRefundExchange={handleRefundExchange}
        onCheckIn={handleCheckIn}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}
