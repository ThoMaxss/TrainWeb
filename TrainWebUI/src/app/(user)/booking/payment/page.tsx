"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Building, Check } from "lucide-react";
import { getBookingById, successBooking } from "@/lib/api/booking";
import { createPayment, successPayment } from "@/lib/api/payment";
import type { BookingDto } from "@/types";
import { PaymentMethod, PaymentStatus, SeatType, BookingStatus } from "@/types";

interface SelectedSeat {
  id: string;
  coachNumber: number;
  seatNumber: string;
  seatType: string;
  price: number;
}

interface OptionalServices {
  meal: boolean;
  insurance: boolean;
}

type UIPaymentMethod = "bank_card" | "e_wallet" | "bank_transfer";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [optionalServices, setOptionalServices] = useState<OptionalServices>({ 
    meal: false, 
    insurance: false 
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<UIPaymentMethod>("bank_card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const bookingIdsParam = searchParams.get("bookingId");
  // Memoize to avoid new array on every render which retriggers effects
  const bookingIds = useMemo(
    () => bookingIdsParam?.split(",").filter(Boolean) || [],
    [bookingIdsParam]
  );

  console.log(`🔍 Payment page - bookingIdsParam: "${bookingIdsParam}", parsed IDs:`, bookingIds);

  useEffect(() => {
    let mounted = true;
    async function loadBookingData() {
      try {
        if (bookingIds.length === 0) {
          throw new Error("No booking IDs provided in URL");
        }

        console.log(`🔄 Starting loadBookingData() at ${new Date().toISOString()}`);
        setLoading(true);
        
        console.log(`🔄 Loading ${bookingIds.length} bookings:`, bookingIds);
        
        // Load all bookings in parallel with timeout
        const bookingPromises = bookingIds.map(async (id) => {
          console.log(`📥 Fetching booking: ${id} at ${new Date().toISOString()}`);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Booking fetch timeout (20s)")), 20000)
          );
          
          try {
            const result = await Promise.race([
              getBookingById(id),
              timeoutPromise
            ]);
            console.log(`✅ Successfully fetched booking ${id}:`, result);
            return result;
          } catch (err) {
            console.error(`❌ Failed to fetch booking ${id}:`, err);
            return null; // Return null on error instead of throwing
          }
        });
        
        console.log('⏳ Waiting for all booking promises to resolve...');
        const loadedBookings = (await Promise.all(bookingPromises)).filter(Boolean);
        console.log(`✅ Loaded ${loadedBookings.length} bookings:`, loadedBookings);
        
        if (mounted) {
          let bookingsToUse: BookingDto[] = [];
          let seatsToUse: SelectedSeat[] = [];

          if (loadedBookings.length === 0) {
            console.warn("⚠️ Không thể load bookings từ backend. Thử fallback sang session storage.");
            // Try to get booking data from session storage (set by confirm page)
            const fallbackData = sessionStorage.getItem('pendingBooking');
            if (fallbackData) {
              try {
                const { seats, tripId } = JSON.parse(fallbackData);
                console.log("📦 Using fallback booking data:", { seats, tripId });
                seatsToUse = seats || [];
                // Create demo bookings for display purposes
                bookingsToUse = (seats || []).map((seat: any, idx: number) => ({
                  id: bookingIds[idx] || `demo-${Date.now()}-${idx}`,
                  seat: seat,
                  status: BookingStatus.Reserved,
                }));
              } catch (parseErr) {
                console.error("Failed to parse fallback data", parseErr);
                // Create minimal fallback
                bookingsToUse = bookingIds.map(id => ({ id, status: BookingStatus.Reserved }));
              }
            } else {
              console.warn("⚠️ No fallback data in session storage, creating minimal state");
              // Create minimal state to allow page to render
              bookingsToUse = bookingIds.map(id => ({ id, status: BookingStatus.Reserved }));
            }
          } else {
            // Use loaded bookings
            bookingsToUse = loadedBookings as BookingDto[];
            // Transform all booking seats to SelectedSeat format (prefer ticket.seat if available)
            seatsToUse = (loadedBookings as BookingDto[])
              .map((bookingData: BookingDto | null) => {
                if (!bookingData) return null;
                // Prefer seat from ticket if backend returns nested ticket
                const seatSource = bookingData.ticket?.seat ?? (bookingData as any).seat;
                const seat = seatSource;
                if (seat && seat.id) {
                  const seatLabel = typeof seat.type === 'string'
                    ? (seat.type.toLowerCase() === 'soft' ? "Ngồi mềm điều hòa" : "Ngồi cứng")
                    : (seat.type === SeatType.Soft ? "Ngồi mềm điều hòa" : "Ngồi cứng");
                  return {
                    id: seat.id!,
                    coachNumber: 1,
                    seatNumber: seat.seatNumber || "",
                    seatType: seatLabel,
                    price: seat.price || 0,
                  };
                }
                return null;
              })
              .filter((s): s is SelectedSeat => s !== null);
          }

          setBookings(bookingsToUse);
          setSelectedSeats(seatsToUse);
          
          // Initialize optional services (can be extended based on backend support)
          setOptionalServices({
            meal: false,
            insurance: false,
          });
        }
      } catch (error) {
        console.error("Failed to load booking data:", error);
        if (mounted) {
          // On error, still try to show payment page with fallback data
          console.warn("⚠️ Attempting fallback due to error");
          const fallbackData = sessionStorage.getItem('pendingBooking');
          if (fallbackData) {
            try {
              const parsed = JSON.parse(fallbackData);
              const { seats } = parsed;
              const demoBookings = bookingIds.map((id, idx) => ({
                id: id.startsWith('demo-') ? id : `demo-${Date.now()}-${idx}`,
                status: BookingStatus.Reserved,
              }));
              setBookings(demoBookings);
              setSelectedSeats(seats || []);
              console.log("✅ Fallback loaded successfully");
            } catch (parseErr) {
              console.error("Fallback parse error", parseErr);
              alert(`⚠️ Không thể tải dữ liệu. Vui lòng quay lại và thử lại.`);
              router.back();
            }
          } else {
            alert(`⚠️ Không thể tải thông tin đặt vé. Vui lòng quay lại và thử lại.`);
            router.back();
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (bookingIds.length === 0) {
      console.error("❌ No booking IDs provided");
      return;
    }

    loadBookingData();
    return () => { mounted = false; };
  }, [bookingIdsParam, router]);

  // Calculate prices
  const ticketTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const mealPrice = optionalServices.meal ? 50000 : 0;
  const insurancePrice = optionalServices.insurance ? 25000 : 0;
  const serviceTotal = mealPrice + insurancePrice;
  const grandTotal = ticketTotal + serviceTotal;

  const handleBack = () => {
    router.back();
  };

  const handlePayment = async () => {
    if (bookings.length === 0) {
      alert("Không tìm thấy thông tin đặt vé. Vui lòng quay lại và thử lại.");
      return;
    }

    setProcessing(true);

    // Validate form based on payment method
    if (paymentMethod === "bank_card") {
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        alert("Vui lòng điền đầy đủ thông tin thẻ");
        setProcessing(false);
        return;
      }
    } else if (paymentMethod === "e_wallet") {
      if (!phoneNumber) {
        alert("Vui lòng nhập số điện thoại");
        setProcessing(false);
        return;
      }
    }

    try {
      // Process payment through API
      const methodEnum =
        paymentMethod === "bank_card"
          ? PaymentMethod.Visa
          : paymentMethod === "e_wallet"
          ? PaymentMethod.Momo
          : PaymentMethod.VnPay;

      // Create payment for first booking (or combine amounts)
      const paymentResult = await createPayment({
        booking: { id: bookings[0].id! },
        method: methodEnum,
        amount: grandTotal,
        status: PaymentStatus.Pending,
      });

      console.log("💳 Payment result:", paymentResult, "Type:", typeof paymentResult);

      // Handle Momo redirect (if payment returns URL string)
      if (typeof paymentResult === 'string') {
        // For demo: redirect to mock MoMo page instead of real MoMo
        const bookingId = bookings[0].id;
        const successUrl = `/booking/success?bookingId=${bookingId}`;
        const mockMomoUrl = `/booking/momo-mock?amount=${grandTotal}&orderId=${bookingId}&orderInfo=Thanh%20toan%20ve%20tau&returnUrl=${encodeURIComponent(window.location.origin + successUrl)}`;
        
        console.log("💳 Redirecting to mock MoMo payment page");
        window.location.href = mockMomoUrl;
        
        // Uncomment below to use real MoMo payment
        // window.location.href = paymentResult;
        return;
      }

      // Mark payment as successful
      await successPayment(paymentResult.id!);
      
      // Mark all bookings as successful (paid)
      const updatePromises = bookings.map(booking =>
        successBooking(booking.id!)
      );
      await Promise.all(updatePromises);
      
      console.log("✅ Payment successful, redirecting to success page");
      // Navigate to success page with booking IDs and payment result
      const bookingIdsString = bookings.map(b => b.id).join(",");
      router.push(`/booking/success?bookingId=${bookingIdsString}&paymentId=${paymentResult.id}`);
    } catch (error) {
      console.error("Payment failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Thanh toán thất bại";
      alert(`❌ Lỗi thanh toán: ${errorMessage}\n\nVui lòng thử lại hoặc chọn phương thức khác.`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-3">Không tìm thấy thông tin đặt vé</p>
          <button 
            onClick={() => router.back()} 
            className="px-2 py-2 bg-primary text-primary-foreground rounded hover:bg-hover-primary"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card p-2">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-3">
          <Button variant="ghost" onClick={handleBack} className="mb-3">
            ← Quay lại
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Thanh toán</h1>
          <p className="text-muted-foreground">Hoàn tất đặt vé của bạn</p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {/* Payment Form */}
          <div className="space-y-3">
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as UIPaymentMethod)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank_card" id="bank_card" />
                    <Label htmlFor="bank_card" className="flex items-center space-x-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      <span>Thẻ ngân hàng</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="e_wallet" id="e_wallet" />
                    <Label htmlFor="e_wallet" className="flex items-center space-x-2 cursor-pointer">
                      <Smartphone className="h-4 w-4" />
                      <span>Ví điện tử (MoMo, ZaloPay)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="flex items-center space-x-2 cursor-pointer">
                      <Building className="h-4 w-4" />
                      <span>Chuyển khoản ngân hàng</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details */}
            {paymentMethod === "bank_card" && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin thẻ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="cardNumber">Số thẻ</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardHolder">Tên chủ thẻ</Label>
                    <Input
                      id="cardHolder"
                      placeholder="NGUYEN VAN A"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="expiryDate">MM/YY</Label>
                      <Input
                        id="expiryDate"
                        placeholder="12/25"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "e_wallet" && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin ví điện tử</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="0912345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "bank_transfer" && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chuyển khoản</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Ngân hàng:</strong> Vietcombank</p>
                    <p><strong>Số tài khoản:</strong> 1234567890</p>
                    <p><strong>Tên tài khoản:</strong> CONG TY TNHH TRAIN BOOKING</p>
                    <p><strong>Nội dung:</strong> THANHTOAN [MÃ ĐẶT VÉ]</p>
                    <div className="bg-warning/10 p-2 rounded-md border border-warning/20">
                      <p className="text-warning">
                        Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý tự động.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Seats */}
                <div>
                  <h4 className="font-medium mb-2">Vé tàu ({selectedSeats.length} ghế)</h4>
                  {selectedSeats.map((seat) => (
                    <div key={seat.id} className="flex justify-between text-sm py-1">
                      <span>Toa {seat.coachNumber} - Ghế {seat.seatNumber}</span>
                      <span>{seat.price.toLocaleString()}đ</span>
                    </div>
                  ))}
                </div>

                {/* Services */}
                {(optionalServices.meal || optionalServices.insurance) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Dịch vụ bổ sung</h4>
                      {optionalServices.meal && (
                        <div className="flex justify-between text-sm py-1">
                          <span>Suất ăn</span>
                          <span>{mealPrice.toLocaleString()}đ</span>
                        </div>
                      )}
                      {optionalServices.insurance && (
                        <div className="flex justify-between text-sm py-1">
                          <span>Bảo hiểm hành trình</span>
                          <span>{insurancePrice.toLocaleString()}đ</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tiền vé:</span>
                    <span>{ticketTotal.toLocaleString()}đ</span>
                  </div>
                  {serviceTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Dịch vụ:</span>
                      <span>{serviceTotal.toLocaleString()}đ</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{grandTotal.toLocaleString()}đ</span>
                  </div>
                </div>

                {/* Payment Button */}
                <Button 
                  onClick={handlePayment} 
                  disabled={processing || bookings.length === 0 || loading}
                  className="w-full"
                >
                  {processing ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Đang xử lý thanh toán...</span>
                    </div>
                  ) : loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Đang tải dữ liệu...</span>
                    </div>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Thanh toán {grandTotal.toLocaleString()}đ
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="mt-3">
              <CardContent className="pt-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 bg-success rounded-full flex items-center justify-center">
                    <Check className="h-2 w-2 text-primary-foreground" />
                  </div>
                  <span>Thanh toán được bảo mật bằng SSL 256-bit</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
