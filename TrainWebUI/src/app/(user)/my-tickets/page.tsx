"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getBookingsByUserId } from "@/lib/api/booking";
import { getTicketQrUrl } from "@/lib/api/ticket";
import { getCurrentUserId } from "@/lib/utils/auth";
import { generateTicketPDF } from "@/lib/utils/pdfGenerator";
import { BookingDto, BookingStatus } from "@/types";
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
  AlertCircle,
  MapPin,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BookedTicket {
  id: string;
  ticketId: string; // human friendly code
  ticketRawId?: string; // actual ticket id from backend for QR
  trainNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  passengerName: string;
  seatNumber: string;
  totalPrice: number;
  status: "upcoming" | "completed" | "cancelled";
  bookingDate: string;
}

const CACHE_KEY = "my_tickets_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default function MyTicketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set());
  const [tickets, setTickets] = useState<BookedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<BookedTicket | null>(null);

  // Fetch bookings with caching
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get userId using helper function
      const userId = getCurrentUserId();
      
      if (!userId) {
        setError("Vui lòng đăng nhập để xem vé của bạn");
        setLoading(false);
        return;
      }

      // Check cache
      const cacheKey = `${CACHE_KEY}_${userId}`;
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(`${cacheKey}_time`);

      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < CACHE_TTL) {
        console.log(`[My Tickets] Using cached data for user ${userId}`);
        setTickets(JSON.parse(cached));
        setLoading(false);
        return;
      }

      console.log(`[My Tickets] Fetching bookings for user ${userId}`);
      let bookings = null;
      try {
        bookings = await getBookingsByUserId(userId);
        console.log(`[My Tickets] Received ${bookings?.length || 0} bookings`);
      } catch (apiError) {
        console.error(`[My Tickets] API error fetching bookings:`, apiError);
        setError("Không thể tải vé của bạn. Vui lòng thử lại sau.");
        setLoading(false);
        return;
      }

      if (!bookings || bookings.length === 0) {
        console.warn(`[My Tickets] No bookings found for user ${userId}`);
        setTickets([]);
        setLoading(false);
        return;
      }

      // Transform BookingDto to BookedTicket
      const transformedTickets: BookedTicket[] = bookings.map((booking) => {
        const departureDate = booking.trip?.departure
          ? new Date(booking.trip.departure)
          : new Date();
        const bookingDate = booking.createdAt ? new Date(booking.createdAt) : new Date();

        // Determine status
        let status: "upcoming" | "completed" | "cancelled" = "upcoming";
        if (booking.status === BookingStatus.Cancelled) {
          status = "cancelled";
        } else if (departureDate < new Date()) {
          status = "completed";
        }

        const rawTicketId = booking.ticket?.id || booking.id || "";
        const friendlyId = rawTicketId
          ? `TK${rawTicketId.substring(0, 10).toUpperCase()}`
          : `TK${booking.id?.substring(0, 10).toUpperCase()}`;

        return {
          id: booking.id || "",
          ticketId: friendlyId,
          ticketRawId: rawTicketId,
          trainNumber: booking.trip?.train?.name || "N/A",
          origin: booking.trip?.originStation || "N/A",
          destination: booking.trip?.destinationStation || "N/A",
          departureDate: departureDate.toLocaleDateString("vi-VN"),
          departureTime: departureDate.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          arrivalTime: (booking.trip?.arrival
            ? new Date(booking.trip.arrival)
            : new Date()
          ).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          passengerName: booking.user?.name || "N/A",
          seatNumber: booking.seat?.seatNumber || "N/A",
          totalPrice: booking.seat?.price || 0,
          status,
          bookingDate: bookingDate.toLocaleDateString("vi-VN"),
        };
      });

      setTickets(transformedTickets);
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify(transformedTickets));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Không thể tải danh sách vé. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Memoized filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesTab = ticket.status === activeTab;
      const matchesSearch =
        searchQuery === "" ||
        ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.destination.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [tickets, activeTab, searchQuery]);

  // Memoized status config
  const statusConfig = useMemo(() => {
    return {
      upcoming: {
        label: "Sắp tới",
        color: "text-success",
        bgColor: "bg-success/10",
      },
      completed: {
        label: "Hoàn thành",
        color: "text-muted-foreground",
        bgColor: "bg-muted",
      },
      cancelled: {
        label: "Đã hủy",
        color: "text-destructive",
        bgColor: "bg-destructive/10",
      },
    };
  }, []);

  // Format price
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  }, []);

  // Toggle expanded state
  const toggleExpanded = useCallback((ticketId: string) => {
    setExpandedTickets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ticketId)) {
        newSet.delete(ticketId);
      } else {
        newSet.add(ticketId);
      }
      return newSet;
    });
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    const userId = getCurrentUserId();
    if (userId) {
      const cacheKey = `${CACHE_KEY}_${userId}`;
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(`${cacheKey}_time`);
    }
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-background border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Quản lý vé</h1>
              <p className="text-muted-foreground">Xem và quản lý vé tàu của bạn</p>
            </div>
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
            <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
          </TabsList>

          {/* Search Bar */}
          <div className="relative mt-6 mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm vé (mã, tuyến đường)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>

          {/* Tab Contents */}
          {(["upcoming", "completed", "cancelled"] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="animate-spin h-8 w-8 text-primary rounded-full border-4 border-primary/20 border-t-primary" />
                    <p className="text-muted-foreground">Đang tải vé...</p>
                  </CardContent>
                </Card>
              ) : error ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                    <p className="text-center text-muted-foreground">{error}</p>
                    <Button onClick={handleRefresh} variant="outline" className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Thử lại
                    </Button>
                  </CardContent>
                </Card>
              ) : filteredTickets.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                    <Train className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">Không có vé nào</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredTickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="overflow-hidden hover:border-primary transition-colors"
                    >
                      {/* Header */}
                      <div className="bg-primary/5 border-b p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold flex items-center gap-2 mb-2">
                              <Train className="h-4 w-4 text-primary" />
                              {ticket.trainNumber}
                            </h3>
                            <Badge className={statusConfig[ticket.status].bgColor}>
                              {statusConfig[ticket.status].label}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(ticket.id)}
                            className="shrink-0"
                          >
                            {expandedTickets.has(ticket.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div>
                            <p className="font-semibold text-gray-900">{ticket.ticketId}</p>
                            {ticket.ticketRawId && (
                              <p className="text-xs">Mã vé gốc: {ticket.ticketRawId}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p>Đặt lúc {ticket.bookingDate}</p>
                          </div>
                        </div>

                        {/* Route */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Từ</p>
                            <p className="font-semibold">{ticket.origin}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Đến</p>
                            <p className="font-semibold">{ticket.destination}</p>
                          </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                              <Calendar className="h-3 w-3" />
                              Ngày
                            </p>
                            <p className="font-semibold">{ticket.departureDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3" />
                              Giờ
                            </p>
                            <p className="font-semibold">{ticket.departureTime}</p>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedTickets.has(ticket.id) && (
                          <div className="space-y-4 pt-4 border-t">
                            {/* Passenger */}
                            <div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                <User className="h-3 w-3" />
                                Hành khách
                              </p>
                              <p className="font-semibold">{ticket.passengerName}</p>
                            </div>

                            {/* Seat & Price */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Ghế</p>
                                <p className="font-semibold">{ticket.seatNumber}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  Giá
                                </p>
                                <p className="font-semibold text-primary">
                                  {formatPrice(ticket.totalPrice)}
                                </p>
                              </div>
                            </div>

                            {/* QR Code */}
                            <div className="flex flex-col items-center gap-2 pt-2">
                              {ticket.ticketRawId ? (
                                <img
                                  src={getTicketQrUrl(ticket.ticketRawId)}
                                  alt="QR Code"
                                  className="h-24 w-24 rounded border"
                                />
                              ) : (
                                <div className="text-sm text-muted-foreground">
                                  Không có mã QR khả dụng
                                </div>
                              )}
                              {ticket.ticketRawId && (
                                <p className="text-xs text-muted-foreground text-center">
                                  Quét mã để kiểm tra vé
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              <Button 
                                variant="outline" 
                                className="flex-1 gap-2" 
                                size="sm"
                                onClick={async () => {
                                  try {
                                    // Get QR code data URL if available
                                    let qrCodeDataUrl: string | undefined;
                                    if (ticket.ticketRawId) {
                                      const qrUrl = getTicketQrUrl(ticket.ticketRawId);
                                      // Convert QR URL to data URL for embedding
                                      const response = await fetch(qrUrl);
                                      const blob = await response.blob();
                                      qrCodeDataUrl = await new Promise<string>((resolve) => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => resolve(reader.result as string);
                                        reader.readAsDataURL(blob);
                                      });
                                    }

                                    await generateTicketPDF({
                                      ticketId: ticket.ticketId,
                                      trainNumber: ticket.trainNumber,
                                      passengerName: ticket.passengerName,
                                      route: `${ticket.origin} → ${ticket.destination}`,
                                      departureDate: ticket.departureDate,
                                      departureTime: ticket.departureTime,
                                      seatNumber: ticket.seatNumber,
                                      price: ticket.totalPrice,
                                      qrCodeDataUrl,
                                    });
                                  } catch (error) {
                                    console.error('Failed to generate PDF:', error);
                                    alert('Không thể tải vé. Vui lòng thử lại.');
                                  }
                                }}
                              >
                                <Download className="h-4 w-4" />
                                Tải
                              </Button>
                              <Button 
                                variant="outline" 
                                className="flex-1 gap-2" 
                                size="sm"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                <Eye className="h-4 w-4" />
                                Chi tiết
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <div 
            className="bg-background rounded-lg border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-primary/5 border-b p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Chi tiết vé</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{selectedTicket.ticketId}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        selectedTicket.status === "upcoming"
                          ? "bg-success/10 text-success"
                          : selectedTicket.status === "completed"
                            ? "bg-muted text-muted-foreground"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {selectedTicket.status === "upcoming" && "Sắp tới"}
                      {selectedTicket.status === "completed" && "Hoàn thành"}
                      {selectedTicket.status === "cancelled" && "Đã hủy"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedTicket(null)}
                  className="shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* QR Code */}
              <div className="flex flex-col items-center gap-3 py-4">
                {selectedTicket.ticketRawId ? (
                  <>
                    <img
                      src={getTicketQrUrl(selectedTicket.ticketRawId)}
                      alt="QR Code"
                      className="h-48 w-48 rounded border-2"
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      Quét mã này tại ga để kiểm tra vé
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mã vé: {selectedTicket.ticketRawId}
                    </p>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                    <p>Không có mã QR khả dụng</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Trip Information */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Train className="h-5 w-5 text-primary" />
                  Thông tin chuyến đi
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tàu</p>
                    <p className="font-semibold">{selectedTicket.trainNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Số ghế</p>
                    <p className="font-semibold">{selectedTicket.seatNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Ga đi</p>
                        <p className="font-bold text-lg">{selectedTicket.origin}</p>
                      </div>
                      <ArrowRight className="h-6 w-6 text-primary" />
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Ga đến</p>
                        <p className="font-bold text-lg">{selectedTicket.destination}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Ngày khởi hành
                    </p>
                    <p className="font-semibold">{selectedTicket.departureDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Giờ khởi hành
                    </p>
                    <p className="font-semibold">{selectedTicket.departureTime}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Passenger Information */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Thông tin hành khách
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Họ và tên</p>
                    <p className="font-semibold text-lg">{selectedTicket.passengerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ngày đặt vé</p>
                    <p className="font-semibold">{selectedTicket.bookingDate}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Price Information */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Thông tin thanh toán
                </h3>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tổng tiền</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(selectedTicket.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Tải vé
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={() => setSelectedTicket(null)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
