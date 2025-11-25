"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Download, ImageIcon, Wallet, Share2, Home, Phone, Mail, Train, CreditCard, ChevronRight, Star, Ticket, User, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getBookingById } from "@/lib/api/booking"
import { BookingDto } from "@/types"
import { SuccessHeader } from "./components/SuccessHeader"
import { QRCodePlaceholder, Barcode } from "./components/QRCode"
import { JourneyInfo } from "./components/JourneyInfo"
import { PassengerList } from "./components/PassengerList"
import { LoadingState } from "./components/LoadingState"

interface SelectedSeat {
  id: string;
  coachNumber: number;
  seatNumber: string;
  seatType: string;
  price: number;
}

interface Passenger {
  fullName: string;
  seatNumber: string;
  coachNumber: number;
}

export default function BookingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<BookingDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCopied, setShowCopied] = useState(false)

  // Fetch booking data from API
  useEffect(() => {
    async function fetchBooking() {
      try {
        setLoading(true)
        const bookingId = searchParams.get("bookingId")
        
        if (!bookingId) {
          console.error("No booking ID provided")
          setLoading(false)
          return
        }

        const bookingData = await getBookingById(bookingId)
        setBooking(bookingData)
      } catch (error) {
        console.error("Error fetching booking:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [searchParams])

  // Calculate prices and data from booking
  const totalPrice = booking?.seat?.price || 0
  const grandTotal = totalPrice

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ"
  }

  const ticketId = booking?.id ? `TK${booking.id.substring(0, 10).toUpperCase()}` : "N/A"
  const bookingDate = booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString("vi-VN") : "N/A"
  const bookingTime = booking?.createdAt ? new Date(booking.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "N/A"

  const tripInfo = booking?.trip ? {
    trainNumber: booking.trip.train?.name || "N/A",
    trainName: "Tàu Thống Nhất",
    route: `${booking.trip.originStation || "N/A"} → ${booking.trip.destinationStation || "N/A"}`,
    departureDate: new Date(booking.trip.departure!).toLocaleDateString("vi-VN"),
    departureTime: new Date(booking.trip.departure!).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    arrivalTime: new Date(booking.trip.arrival!).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  } : null

  const passengerList = booking ? [{
    fullName: booking.user?.name || "N/A",
    seatNumber: booking.seat?.seatNumber || "N/A",
    coachNumber: 1,
  }] : []

  // Mock QR code (in production, this would be generated with booking data)
  const generateQRPlaceholder = () => {
    return (
      <div className="relative aspect-square w-full max-w-[200px] mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* QR Code Pattern - simplified mock */}
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
          <div className="rounded-full bg-background p-2 shadow-lg">
            <Train className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>
    );
  };

  // Generate barcode
  const generateBarcode = () => {
    return (
      <svg viewBox="0 0 200 40" className="w-full h-10">
        <rect width="200" height="40" fill="transparent" />
        {Array.from({ length: 40 }).map((_, i) => {
          const width = Math.random() > 0.5 ? 2 : 4;
          const height = 30;
          return (
            <rect
              key={i}
              x={i * 5}
              y="5"
              width={width}
              height={height}
              className="fill-foreground"
            />
          );
        })}
      </svg>
    );
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleRateTrip = () => {
    router.push("/feedback");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Vé tàu điện tử",
        text: `Mã vé: ${ticketId}\nSE3 - Hà Nội → Đà Nẵng\n15/11/2025`,
      });
    } else {
      navigator.clipboard.writeText(ticketId);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  if (loading) {
    return <LoadingState />
  }

  if (!booking || !tripInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-2 text-center">
          <p className="text-muted-foreground">Không tìm thấy thông tin đặt vé</p>
          <Button className="mt-3" onClick={handleGoHome}>Về trang chủ</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SuccessHeader />

      {/* Main Content */}
      <div className="container mx-auto px-2 lg:px-2 py-5">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* E-Ticket Card */}
          <Card className="overflow-hidden border-0 shadow-xl bg-background">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 px-2 py-2 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-background/20 p-2 backdrop-blur-sm">
                    <Ticket className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-primary-foreground">Vé tàu điện tử</h2>
                    <p className="text-sm text-primary-foreground">Đường sắt Việt Nam</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary-foreground">Mã vé</p>
                  <p className="font-mono text-primary-foreground">{ticketId}</p>
                </div>
              </div>
            </div>

            {/* Ticket Body - Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_auto_300px]">
              {/* Left Section - Details */}
              <div className="p-2 space-y-3">
                <JourneyInfo tripInfo={tripInfo} />

                <Separator />

                <PassengerList passengers={passengerList} />

                <Separator />

                {/* Booking Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ngày đặt vé</p>
                    <p>{bookingDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Giờ đặt vé</p>
                    <p>{bookingTime}</p>
                  </div>
                </div>
              </div>

              {/* Dashed Divider */}
              <div className="relative w-px">
                <div className="absolute inset-y-0 left-0 w-full border-l-2 border-dashed border-border"></div>
                {/* Circle cutouts */}
                <div className="absolute -top-4 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-card"></div>
                <div className="absolute -bottom-4 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-card"></div>
              </div>

              {/* Right Section - QR & Price */}
              <div className="flex flex-col items-center justify-between bg-muted/30 p-2">
                <div className="w-full space-y-3">
                  <p className="text-center text-sm text-muted-foreground">
                    Xuất trình mã QR khi lên tàu
                  </p>
                  
                  {/* QR Code */}
                  <div className="rounded-xl bg-background p-2 shadow-md">
                    <QRCodePlaceholder ticketId={ticketId} />
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Mã vé</p>
                    <p className="font-mono text-sm">{ticketId}</p>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <Separator />
                  
                  {/* Total Price */}
                  <div className="rounded-lg bg-background p-2 text-center shadow-sm">
                    <p className="text-sm text-muted-foreground">Tổng thanh toán</p>
                    <p className="text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-bold">
                      {formatPrice(grandTotal)}
                    </p>
                  </div>

                  {/* Barcode */}
                  <div className="rounded-lg bg-background p-2">
                    <Barcode />
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Body - Mobile Layout */}
            <div className="lg:hidden">
              <div className="p-2 space-y-3">
                <JourneyInfo tripInfo={tripInfo} />

                {/* QR Code - Mobile */}
                <div className="rounded-xl bg-muted/30 p-2">
                  <p className="mb-3 text-center text-sm text-muted-foreground">
                    Xuất trình mã QR khi lên tàu
                  </p>
                  <div className="mx-auto max-w-[250px] rounded-xl bg-background p-2 shadow-md">
                    <QRCodePlaceholder ticketId={ticketId} />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-xs text-muted-foreground">Mã vé</p>
                    <p className="font-mono text-sm">{ticketId}</p>
                  </div>
                </div>

                <Separator />

                <PassengerList passengers={passengerList} />

                <Separator />

                {/* Total Price - Mobile */}
                <div className="rounded-lg bg-muted/30 p-2 text-center">
                  <p className="text-sm text-muted-foreground">Tổng thanh toán</p>
                  <p className="text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-bold">
                    {formatPrice(grandTotal)}
                  </p>
                </div>

                {/* Barcode - Mobile */}
                <div className="rounded-lg bg-background p-2 border">
                  {generateBarcode()}
                </div>

                {/* Booking Info - Mobile */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ngày đặt vé</p>
                    <p>{bookingDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Giờ đặt vé</p>
                    <p>{bookingTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="gap-2 border-primary bg-background hover:bg-primary/10"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4" />
              Tải vé PDF
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-primary bg-background hover:bg-primary/10"
            >
              <ImageIcon className="h-4 w-4" />
              Lưu QR
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-primary bg-background hover:bg-primary/10"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Lưu vào Wallet</span>
              <span className="sm:hidden">Wallet</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-primary bg-background hover:bg-primary/10"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Chia sẻ
            </Button>
          </div>

          {showCopied && (
            <div className="rounded-lg bg-success/10 p-2 text-center text-sm text-success">
              Đã sao chép mã vé vào clipboard!
            </div>
          )}

          {/* Price Breakdown */}
          <Card className="border-0 shadow-md">
            <div className="p-2">
              <h3 className="mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Chi tiết thanh toán
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {booking.seat?.type === 0 ? "Ghế mềm" : "Ghế cứng"} – Ghế {booking.seat?.seatNumber}
                  </span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                <Separator />

                <div className="flex justify-between pt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Support Information */}
          <Card className="border-0 shadow-md">
            <div className="p-2">
              <h3 className="mb-3">Hỗ trợ & Thông tin</h3>
              <div className="space-y-3">
                {/* Hotline */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm">Hotline hỗ trợ 24/7</p>
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
                    <p className="text-sm">Email hỗ trợ</p>
                    <a
                      href="mailto:hotro@railway.vn"
                      className="text-primary hover:underline"
                    >
                      hotro@railway.vn
                    </a>
                  </div>
                </div>

                <Separator />

                {/* Policies */}
                <div className="space-y-2">
                  <button className="flex w-full items-center justify-between rounded-lg p-2 text-sm hover:bg-card transition-colors">
                    <span>Chính sách hoàn vé</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="flex w-full items-center justify-between rounded-lg p-2 text-sm hover:bg-card transition-colors">
                    <span>Chính sách đổi vé</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="flex w-full items-center justify-between rounded-lg p-2 text-sm hover:bg-card transition-colors">
                    <span>Điều khoản & Điều kiện</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Important Notes */}
          <Card className="border-primary bg-primary/10">
            <div className="p-2">
              <h4 className="mb-3 text-primary">Lưu ý quan trọng</h4>
              <ul className="space-y-2 text-sm text-primary">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Vui lòng có mặt tại ga ít nhất 15 phút trước giờ tàu chạy</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Xuất trình mã QR hoặc mã vé kèm CCCD/Hộ chiếu khi lên tàu</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Vé điện tử có giá trị như vé giấy theo quy định</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Liên hệ hotline ngay nếu cần hỗ trợ hoặc thay đổi</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              variant="outline"
              onClick={handleRateTrip}
              className="flex-1 gap-2 border-warning/30 bg-warning/10 hover:bg-warning/10"
            >
              <Star className="h-5 w-5 text-warning" />
              Đánh giá chuyến đi
            </Button>
            <Button
              size="lg"
              onClick={handleGoHome}
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary/90"
            >
              <Home className="h-5 w-5" />
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
