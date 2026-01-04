// 🎨 Enhanced ticket detail page with unified design system and dark mode
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Train,
  User,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Download,
  Share2,
  Phone,
  Mail,
  Ticket,
  QrCode,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
  Star,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils/utils";
import { BadgeStatus } from "@/components/shared/BadgeStatus";
import { CardSection } from "@/components/shared/CardSection";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageContainer, PageHeader, PageContent } from "@/components/shared/PageLayout";

interface Passenger {
  fullName: string;
  seatNumber: string;
  coachNumber: number;
  ticketType: string;
}

interface TicketDetail {
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
  paymentMethod: string;
  transactionId: string;
  phone: string;
  email: string;
  policies: string[];
}

export default function TicketDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // Simulate API call to fetch ticket details
    const fetchTicketDetails = async () => {
      try {
        // Mock data - in production, this would be an API call
        const mockTicket: TicketDetail = {
          id: id as string,
          ticketId: "VNAB12CD34",
          trainNumber: "SE3",
          trainName: "Tàu Thống Nhất",
          origin: "Hà Nội",
          destination: "Đà Nẵng",
          departureDate: "15/11/2025",
          departureTime: "19:30",
          arrivalTime: "08:05",
          passengers: [
            { 
              fullName: "Nguyễn Văn A", 
              seatNumber: "1A", 
              coachNumber: 1,
              ticketType: "Người lớn"
            },
            { 
              fullName: "Trần Thị B", 
              seatNumber: "1B", 
              coachNumber: 1,
              ticketType: "Người lớn"
            },
          ],
          totalPrice: 1500000,
          status: "upcoming",
          bookingDate: "01/11/2025",
          seatType: "Giường nằm khoang 4",
          paymentMethod: "VISA **** 1234",
          transactionId: "TXN123456789",
          phone: "0912345678",
          email: "user@example.com",
          policies: [
            "Có thể đổi/trả vé trước 24h so với giờ khởi hành",
            "Phí đổi/trả: 20% giá trị vé",
            "Vui lòng có mặt tại ga trước 30 phút",
            "Mang theo CCCD/Hộ chiếu khi lên tàu"
          ]
        };

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTicket(mockTicket);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicketDetails();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "upcoming":
        return {
          label: "Sắp tới",
          status: "upcoming" as const,
          icon: CheckCircle
        };
      case "completed":
        return {
          label: "Hoàn thành",
          status: "completed" as const,
          icon: CheckCircle
        };
      case "cancelled":
        return {
          label: "Đã hủy",
          status: "cancelled" as const,
          icon: X
        };
      default:
        return {
          label: "Không xác định",
          status: "info" as const,
          icon: AlertCircle
        };
    }
  };

  const generateQRCode = () => {
    return (
      <div className="relative aspect-square w-full max-w-[200px] mx-auto">
        <svg viewBox="0 0 200 200" className="h-full w-full border-2 border-border rounded-xl bg-background">
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
          <div className="rounded-full bg-background p-2 border border-border">
            <Train className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In production, this would generate and download a PDF
    console.log("Downloading PDF...");
  };

  const handleShare = async () => {
    if (navigator.share && ticket) {
      try {
        await navigator.share({
          title: `Vé tàu ${ticket.trainNumber}`,
          text: `Chuyến tàu ${ticket.origin} - ${ticket.destination}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleRefundExchange = () => {
    // In production, this would navigate to refund/exchange page
    console.log("Refund/Exchange ticket");
  };

  const handleSubmitFeedback = () => {
    if (rating > 0) {
      // In production, this would submit feedback to API
      console.log("Feedback submitted:", { rating, feedback });
      setShowFeedback(false);
      setRating(0);
      setFeedback("");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-3 dark:border-primary" />
            <p className="text-muted-foreground dark:text-muted-foreground">Đang tải thông tin vé...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!ticket) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <CardSection className="w-full max-w-md mx-3 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-3" />
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              Không tìm thấy vé
            </h2>
            <p className="text-muted-foreground mb-5">
              Vé với ID "{id}" không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => router.push('/my-tickets')} className="w-full">
              Quay lại danh sách vé
            </Button>
          </CardSection>
        </div>
      </PageContainer>
    );
  }

  const statusConfig = getStatusConfig(ticket.status);
  const StatusIcon = statusConfig.icon;

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/my-tickets')}
              className="hover:bg-primary/10 dark:hover:bg-primary/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-primary dark:text-primary-foreground">
                Chi tiết vé
              </h1>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">{ticket.ticketId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Chia sẻ</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Tải PDF</span>
            </Button>
          </div>
        </div>
      </PageHeader>

      {/* Main Content */}
      <PageContent>
        {/* Status Card */}
        <Card className="p-2 border-2 border-primary/50 bg-primary/5 dark:border-primary rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <BadgeStatus 
              status={statusConfig.status}
              label={statusConfig.label}
              icon={StatusIcon}
            />
            <span className="text-sm text-muted-foreground">
              Mã vé: {ticket.ticketId}
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-5">
            {/* Trip Info */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary dark:text-primary-foreground">
                    {ticket.origin}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {ticket.departureTime}
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="h-0.5 bg-primary/30"></div>
                  <Train className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary bg-background rounded-full p-1 border-2 border-primary dark:border-primary/70" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary dark:text-primary-foreground">
                    {ticket.destination}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {ticket.arrivalTime}
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{ticket.departureDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Train className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {ticket.trainNumber} - {ticket.trainName}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {ticket.status === "upcoming" && (
              <div className="flex flex-col items-center justify-center bg-background rounded-xl p-2 border border-border">
                <div className="mb-3">
                  <QrCode className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Mã QR để lên tàu
                  </p>
                </div>
                {generateQRCode()}
              </div>
            )}
          </div>
        </Card>

        {/* Passengers Info */}
        <CardSection title="Thông tin hành khách" icon={User}>
          <div className="space-y-3">
            {ticket.passengers.map((passenger, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-background rounded-xl border border-border">
                <div>
                  <div className="font-medium text-foreground">
                    {passenger.fullName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {passenger.ticketType}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-foreground">
                    Toa {passenger.coachNumber}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ghế {passenger.seatNumber}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardSection>

        {/* Ticket Details */}
        <CardSection title="Thông tin vé" icon={Ticket}>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <InfoRow label="Loại ghế" value={ticket.seatType} />
              <InfoRow label="Ngày đặt" value={ticket.bookingDate} />
              <InfoRow 
                label="Tổng tiền" 
                value={
                  <span className="font-bold text-primary  text-lg">
                    {formatPrice(ticket.totalPrice)}
                  </span>
                } 
              />
            </div>
            <div className="space-y-3">
              <InfoRow label="Thanh toán" value={ticket.paymentMethod} />
              <InfoRow 
                label="Mã giao dịch" 
                value={
                  <span className="font-mono text-sm">{ticket.transactionId}</span>
                } 
              />
            </div>
          </div>
        </CardSection>

        {/* Contact Info */}
        <CardSection title="Thông tin liên hệ" icon={Mail}>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{ticket.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{ticket.email}</span>
            </div>
          </div>
        </CardSection>

        {/* Policies */}
        <CardSection title="Chính sách và lưu ý" icon={AlertCircle}>
          <ul className="space-y-3">
            {ticket.policies.map((policy, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span className="text-foreground">{policy}</span>
              </li>
            ))}
          </ul>
        </CardSection>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={handlePrint}
            className="gap-2 bg-primary hover:bg-hover-primary dark:bg-primary dark:hover:bg-hover-primary transition-colors"
          >
            <Download className="h-4 w-4" />
            In vé
          </Button>
          
          {ticket.status === "upcoming" && (
            <Button
              variant="outline"
              onClick={handleRefundExchange}
              className="gap-2 border-warning text-warning hover:bg-warning/10 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Đổi/Hoàn vé
            </Button>
          )}

          {ticket.status === "completed" && (
            <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 border-success text-success hover:bg-success/10 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  Đánh giá
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Đánh giá chuyến đi</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-3 block text-foreground">
                      Đánh giá của bạn:
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={cn(
                            "p-1 rounded transition-colors",
                            star <= rating ? "text-warning" : "text-muted-foreground"
                          )}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block text-foreground">
                      Nhận xét (tùy chọn):
                    </label>
                    <Textarea
                      placeholder="Chia sẻ trải nghiệm của bạn..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="bg-input border-input text-foreground"
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowFeedback(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSubmitFeedback}
                      disabled={rating === 0}
                    >
                      Gửi đánh giá
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </PageContent>
    </PageContainer>
  );
}
