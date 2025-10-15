"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Train,
  Calendar,
  Clock,
  Copy,
  User,
  Phone,
  Mail,
  CreditCard,
  UtensilsCrossed,
  Shield,
  DoorOpen,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StepIndicator } from "../../components/StepIndicator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { getTripById } from "@/lib/api/trip";
import { createBooking } from "@/lib/api/booking";
import { UserRole, BookingStatus, SeatType } from "@/types/common";
import type { TripDto, BookingDto, PassengerDto } from "@/types";

interface SelectedSeat {
  id: string;
  coachNumber: number;
  seatNumber: string;
  seatType: string;
  price: number;
}

interface PassengerInfo extends PassengerDto {
  // Extending PassengerDto with any local state if needed
}

export default function BookingConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tripData, setTripData] = useState<TripDto | undefined>();
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Get URL params
  const tripId = searchParams.get("tripId");
  const seatIds = searchParams.get("seatIds")?.split(",") || [];
  const userId = "current-user"; // TODO: get from auth context

  const steps = [
    { label: "Chi tiết tàu", status: "completed" as const },
    { label: "Chọn ghế", status: "completed" as const },
    { label: "Thông tin hành khách", status: "current" as const },
    { label: "Thanh toán", status: "upcoming" as const },
    { label: "Xác nhận", status: "upcoming" as const },
  ];

  // Initialize passenger info for each seat
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);

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

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        
        // Load trip data
        if (tripId) {
          const trip = await getTripById(tripId);
          if (mounted) {
            setTripData(trip);
          }
        }

        // Mock selected seats - in real app, get from seat selection state
        const mockSeats: SelectedSeat[] = seatIds.map((seatId, index) => ({
          id: seatId,
          coachNumber: 1,
          seatNumber: `${12 + index}A`,
          seatType: "Ngồi mềm điều hòa",
          price: 650000,
        }));

        if (mounted) {
          setSelectedSeats(mockSeats);
          // Initialize passenger info for each seat
          setPassengers(
            mockSeats.map((_, index) => ({
              fullName: "",
              dateOfBirth: "",
              gender: "male" as const,
              idNumber: "",
              phone: "",
              email: "",
            }))
          );
        }
      } catch (error) {
        console.error("Failed to load booking data:", error);
        // Continue with fallback data
        if (mounted) {
          const fallbackSeats = [
            {
              id: "seat1",
              coachNumber: 1,
              seatNumber: "12A",
              seatType: "Ngồi mềm điều hòa",
              price: 650000,
            }
          ];
          setSelectedSeats(fallbackSeats);
          setPassengers([
            {
              fullName: "",
              dateOfBirth: "",
              gender: "male" as const,
              idNumber: "",
              phone: "",
              email: "",
            }
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    loadData();
    return () => { mounted = false; };
  }, [tripId, seatIds]);

  // Trip info with fallback
  const tripInfo = tripData ? {
    trainNumber: tripData.train?.name || "N/A",
    route: `${tripData.departureStation || "N/A"} → ${tripData.arrivalStation || "N/A"}`,
    departureDate: tripData.departureTime ? new Date(tripData.departureTime).toLocaleDateString("vi-VN") : "N/A",
    departureTime: tripData.departureTime ? new Date(tripData.departureTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "N/A",
    arrivalTime: tripData.arrivalTime ? new Date(tripData.arrivalTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "N/A",
  } : {
    trainNumber: "SE3",
    route: "Hà Nội → Đà Nẵng",
    departureDate: "15/11/2025",
    departureTime: "19:30",
    arrivalTime: "08:05",
  };

  const updatePassenger = (index: number, field: keyof PassengerInfo, value: string) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
    // Clear error for this field
    const errorKey = `passenger-${index}-${field}`;
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

    try {
      setSubmitting(true);
      
      if (!tripData) {
        throw new Error("Trip data is required");
      }

      // Create proper BookingDto object
      const bookingData: BookingDto = {
        id: "", // Will be generated by backend
        userId: userId,
        tripId: tripData.id,
        seatIds: selectedSeats.map(seat => seat.id),
        user: {
          id: userId,
          name: contactInfo.fullName.trim(),
          email: contactInfo.email.trim(),
          phone: contactInfo.phone.trim(),
          role: UserRole.PASSENGER,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        trip: tripData,
        seats: selectedSeats.map(seat => ({
          id: seat.id,
          trainId: tripData.trainId || "",
          coach: seat.coachNumber,
          seatNumber: seat.seatNumber,
          type: SeatType.SOFT, // Default to Soft seat type
          price: seat.price,
          isAvailable: false, // Now booked
        })),
        totalAmount: grandTotal,
        status: BookingStatus.RESERVED,
        bookingCode: "", // Will be generated by backend
        passengerInfo: passengers.map((passenger, index) => ({
          name: passenger.fullName.trim(),
          idNumber: passenger.idNumber.trim(),
          phone: passenger.phone.trim(),
          seatId: selectedSeats[index]?.id || "",
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create booking with backend API
      const booking = await createBooking(bookingData);
      
      // Navigate to payment with booking ID
      router.push(`/booking/payment?bookingId=${booking.id}`);
    } catch (error) {
      console.error("Failed to create booking:", error);
      alert("Không thể tạo đơn đặt vé. Vui lòng thử lại.");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background shadow-sm">
        <div className="container mx-auto px-2 lg:px-2 py-2">
          <div className="mb-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack} className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
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
                <div className="space-y-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-2">
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
              <Card key={seat.id} className="border-0 shadow-md">
                <div className="p-2">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <User className="h-5 w-5 text-primary" />
                      Hành khách {index + 1} - Toa {seat.coachNumber}, Ghế {seat.seatNumber}
                    </h3>
                    {index > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyFromPrevious(index)}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Sao chép từ HK trước
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <Label htmlFor={`fullname-${index}`}>
                        Họ và tên <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`fullname-${index}`}
                        placeholder="Nhập họ và tên"
                        value={passengers[index]?.fullName || ""}
                        onChange={(e) => updatePassenger(index, "fullName", e.target.value)}
                        className="mt-1.5"
                        data-error={!!errors[`passenger-${index}-fullName`]}
                      />
                      {errors[`passenger-${index}-fullName`] && (
                        <p className="text-sm text-destructive mt-1">{errors[`passenger-${index}-fullName`]}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <Label htmlFor={`dob-${index}`}>
                        Ngày sinh <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`dob-${index}`}
                        type="text"
                        placeholder="DD/MM/YYYY"
                        value={passengers[index]?.dateOfBirth || ""}
                        onChange={(e) => updatePassenger(index, "dateOfBirth", e.target.value)}
                        className="mt-1.5"
                        data-error={!!errors[`passenger-${index}-dateOfBirth`]}
                      />
                      {errors[`passenger-${index}-dateOfBirth`] && (
                        <p className="text-sm text-destructive mt-1">{errors[`passenger-${index}-dateOfBirth`]}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <Label>
                        Giới tính <span className="text-destructive">*</span>
                      </Label>
                      <RadioGroup
                        value={passengers[index]?.gender || "male"}
                        onValueChange={(value: any) => updatePassenger(index, "gender", value)}
                        className="mt-1.5 flex gap-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id={`male-${index}`} />
                          <Label htmlFor={`male-${index}`} className="!font-normal cursor-pointer">
                            Nam
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id={`female-${index}`} />
                          <Label htmlFor={`female-${index}`} className="!font-normal cursor-pointer">
                            Nữ
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id={`other-${index}`} />
                          <Label htmlFor={`other-${index}`} className="!font-normal cursor-pointer">
                            Khác
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* ID Number */}
                    <div>
                      <Label htmlFor={`id-${index}`}>
                        CCCD/Hộ chiếu <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`id-${index}`}
                        placeholder="Nhập số CCCD hoặc hộ chiếu"
                        value={passengers[index]?.idNumber || ""}
                        onChange={(e) => updatePassenger(index, "idNumber", e.target.value)}
                        className="mt-1.5"
                        data-error={!!errors[`passenger-${index}-idNumber`]}
                      />
                      {errors[`passenger-${index}-idNumber`] && (
                        <p className="text-sm text-destructive mt-1">{errors[`passenger-${index}-idNumber`]}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor={`phone-${index}`}>
                        Điện thoại <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`phone-${index}`}
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={passengers[index]?.phone || ""}
                        onChange={(e) => updatePassenger(index, "phone", e.target.value)}
                        className="mt-1.5"
                        data-error={!!errors[`passenger-${index}-phone`]}
                      />
                      {errors[`passenger-${index}-phone`] && (
                        <p className="text-sm text-destructive mt-1">{errors[`passenger-${index}-phone`]}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                      <Label htmlFor={`email-${index}`}>
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        placeholder="Nhập địa chỉ email"
                        value={passengers[index]?.email || ""}
                        onChange={(e) => updatePassenger(index, "email", e.target.value)}
                        className="mt-1.5"
                        data-error={!!errors[`passenger-${index}-email`]}
                      />
                      {errors[`passenger-${index}-email`] && (
                        <p className="text-sm text-destructive mt-1">{errors[`passenger-${index}-email`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Contact Information */}
            <Card className="border-0 shadow-md">
              <div className="p-2">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <Mail className="h-5 w-5 text-primary" />
                  Thông tin liên hệ (nhận vé QR)
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="contact-name">
                      Họ và tên liên hệ <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder="Nhập họ và tên"
                      value={contactInfo.fullName}
                      onChange={(e) =>
                        setContactInfo({ ...contactInfo, fullName: e.target.value })
                      }
                      className="mt-1.5"
                      data-error={!!errors["contact-fullName"]}
                    />
                    {errors["contact-fullName"] && (
                      <p className="text-sm text-destructive mt-1">{errors["contact-fullName"]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contact-phone">
                      Số điện thoại <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="mt-1.5"
                      data-error={!!errors["contact-phone"]}
                    />
                    {errors["contact-phone"] && (
                      <p className="text-sm text-destructive mt-1">{errors["contact-phone"]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contact-email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="Nhập địa chỉ email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="mt-1.5"
                      data-error={!!errors["contact-email"]}
                    />
                    {errors["contact-email"] && (
                      <p className="text-sm text-destructive mt-1">{errors["contact-email"]}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

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
                        <UtensilsCrossed className="h-4 w-4 text-orange-600" />
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
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {submitting ? "Đang xử lý..." : "Tiếp tục thanh toán"}
              </Button>
            </div>
          </div>

          {/* Price Summary Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
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
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      {grandTotal.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Button
                      size="lg"
                      onClick={handleContinue}
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
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
