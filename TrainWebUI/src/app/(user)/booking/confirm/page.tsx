"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, Train, Calendar, Clock, CreditCard, UtensilsCrossed, Shield, DoorOpen, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StepIndicator } from "../../components/StepIndicator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { getTripById } from "@/lib/api/trip"
import { getSeatsByTripId } from "@/lib/api/seat"
import { createBooking } from "@/lib/api/booking"
import { createTicket } from "@/lib/api/ticket"
import { getAllTicketTypes } from "@/lib/api/ticketType"
import { SeatType, BookingStatus, TicketStatus, type TripDto, type BookingDto, type TicketEntity } from "@/types"
import { useAuth } from "@/components/auth/AuthContext"
import { SEAT_TYPE_LABELS } from "@/types/seat"
import { PassengerForm, type PassengerFormData } from "./components/PassengerForm"
import { ContactForm, type ContactInfo } from "./components/ContactForm"
import { LoadingState } from "./components/LoadingState"

interface SelectedSeat {
  id: string;
  coachNumber: number;
  seatNumber: string;
  seatType: string;
  price: number;
}

export default function BookingConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  
  console.log(`🔄 BookingConfirmPage mounted`);
  console.log(`📍 SearchParams:`, Object.fromEntries(searchParams));
  console.log(`👤 Auth state - user:`, user, `authLoading:`, authLoading);
  
  const [tripData, setTripData] = useState<TripDto | undefined>();
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Get URL params
  const tripId = searchParams.get("tripId");
  const seatIdsParam = searchParams.get("seatIds");
  const seatIds = seatIdsParam ? seatIdsParam.split(",").filter(Boolean) : [];
  const userId = user?.id || "";

  console.log(`🔍 Parsed URL - tripId: "${tripId}", seatIdsParam: "${seatIdsParam}", seatIds:`, seatIds);
  console.log(`👤 Current userId:`, userId);

  const steps = [
    { label: "Chi tiết tàu", status: "completed" as const },
    { label: "Chọn ghế", status: "completed" as const },
    { label: "Thông tin hành khách", status: "current" as const },
    { label: "Thanh toán", status: "upcoming" as const },
    { label: "Xác nhận", status: "upcoming" as const },
  ];

  // Initialize passenger info for each seat
  const [passengers, setPassengers] = useState<PassengerFormData[]>([]);

  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [optionalServices, setOptionalServices] = useState({
    meal: false,
    insurance: false,
    privateCompartment: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Memoize seatIds string to prevent dependency array issues
  const seatIdsKey = useMemo(() => seatIds.join(","), [seatIds.join(",")]);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        
        // Load trip data and seats in parallel
        if (!tripId) {
          throw new Error("Trip ID is required");
        }

        console.log(`🔄 Confirm page: Loading trip ${tripId} with seats ${seatIds}`);

        const [trip, allSeats] = await Promise.all([
          getTripById(tripId),
          getSeatsByTripId(tripId)
        ]);

        console.log(`✅ Trip loaded:`, trip);
        console.log(`✅ All seats loaded:`, allSeats);

        if (mounted) {
          setTripData(trip);

          // Get actual seat data from backend
          const seatsMap = new Map(allSeats?.map(s => [s.id, s]) || []);
          const actualSeats: SelectedSeat[] = seatIds
            .map(seatId => {
              const seat = seatsMap.get(seatId);
              if (!seat) {
                console.warn(`⚠️ Seat ${seatId} not found in seat list`);
                return null;
              }
              
              // Convert type to string label - handle both string and enum
              let seatTypeLabel = "Ghế mềm";
              if (seat.type !== undefined) {
                if (typeof seat.type === 'string') {
                  seatTypeLabel = SEAT_TYPE_LABELS[seat.type === 'Hard' ? 0 : 1];
                } else {
                  seatTypeLabel = SEAT_TYPE_LABELS[seat.type];
                }
              }
              
              return {
                id: seat.id!,
                coachNumber: 1, // Default coach number
                seatNumber: seat.seatNumber || "",
                seatType: seatTypeLabel,
                price: seat.price || 0,
              };
            })
            .filter((s): s is SelectedSeat => s !== null);

          if (actualSeats.length === 0) {
            throw new Error("No valid seats found");
          }

          console.log(`✅ Selected seats processed:`, actualSeats);

          setSelectedSeats(actualSeats);
          // Initialize passenger info for each seat
          setPassengers(
            actualSeats.map(() => ({
              fullName: "",
              dateOfBirth: "",
              gender: "male",
              idNumber: "",
              phone: "",
              email: "",
            }))
          );
        }
      } catch (error) {
        console.error("❌ Failed to load booking data:", error);
        if (mounted) {
          alert("Không thể tải thông tin ghế. Vui lòng thử lại.");
          router.back();
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    loadData();
    return () => { mounted = false; };
  }, [tripId, seatIdsKey, router]);

  // Trip info with fallback
  const tripInfo = tripData ? {
    trainNumber: tripData.train?.name || "N/A",
    route: `${tripData.originStation || "N/A"} → ${tripData.destinationStation || "N/A"}`,
    departureDate: tripData.departure ? new Date(tripData.departure).toLocaleDateString("vi-VN") : "N/A",
    departureTime: tripData.departure ? new Date(tripData.departure).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "N/A",
    arrivalTime: tripData.arrival ? new Date(tripData.arrival).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "N/A",
  } : {
    trainNumber: "SE3",
    route: "Hà Nội → Đà Nẵng",
    departureDate: "15/11/2025",
    departureTime: "19:30",
    arrivalTime: "08:05",
  };

  const updatePassenger = (index: number, field: keyof PassengerFormData, value: string) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
    // Clear error for this field
    const errorKey = `passenger-${index}-${String(field)}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const { [errorKey]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const copyFromPrevious = (index: number) => {
    if (index > 0) {
      setPassengers((prev) =>
        prev.map((p, i) => (i === index ? { ...passengers[index - 1] } : p))
      );
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate passengers
    passengers.forEach((passenger, index) => {
      if (!passenger.fullName.trim()) {
        newErrors[`passenger-${index}-fullName`] = "Họ tên không được để trống";
      }
      if (!passenger.dateOfBirth.trim()) {
        newErrors[`passenger-${index}-dateOfBirth`] = "Ngày sinh không được để trống";
      }
      if (!passenger.idNumber.trim()) {
        newErrors[`passenger-${index}-idNumber`] = "CCCD/Hộ chiếu không được để trống";
      }
      if (!passenger.phone.trim()) {
        newErrors[`passenger-${index}-phone`] = "Số điện thoại không được để trống";
      }
      if (!passenger.email.trim()) {
        newErrors[`passenger-${index}-email`] = "Email không được để trống";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
        newErrors[`passenger-${index}-email`] = "Email không hợp lệ";
      }
    });

    // Validate contact info
    if (!contactInfo.fullName.trim()) {
      newErrors["contact-fullName"] = "Họ tên liên hệ không được để trống";
    }
    if (!contactInfo.phone.trim()) {
      newErrors["contact-phone"] = "Số điện thoại liên hệ không được để trống";
    }
    if (!contactInfo.email.trim()) {
      newErrors["contact-email"] = "Email liên hệ không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors["contact-email"] = "Email liên hệ không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    router.back();
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Check auth state - wait for auth to load
    if (authLoading) {
      console.log("⏳ Waiting for auth to load...");
      alert("Đang kiểm tra phiên đăng nhập, vui lòng thử lại.");
      return;
    }

    if (!user || !userId) {
      console.warn("❌ User not authenticated:", { user, userId, authLoading });
      alert("Bạn cần đăng nhập để tiếp tục đặt vé.");
      // Save current state to return after login
      sessionStorage.setItem('pendingBooking', JSON.stringify({
        tripId,
        seatIds,
        passengers,
        optionalServices,
      }));
      router.push("/login?returnUrl=" + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    console.log("✅ Auth check passed, userId:", userId);

    try {
      setSubmitting(true);
      
      if (!tripData) {
        throw new Error("Trip data is required");
      }

      if (selectedSeats.length === 0) {
        throw new Error("No seats selected");
      }

      // Step 1: Get available ticket types from backend
      let ticketTypes = [];
      try {
        ticketTypes = await getAllTicketTypes();
        console.log("✅ Available ticket types:", ticketTypes);
      } catch (err) {
        console.warn("⚠️ Could not fetch ticket types, will use default:", err);
        // Use a default ticket type if fetch fails
        ticketTypes = [{ id: 'default', name: 'Standard', discount: 0 }];
      }

      // Use first ticket type as default
      const defaultTicketType = ticketTypes[0] || { id: 'default', name: 'Standard', discount: 0 };
      console.log("📍 Using ticket type:", defaultTicketType);

      // Step 2: Create Tickets first (one ticket per seat)
      const ticketPromises = selectedSeats.map((seat) => {
        const ticketData: TicketEntity = {
          id: undefined, // Let backend generate ID
          seat: {
            id: seat.id,
            seatNumber: seat.seatNumber,
            type: seat.seatType === SEAT_TYPE_LABELS[SeatType.Soft] ? SeatType.Soft : SeatType.Hard,
            price: seat.price,
          },
          ticketType: {
            id: defaultTicketType.id,
            name: defaultTicketType.name,
            discount: defaultTicketType.discount,
          },
          status: TicketStatus.Active,
        };

        console.log(`📤 Creating ticket for seat ${seat.seatNumber}:`, ticketData);
        
        return createTicket(ticketData).catch(err => {
          console.error(`❌ Failed to create ticket for seat ${seat.seatNumber}:`, err);
          throw new Error(`Không thể tạo vé cho ghế ${seat.seatNumber}: ${err.message}`);
        });
      });

      const createdTickets = await Promise.all(ticketPromises);
      console.log(`✅ Created ${createdTickets.length} tickets:`, createdTickets);

      // Step 3: Create Bookings with the ticket IDs
      const bookingPromises = selectedSeats.map((seat, index) => {
        const passengerInfo = passengers[index];
        const ticket = createdTickets[index];

        if (!ticket || !ticket.id) {
          throw new Error(`Ticket for seat ${seat.seatNumber} was not created properly`);
        }

        // Create booking with the ticket ID
        const bookingData: BookingDto = {
          user: {
            id: userId,
            name: passengerInfo.fullName.trim(),
            email: passengerInfo.email.trim(),
          },
          ticket: {
            id: ticket.id, // This is the key - reference the ticket ID
            status: ticket.status || TicketStatus.Active,
          },
          status: BookingStatus.Reserved,
          createdAt: new Date().toISOString(),
        };

        console.log(`📤 Creating booking for ticket ${ticket.id}:`, bookingData);
        
        return createBooking(bookingData).catch(err => {
          console.error(`❌ Failed to create booking for seat ${seat.seatNumber}:`, err);
          throw new Error(`Không thể đặt vé cho ghế ${seat.seatNumber}: ${err.message}`);
        });
      });

      // Create all bookings in parallel
      const bookings = await Promise.all(bookingPromises);
      
      console.log(`✅ Created bookings:`, bookings);
      
      // Validate that all bookings have IDs
      const validBookingIds = bookings
        .filter(b => b && b.id)
        .map(b => b.id!);
      
      if (validBookingIds.length === 0) {
        console.warn("⚠️ Backend không trả về booking IDs. Chuyển sang demo mode.");
        // Save booking data to session storage as fallback
        sessionStorage.setItem('pendingBooking', JSON.stringify({
          seats: selectedSeats,
          tripId: tripData.id,
          passengers,
          optionalServices,
        }));
        // Generate demo IDs for testing
        const demoBookingIds = selectedSeats.map(() => `demo-${Date.now()}-${Math.random().toString(36).substring(7)}`);
        alert("⚠️ Đang ở chế độ demo - backend chưa cấu hình đầy đủ. Booking IDs được tạo tạm thời.");
        router.push(`/booking/payment?bookingId=${demoBookingIds.join(",")}`);
        return;
      }
      
      console.log(`📍 Valid booking IDs:`, validBookingIds);
      
      // Save to session storage as backup
      sessionStorage.setItem('pendingBooking', JSON.stringify({
        bookingIds: validBookingIds,
        seats: selectedSeats,
        tripId: tripData.id,
      }));
      
      // Navigate to payment with booking IDs
      router.push(`/booking/payment?bookingId=${validBookingIds.join(",")}`);
    } catch (error) {
      console.error("Failed to create booking:", error);
      const errorMsg = error instanceof Error ? error.message : "Không thể tạo đơn đặt vé";
      alert(`${errorMsg}. Vui lòng thử lại.`);
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const mealPrice = optionalServices.meal ? selectedSeats.length * 85000 : 0;
  const insurancePrice = optionalServices.insurance ? selectedSeats.length * 50000 : 0;
  const grandTotal = totalPrice + mealPrice + insurancePrice;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading || authLoading) {
    return <LoadingState />
  }

  if (!tripData || selectedSeats.length === 0) {
    console.error(`❌ Invalid page state - tripData:`, tripData, `selectedSeats:`, selectedSeats);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-6 text-center max-w-md">
          <p className="text-red-500 font-medium text-lg mb-2">Không có dữ liệu đơn hàng</p>
          <p className="text-muted-foreground text-sm mb-4">Vui lòng quay lại và chọn ghế lại</p>
          <Button onClick={() => router.back()} className="w-full">Quay lại chọn ghế</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card">
      {/* Journey Info Section - Converted from sticky header */}
      <div className="border-b bg-background shadow-sm">
        <div className="container mx-auto px-2 lg:px-2 py-4">
          <div className="mb-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack} className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                    <Train className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold leading-tight">{tripInfo.trainNumber} - Tàu Thống Nhất</h1>
                    <p className="text-sm text-muted-foreground">{tripInfo.route}</p>
                  </div>
                </div>

                {/* Journey Context */}
                <div className="flex flex-wrap items-center gap-3 text-sm sm:ml-auto">
                  <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2 py-1.5 text-primary">
                    <Calendar className="h-4 w-4" />
                    <span>{tripInfo.departureDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2 py-1.5 text-primary">
                    <Clock className="h-4 w-4" />
                    <span>{tripInfo.departureTime} - {tripInfo.arrivalTime}</span>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    12h 35p
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          <StepIndicator steps={steps} />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-2 lg:px-2 py-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_380px]">
          {/* Main Content */}
          <div className="space-y-3">
            {/* Train Summary */}
            <Card className="border-0 shadow-md">
              <div className="p-2">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <Train className="h-5 w-5 text-primary" />
                  Thông tin chuyến tàu
                </h2>
                <div className="space-y-3 rounded-lg bg-muted/30 p-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày đi</p>
                      <p className="font-medium">{tripInfo.departureDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Khởi hành</p>
                      <p className="font-medium">{tripInfo.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Đến</p>
                      <p className="font-medium">{tripInfo.arrivalTime}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ghế đã chọn</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <Badge
                          key={seat.id}
                          variant="secondary"
                          className="bg-primary text-primary-foreground hover:bg-hover-primary"
                        >
                          Toa {seat.coachNumber}, Ghế {seat.seatNumber}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Passenger Forms */}
            {selectedSeats.map((seat, index) => (
              <PassengerForm
                key={seat.id}
                index={index}
                seatNumber={seat.seatNumber}
                coachNumber={seat.coachNumber}
                passenger={passengers[index]}
                onUpdate={(field, value) => updatePassenger(index, field, value)}
                onCopyFromPrevious={index > 0 ? () => copyFromPrevious(index) : undefined}
                errors={errors}
              />
            ))}

            {/* Contact Information */}
            <ContactForm
              contactInfo={contactInfo}
              onChange={(field, value) => setContactInfo({ ...contactInfo, [field]: value })}
              errors={errors}
            />

            {/* Optional Services */}
            <Card className="border-0 shadow-md">
              <div className="p-2">
                <h3 className="mb-3 text-lg font-semibold">Dịch vụ bổ sung (không bắt buộc)</h3>
                <div className="space-y-3">
                  {/* Meal */}
                  <div className="flex items-start gap-3 rounded-lg border p-2 hover:bg-card transition-colors">
                    <Checkbox
                      id="meal"
                      checked={optionalServices.meal}
                      onCheckedChange={(checked) =>
                        setOptionalServices({ ...optionalServices, meal: checked as boolean })
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="meal" className="flex items-center gap-2 cursor-pointer font-medium">
                        <UtensilsCrossed className="h-4 w-4 text-warning" />
                        Suất ăn trên tàu
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Cơm/phở nóng, nước uống - 85.000đ/người
                      </p>
                    </div>
                    <span className="text-sm font-medium">85.000đ</span>
                  </div>

                  {/* Insurance */}
                  <div className="flex items-start gap-3 rounded-lg border p-2 hover:bg-card transition-colors">
                    <Checkbox
                      id="insurance"
                      checked={optionalServices.insurance}
                      onCheckedChange={(checked) =>
                        setOptionalServices({
                          ...optionalServices,
                          insurance: checked as boolean,
                        })
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="insurance" className="flex items-center gap-2 cursor-pointer font-medium">
                        <Shield className="h-4 w-4 text-success" />
                        Bảo hiểm du lịch
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Bảo hiểm tai nạn và hành lý - 50.000đ/người
                      </p>
                    </div>
                    <span className="text-sm font-medium">50.000đ</span>
                  </div>

                  {/* Private Compartment - Disabled if not applicable */}
                  <div className="flex items-start gap-3 rounded-lg border p-2 opacity-50">
                    <Checkbox id="private" disabled className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor="private" className="flex items-center gap-2 font-medium">
                        <DoorOpen className="h-4 w-4 text-primary" />
                        Khoang riêng (chỉ áp dụng cho VIP)
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Không áp dụng cho loại ghế đã chọn
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Mobile CTA */}
            <div className="lg:hidden space-y-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="w-full"
              >
                Quay lại chọn ghế
              </Button>
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                {submitting ? "Đang xử lý..." : "Tiếp tục thanh toán"}
              </Button>
            </div>
          </div>

          {/* Price Summary Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-16">
              <Card className="border-0 shadow-lg">
                <div className="p-2">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Tổng quan giá vé
                  </h3>

                  <div className="space-y-3">
                    {/* Seat Prices */}
                    {selectedSeats.map((seat) => (
                      <div key={seat.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {seat.seatType} – Ghế {seat.seatNumber}
                        </span>
                        <span className="font-medium">{seat.price.toLocaleString("vi-VN")}đ</span>
                      </div>
                    ))}

                    {/* Optional Services */}
                    {optionalServices.meal && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Suất ăn (×{selectedSeats.length})
                        </span>
                        <span className="font-medium">{mealPrice.toLocaleString("vi-VN")}đ</span>
                      </div>
                    )}

                    {optionalServices.insurance && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Bảo hiểm (×{selectedSeats.length})
                        </span>
                        <span className="font-medium">{insurancePrice.toLocaleString("vi-VN")}đ</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold">Tổng cộng</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      {grandTotal.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Button
                      size="lg"
                      onClick={handleContinue}
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    >
                      {submitting ? "Đang xử lý..." : "Tiếp tục thanh toán"}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleBack}
                      className="w-full"
                    >
                      Quay lại chọn ghế
                    </Button>
                  </div>

                  {/* Info */}
                  <div className="mt-3 rounded-lg bg-primary/10 p-2">
                    <div className="flex gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="text-sm text-primary">
                        <p>Vé điện tử QR sẽ được gửi qua email sau khi thanh toán thành công</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
