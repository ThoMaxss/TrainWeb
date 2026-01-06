"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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

type UIPaymentMethod = "bank_card" | "momo" | "bank_transfer";

/** ✅ thay any bằng type rõ ràng */
type SeatLike = {
  id: string;
  seatNumber?: string;
  price?: number;
  type?: SeatType | string;
};

function isSeatLike(value: unknown): value is SeatLike {
  if (!value || typeof value !== "object") return false;
  const v = value as { id?: unknown };
  return typeof v.id === "string" && v.id.length > 0;
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [optionalServices, setOptionalServices] = useState<OptionalServices>({
    meal: false,
    insurance: false,
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<UIPaymentMethod>("momo");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const bookingIdsParam = searchParams.get("bookingId");
  const bookingIds = useMemo(
    () => bookingIdsParam?.split(",").filter(Boolean) || [],
    [bookingIdsParam]
  );

  useEffect(() => {
    let mounted = true;

    async function loadBookingData() {
      try {
        if (bookingIds.length === 0) {
          throw new Error("No booking IDs provided in URL");
        }

        setLoading(true);

        const bookingPromises = bookingIds.map(async (id: string) => {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Booking fetch timeout (20s)")), 20000)
          );

          try {
            const result = await Promise.race([getBookingById(id), timeoutPromise]);
            return result;
          } catch (err) {
            console.error(`❌ Failed to fetch booking ${id}:`, err);
            return null;
          }
        });

        const loadedBookings = (await Promise.all(bookingPromises)).filter(Boolean);

        if (mounted) {
          let bookingsToUse: BookingDto[] = [];
          let seatsToUse: SelectedSeat[] = [];

          if (loadedBookings.length === 0) {
            console.warn("⚠️ Không thể load bookings từ backend. Thử fallback sang session storage.");
            const fallbackData = sessionStorage.getItem("pendingBooking");

            if (fallbackData) {
              try {
                const { seats } = JSON.parse(fallbackData) as { seats?: SelectedSeat[] };
                seatsToUse = seats || [];
                bookingsToUse = (seats || []).map((_, idx: number) => ({
                  id: bookingIds[idx] || `demo-${Date.now()}-${idx}`,
                  status: BookingStatus.Reserved,
                })) as BookingDto[];
              } catch (parseErr) {
                console.error("Failed to parse fallback data", parseErr);
                bookingsToUse = bookingIds.map((id: string) => ({
                  id,
                  status: BookingStatus.Reserved,
                })) as BookingDto[];
              }
            } else {
              bookingsToUse = bookingIds.map((id: string) => ({
                id,
                status: BookingStatus.Reserved,
              })) as BookingDto[];
            }
          } else {
            bookingsToUse = loadedBookings as BookingDto[];

            seatsToUse = (loadedBookings as BookingDto[])
              .map((bookingData) => {
                const seatSource: unknown =
                  bookingData.ticket?.seat ??
                  (bookingData as unknown as { seat?: unknown }).seat;

                if (!isSeatLike(seatSource)) return null;

                const seat = seatSource;

                const seatLabel =
                  typeof seat.type === "string"
                    ? seat.type.toLowerCase() === "soft"
                      ? "Ngồi mềm điều hòa"
                      : "Ngồi cứng"
                    : seat.type === SeatType.Soft
                    ? "Ngồi mềm điều hòa"
                    : "Ngồi cứng";

                return {
                  id: seat.id,
                  coachNumber: 1,
                  seatNumber: seat.seatNumber || "",
                  seatType: seatLabel,
                  price: seat.price || 0,
                };
              })
              .filter((s): s is SelectedSeat => s !== null);
          }

          setBookings(bookingsToUse);
          setSelectedSeats(seatsToUse);
          setOptionalServices({ meal: false, insurance: false });
        }
      } catch (error) {
        console.error("Failed to load booking data:", error);
        if (mounted) {
          const fallbackData = sessionStorage.getItem("pendingBooking");
          if (fallbackData) {
            try {
              const parsed = JSON.parse(fallbackData) as { seats?: SelectedSeat[] };
              const demoBookings = bookingIds.map((id: string) => ({
                id,
                status: BookingStatus.Reserved,
              })) as BookingDto[];
              setBookings(demoBookings);
              setSelectedSeats(parsed.seats || []);
            } catch (parseErr) {
              console.error("Fallback parse error", parseErr);
              alert("⚠️ Không thể tải dữ liệu. Vui lòng quay lại và thử lại.");
              router.back();
            }
          } else {
            alert("⚠️ Không thể tải thông tin đặt vé. Vui lòng quay lại và thử lại.");
            router.back();
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (bookingIds.length === 0) return;

    loadBookingData();
    return () => {
      mounted = false;
    };
  }, [bookingIds, router]);

  const ticketTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const mealPrice = optionalServices.meal ? 50000 : 0;
  const insurancePrice = optionalServices.insurance ? 25000 : 0;
  const serviceTotal = mealPrice + insurancePrice;
  const grandTotal = ticketTotal + serviceTotal;

  const handleBack = () => router.back();

  const handlePayment = async () => {
    if (bookings.length === 0) {
      alert("Không tìm thấy thông tin đặt vé. Vui lòng quay lại và thử lại.");
      return;
    }

    setProcessing(true);

    if (paymentMethod === "bank_card") {
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        alert("Vui lòng điền đầy đủ thông tin thẻ");
        setProcessing(false);
        return;
      }
    }

    try {
      const methodEnum =
        paymentMethod === "bank_card"
          ? PaymentMethod.Visa
          : paymentMethod === "momo"
          ? PaymentMethod.Momo
          : PaymentMethod.VnPay;

      const paymentResult = await createPayment({
        booking: { id: bookings[0].id! },
        method: methodEnum,
        amount: grandTotal,
        status: PaymentStatus.Pending,
      });

      if (typeof paymentResult === "string") {
        window.location.href = paymentResult;
        return;
      }

      await successPayment(paymentResult.id!);

      for (const booking of bookings) {
        const paidFlag =
          typeof window !== "undefined" ? sessionStorage.getItem(`paid:${booking.id}`) : null;
        if (paidFlag === "true") continue;

        await successBooking(booking.id!);

        try {
          await getBookingById(booking.id!);
        } catch (err) {
          console.warn(`Failed to fetch booking ${booking.id} after success call`, err);
        }
      }

      const bookingIdsString = bookings.map((b) => b.id).join(",");
      router.push(
        `/booking/success?bookingId=${bookingIdsString}&paymentId=${paymentResult.id}`
      );
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
        <div className="mb-3">
          <Button variant="ghost" onClick={handleBack} className="mb-3">
            ← Quay lại
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Thanh toán</h1>
          <p className="text-muted-foreground">Hoàn tất đặt vé của bạn</p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as UIPaymentMethod)}
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex items-center space-x-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-payment-momo rounded-lg flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Ví MoMo</div>
                        <div className="text-xs text-muted-foreground">Thanh toán qua ứng dụng MoMo</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="bank_card" id="bank_card" />
                    <Label htmlFor="bank_card" className="flex items-center space-x-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-payment-bank rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Thẻ ngân hàng</div>
                        <div className="text-xs text-muted-foreground">Visa, Mastercard, JCB</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="flex items-center space-x-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-payment-transfer rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Chuyển khoản ngân hàng</div>
                        <div className="text-xs text-muted-foreground">Chuyển khoản qua Internet Banking</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

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

            {paymentMethod === "momo" && (
              <Card>
                <CardHeader>
                  <CardTitle>Thanh toán MoMo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-payment-momo/10 dark:bg-payment-momo-dark/20 p-4 rounded-lg border border-payment-momo/30 dark:border-payment-momo-dark/30">
                    <div className="flex gap-3">
                      <Smartphone className="h-5 w-5 text-payment-momo dark:text-payment-momo flex-shrink-0 mt-0.5" />
                      <div className="text-sm space-y-2">
                        <p className="font-medium text-payment-momo-dark dark:text-payment-momo">
                          Hướng dẫn thanh toán:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-payment-momo-dark/80 dark:text-payment-momo/80">
                          {/* ✅ fix unescaped entities */}
                          <li>Nhấn nút &quot;Thanh toán&quot; bên dưới</li>
                          <li>Bạn sẽ được chuyển đến trang thanh toán MoMo</li>
                          <li>Quét mã QR bằng ứng dụng MoMo hoặc đăng nhập</li>
                          <li>Xác nhận thanh toán trên ứng dụng</li>
                          <li>Hệ thống sẽ tự động chuyển về sau khi hoàn tất</li>
                        </ol>
                      </div>
                    </div>
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
                    <p><strong>Tên tài khoản:</strong> CONG TY TNHH GORAIL</p>
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

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Vé tàu ({selectedSeats.length} ghế)</h4>
                  {selectedSeats.map((seat) => (
                    <div key={seat.id} className="flex justify-between text-sm py-1">
                      <span>Toa {seat.coachNumber} - Ghế {seat.seatNumber}</span>
                      <span>{seat.price.toLocaleString()}đ</span>
                    </div>
                  ))}
                </div>

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
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Thanh toán {grandTotal.toLocaleString()}đ
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

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
