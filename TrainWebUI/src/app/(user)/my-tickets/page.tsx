// 🎨 Enhanced ticket management with unified design system and dark mode
"use client"

import { useState, useEffect } from "react"
import { getBookingsByUserId } from "@/lib/api/booking"
import { BookingDto, BookingStatus } from "@/types"
import { LoadingState } from "./components/LoadingState"
import { EmptyState, ErrorState } from "./components/States"
import {
  Search,
  Train,
  Calendar,
  Clock,
  User,
  Download,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  HelpCircle,
  Ticket,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeStatus } from "@/components/shared/BadgeStatus";
import { CardSection } from "@/components/shared/CardSection";
import { PageContainer, PageHeader, PageContent } from "@/components/shared/PageLayout";

interface Passenger {
  fullName: string;
  seatNumber: string;
  coachNumber: number;
}

interface BookedTicket {
  id: string;
  ticketId: string;
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  passengers: Passenger[];
  totalPrice: number;
  status: "upcoming" | "completed" | "cancelled";
  bookingDate: string;
  seatType: string;
}

interface TicketManagementScreenProps {
  onGoHome: () => void;
  onViewTicket?: (ticketId: string) => void;
}

export function TicketManagementScreen({
  onGoHome,
  onViewTicket,
}: TicketManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming")
  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set())
  const [tickets, setTickets] = useState<BookedTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const userId = localStorage.getItem("userId")
      if (!userId) {
        setError("Vui lòng đăng nhập để xem vé của bạn")
        setLoading(false)
        return
      }

      const bookings = await getBookingsByUserId(userId)
      
      // Transform BookingDto to BookedTicket
      const transformedTickets: BookedTicket[] = bookings.map((booking) => {
        const departureDate = booking.trip?.departure ? new Date(booking.trip.departure) : new Date()
        const arrivalDate = booking.trip?.arrival ? new Date(booking.trip.arrival) : new Date()
        const bookingDate = booking.createdAt ? new Date(booking.createdAt) : new Date()
        
        // Determine status based on booking status and departure date
        let status: "upcoming" | "completed" | "cancelled" = "upcoming"
        if (booking.status === BookingStatus.Cancelled) {
          status = "cancelled"
        } else if (departureDate < new Date()) {
          status = "completed"
        }
        
        return {
          id: booking.id || "",
          ticketId: `TK${booking.id?.substring(0, 10).toUpperCase()}`,
          trainNumber: booking.trip?.train?.name || "N/A",
          trainName: "Tàu Thống Nhất",
          origin: booking.trip?.originStation || "N/A",
          destination: booking.trip?.destinationStation || "N/A",
          departureDate: departureDate.toLocaleDateString("vi-VN"),
          departureTime: departureDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          arrivalTime: arrivalDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          passengers: [
            {
              fullName: booking.user?.name || "N/A",
              seatNumber: booking.seat?.seatNumber || "N/A",
              coachNumber: 1,
            },
          ],
          totalPrice: booking.seat?.price || 0,
          status,
          bookingDate: bookingDate.toLocaleDateString("vi-VN"),
          seatType: booking.seat?.type === 0 ? "Ghế mềm" : "Ghế cứng",
        }
      })
      
      setTickets(transformedTickets)
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError("Không thể tải danh sách vé. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Filter tickets based on active tab and search query
  const filteredTickets = tickets.filter((ticket) => {
    const matchesTab = ticket.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${ticket.origin} ${ticket.destination}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Toggle expanded state
  const toggleExpanded = (ticketId: string) => {
    const newExpanded = new Set(expandedTickets);
    if (newExpanded.has(ticketId)) {
      newExpanded.delete(ticketId);
    } else {
      newExpanded.add(ticketId);
    }
    setExpandedTickets(newExpanded);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // Get status badge config
  const getStatusConfig = (status: BookedTicket["status"]) => {
    switch (status) {
      case "upcoming":
        return {
          label: "Sắp tới",
          variant: "default" as const,
          className: "bg-success/10 text-success hover:bg-success/10",
        };
      case "completed":
        return {
          label: "Hoàn thành",
          variant: "secondary" as const,
          className: "bg-card text-foreground hover:bg-card",
        };
      case "cancelled":
        return {
          label: "Đã hủy",
          variant: "destructive" as const,
          className: "bg-destructive/10 text-destructive hover:bg-destructive/10",
        };
    }
  };

  // Generate QR code placeholder
  const generateQRPlaceholder = () => {
    return (
      <div className="relative aspect-square w-full max-w-[120px]">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <rect width="200" height="200" className="fill-background" />
          <g className="fill-foreground">
            {/* Corner markers */}
            <rect x="10" y="10" width="50" height="50" />
            <rect x="20" y="20" width="30" height="30" className="fill-background" />
            <rect x="140" y="10" width="50" height="50" />
            <rect x="150" y="20" width="30" height="30" className="fill-background" />
            <rect x="10" y="140" width="50" height="50" />
            <rect x="20" y="150" width="30" height="30" className="fill-background" />
            
            {/* Random pattern blocks */}
            {Array.from({ length: 100 }).map((_, i) => {
              const x = 70 + (i % 10) * 10;
              const y = 70 + Math.floor(i / 10) * 10;
              const show = Math.random() > 0.5;
              return show ? <rect key={i} x={x} y={y} width="8" height="8" /> : null;
            })}
          </g>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-background p-1 shadow-lg">
            <Train className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-sm">
              <Ticket className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-primary dark:text-primary-foreground">
                Quản lý vé
              </h1>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                Xem và quản lý vé tàu của bạn
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onGoHome}
            className="gap-2 border-primary hover:bg-primary/10 dark:border-primary/70 dark:hover:bg-primary/20 transition-colors"
          >
            <Train className="h-4 w-4" />
            <span className="hidden sm:inline">Tìm vé tàu</span>
            <span className="sm:hidden">Tìm vé</span>
          </Button>
        </div>
      </PageHeader>

      {/* Main Content */}
      <PageContent maxWidth="4xl">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="upcoming" className="gap-2">
                <Calendar className="h-4 w-4" />
                Sắp tới
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                <Clock className="h-4 w-4" />
                Hoàn thành
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Đã hủy
              </TabsTrigger>
            </TabsList>

            {/* Search Bar */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Nhập mã vé hoặc tuyến (VD: Hà Nội – Đà Nẵng)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 border-primary bg-background pl-11 shadow-sm focus:border-primary focus:ring-ring"
              />
            </div>

            {/* Tab Contents */}
            <TabsContent value="upcoming" className="mt-3 space-y-3">
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={fetchBookings} />
              ) : filteredTickets.length === 0 ? (
                <EmptyState onGoHome={onGoHome} tab="upcoming" />
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      isExpanded={expandedTickets.has(ticket.id)}
                      onToggleExpand={() => toggleExpanded(ticket.id)}
                      onViewTicket={onViewTicket}
                      formatPrice={formatPrice}
                      getStatusConfig={getStatusConfig}
                      generateQRPlaceholder={generateQRPlaceholder}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-3 space-y-3">
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={fetchBookings} />
              ) : filteredTickets.length === 0 ? (
                <EmptyState onGoHome={onGoHome} tab="completed" />
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      isExpanded={expandedTickets.has(ticket.id)}
                      onToggleExpand={() => toggleExpanded(ticket.id)}
                      onViewTicket={onViewTicket}
                      formatPrice={formatPrice}
                      getStatusConfig={getStatusConfig}
                      generateQRPlaceholder={generateQRPlaceholder}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="mt-3 space-y-3">
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={fetchBookings} />
              ) : filteredTickets.length === 0 ? (
                <EmptyState onGoHome={onGoHome} tab="cancelled" />
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      isExpanded={expandedTickets.has(ticket.id)}
                      onToggleExpand={() => toggleExpanded(ticket.id)}
                      onViewTicket={onViewTicket}
                      formatPrice={formatPrice}
                      getStatusConfig={getStatusConfig}
                      generateQRPlaceholder={generateQRPlaceholder}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Support Footer */}
          <Card className="border-0 bg-background shadow-md">
            <div className="p-2">
              <h3 className="mb-3 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Hỗ trợ khách hàng
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {/* Hotline */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hotline 24/7</p>
                    <a
                      href="tel:1900-1234"
                      className="text-primary hover:underline"
                    >
                      1900 1234
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href="mailto:hotro@railway.vn"
                      className="text-primary hover:underline"
                    >
                      hotro@railway.vn
                    </a>
                  </div>
                </div>

                {/* FAQ */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">Hướng dẫn</p>
                    <button className="text-primary hover:underline  transition-colors">
                      Câu hỏi thường gặp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </PageContent>
    </PageContainer>
  );
}

// Ticket Card Component
interface TicketCardProps {
  ticket: BookedTicket;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onViewTicket?: (ticketId: string) => void;
  formatPrice: (price: number) => string;
  getStatusConfig: (status: BookedTicket["status"]) => {
    label: string;
    variant: "default" | "secondary" | "destructive";
    className: string;
  };
  generateQRPlaceholder: () => React.ReactElement;
}

function TicketCard({
  ticket,
  isExpanded,
  onToggleExpand,
  onViewTicket,
  formatPrice,
  getStatusConfig,
  generateQRPlaceholder,
}: TicketCardProps) {
  const statusConfig = getStatusConfig(ticket.status);

  return (
    <Card className="overflow-hidden border-0 shadow-md transition-all hover:shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 px-2 py-2 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Train className="h-5 w-5" />
            <div>
              <p className="font-mono">{ticket.trainNumber}</p>
              <p className="text-xs text-primary-foreground">{ticket.trainName}</p>
            </div>
          </div>
          <Badge className={statusConfig.className}>
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 space-y-3">
        {/* Route */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <div className="flex-1">
              <p className="text-sm">{ticket.origin}</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-1 items-center gap-2">
            <MapPin className="h-4 w-4 text-destructive" />
            <div className="flex-1">
              <p className="text-sm">{ticket.destination}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Ngày đi</p>
              <p className="text-sm">{ticket.departureDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Giờ khởi hành</p>
              <p className="text-sm">{ticket.departureTime ?? ''}</p>
            </div>
          </div>
        </div>

        {/* Passengers Summary */}
        <div className="rounded-lg bg-card p-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm">
                {ticket.passengers[0].fullName}
                {ticket.passengers.length > 1 && (
                  <span className="text-muted-foreground">
                    {" "}
                    +{ticket.passengers.length - 1} người khác
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Toa {ticket.passengers[0].coachNumber}, Ghế{" "}
                {ticket.passengers[0].seatNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-3 pt-2">
            <Separator />

            {/* All Passengers */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                Danh sách hành khách
              </p>
              <div className="space-y-2">
                {ticket.passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg bg-card p-2"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm">{passenger.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        Toa {passenger.coachNumber}, Ghế {passenger.seatNumber}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Mã vé</p>
                <p className="font-mono">{ticket.ticketId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Loại ghế</p>
                <p>{ticket.seatType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ngày đặt</p>
                <p>{ticket.bookingDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tổng tiền</p>
                <p className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-bold">
                  {formatPrice(ticket.totalPrice)}
                </p>
              </div>
            </div>

            {/* QR Code */}
            {ticket.status === "upcoming" && (
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="mb-3 text-center text-sm text-muted-foreground">
                  Mã QR để lên tàu
                </p>
                <div className="mx-auto rounded-lg bg-background p-2 shadow-md w-fit">
                  {generateQRPlaceholder()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-primary hover:bg-primary/10"
            onClick={() => onViewTicket?.(ticket.ticketId)}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Xem vé</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-primary hover:bg-primary/10"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Tải PDF</span>
          </Button>
          {ticket.status === "upcoming" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-primary hover:bg-primary/10"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Đổi/Hoàn</span>
            </Button>
          )}
          {ticket.status !== "upcoming" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-border hover:bg-card"
              disabled
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Đã đóng</span>
            </Button>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpand}
          className="w-full gap-2 text-primary hover:bg-primary/10 hover:text-primary"
        >
          {isExpanded ? (
            <>
              Thu gọn <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Xem chi tiết <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

// EmptyState component now imported from ./components/States

// Default export for the page
export default function MyTicketsPage() {
  const handleViewTicket = (ticketId: string) => {
    // Navigate to ticket detail page
    window.location.href = `/my-tickets/${ticketId}`;
  };

  return (
    <TicketManagementScreen 
      onGoHome={() => window.location.href = '/'} 
      onViewTicket={handleViewTicket}
    />
  );
}
