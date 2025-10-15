"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  CreditCard,
  ChevronRight,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  Train,
  Receipt,
  ArrowUpDown,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getBookingsByUserId } from "@/lib/api/booking";
import { BookingDto, PaymentEntity } from "@/types";
import { useNavigation } from "@/lib/hooks/useNavigation";

interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  time: string;
  ticketId: string;
  trainNumber: string;
  route: string;
  amount: number;
  paymentMethod: "VISA" | "MasterCard" | "MoMo" | "VNPay";
  status: "success" | "failed" | "pending";
  cardLastDigits?: string;
  bookingId: string;
}

export default function TransactionsPage() {
  const { goHome } = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "success" | "failed" | "pending"
  >("all");
  const [timeFilter, setTimeFilter] = useState<
    "7" | "30" | "custom"
  >("30");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showDetailDialog, setShowDetailDialog] =
    useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get user ID from localStorage or session
        const userId = localStorage.getItem("userId");
        
        if (!userId) {
          setError("Vui lòng đăng nhập để xem lịch sử giao dịch");
          setIsLoading(false);
          return;
        }

        // Fetch bookings for the user
        const bookings = await getBookingsByUserId(userId);
        
        // Transform bookings to transactions
        const transformedTransactions: Transaction[] = bookings
          .filter(booking => booking.status === 'Paid') // Only show paid bookings
          .map((booking) => {
            const createdDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
            
            return {
              id: booking.id || '',
              transactionId: `TXN${booking.id?.substring(0, 8).toUpperCase()}`,
              date: createdDate.toLocaleDateString('vi-VN'),
              time: createdDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              ticketId: booking.id || 'N/A',
              trainNumber: booking.trip?.train?.name || 'N/A',
              route: `${booking.trip?.departureStation || 'N/A'} - ${booking.trip?.arrivalStation || 'N/A'}`,
              amount: booking.seats?.[0]?.price || booking.totalAmount || 0,
              paymentMethod: "MoMo" as const, // Default, would need payment info from backend
              status: "success" as const,
              bookingId: booking.id || '',
            };
          });

        setTransactions(transformedTransactions);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter(
    (transaction) => {
      // Tab filter
      const matchesTab =
        activeTab === "all" || transaction.status === activeTab;

      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        transaction.transactionId
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.ticketId
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.route
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Time filter (simplified)
      // In production, you would filter by actual date range
      const matchesTime = true;

      return matchesTab && matchesSearch && matchesTime;
    },
  );

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // Get status config
  const getStatusConfig = (status: Transaction["status"]) => {
    switch (status) {
      case "success":
        return {
          label: "Thành công",
          icon: CheckCircle2,
          className:
            "bg-success/10 text-success hover:bg-success/10",
        };
      case "failed":
        return {
          label: "Thất bại",
          icon: XCircle,
          className: "bg-error/10 text-error hover:bg-error/10",
        };
      case "pending":
        return {
          label: "Đang xử lý",
          icon: Loader2,
          className:
            "bg-orange-100 text-orange-700 hover:bg-orange-100",
        };
    }
  };

  // Get payment method icon/label
  const getPaymentMethodInfo = (
    method: Transaction["paymentMethod"],
  ) => {
    switch (method) {
      case "VISA":
        return { label: "VISA", color: "text-primary" };
      case "MasterCard":
        return {
          label: "MasterCard",
          color: "text-orange-600",
        };
      case "MoMo":
        return { label: "MoMo", color: "text-pink-600" };
      case "VNPay":
        return { label: "VNPay", color: "text-primary" };
    }
  };

  // Handle view detail
  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="border-b bg-background shadow-sm">
        <div className="container mx-auto px-2 lg:px-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <Receipt className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-primary">
                  Giao dịch của tôi
                </h1>
                <p className="text-sm text-muted-foreground">
                  Lịch sử thanh toán và hóa đơn
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={goHome}
              className="gap-2 border-primary hover:bg-primary/10"
            >
              <Train className="h-4 w-4" />
              <span className="hidden sm:inline">
                Về trang chủ
              </span>
              <span className="sm:hidden">Trang chủ</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 lg:px-2 py-5">
        <div className="mx-auto max-w-5xl space-y-3">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as typeof activeTab)
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-background">
              <TabsTrigger value="all" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">Tất cả</span>
                <span className="sm:hidden">Tất cả</span>
              </TabsTrigger>
              <TabsTrigger value="success" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">
                  Thành công
                </span>
                <span className="sm:hidden">T.công</span>
              </TabsTrigger>
              <TabsTrigger value="failed" className="gap-2">
                <XCircle className="h-4 w-4" />
                <span className="hidden sm:inline">
                  Thất bại
                </span>
                <span className="sm:hidden">T.bại</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                <Loader2 className="h-4 w-4" />
                <span className="hidden sm:inline">
                  Đang xử lý
                </span>
                <span className="sm:hidden">Xử lý</span>
              </TabsTrigger>
            </TabsList>

            {/* Filters Row */}
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Nhập mã giao dịch hoặc mã vé"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="h-11 border-primary bg-background pl-11 shadow-sm focus:border-primary focus:ring-blue-400"
                />
              </div>

              {/* Time Filter */}
              <div className="flex items-center gap-2 rounded-lg border border-primary bg-background p-1 shadow-sm">
                <Button
                  variant={
                    timeFilter === "7" ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => setTimeFilter("7")}
                  className={
                    timeFilter === "7"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700"
                      : ""
                  }
                >
                  7 ngày
                </Button>
                <Button
                  variant={
                    timeFilter === "30" ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => setTimeFilter("30")}
                  className={
                    timeFilter === "30"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700"
                      : ""
                  }
                >
                  30 ngày
                </Button>
                <Button
                  variant={
                    timeFilter === "custom"
                      ? "default"
                      : "ghost"
                  }
                  size="sm"
                  onClick={() => setTimeFilter("custom")}
                  className={
                    timeFilter === "custom"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700"
                      : ""
                  }
                >
                  Tùy chỉnh
                </Button>
              </div>
            </div>

            {/* Tab Contents */}
            <TabsContent value="all" className="mt-3 space-y-3">
              {isLoading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={() => window.location.reload()} />
              ) : filteredTransactions.length === 0 ? (
                <EmptyState onGoHome={goHome} />
              ) : (
                <TransactionList
                  transactions={filteredTransactions}
                  onViewDetail={handleViewDetail}
                  formatPrice={formatPrice}
                  getStatusConfig={getStatusConfig}
                  getPaymentMethodInfo={getPaymentMethodInfo}
                />
              )}
            </TabsContent>

            <TabsContent
              value="success"
              className="mt-3 space-y-3"
            >
              {isLoading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={() => window.location.reload()} />
              ) : filteredTransactions.length === 0 ? (
                <EmptyState onGoHome={goHome} />
              ) : (
                <TransactionList
                  transactions={filteredTransactions}
                  onViewDetail={handleViewDetail}
                  formatPrice={formatPrice}
                  getStatusConfig={getStatusConfig}
                  getPaymentMethodInfo={getPaymentMethodInfo}
                />
              )}
            </TabsContent>

            <TabsContent
              value="failed"
              className="mt-3 space-y-3"
            >
              {isLoading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={() => window.location.reload()} />
              ) : filteredTransactions.length === 0 ? (
                <EmptyState onGoHome={goHome} />
              ) : (
                <TransactionList
                  transactions={filteredTransactions}
                  onViewDetail={handleViewDetail}
                  formatPrice={formatPrice}
                  getStatusConfig={getStatusConfig}
                  getPaymentMethodInfo={getPaymentMethodInfo}
                />
              )}
            </TabsContent>

            <TabsContent
              value="pending"
              className="mt-3 space-y-3"
            >
              {isLoading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={() => window.location.reload()} />
              ) : filteredTransactions.length === 0 ? (
                <EmptyState onGoHome={goHome} />
              ) : (
                <TransactionList
                  transactions={filteredTransactions}
                  onViewDetail={handleViewDetail}
                  formatPrice={formatPrice}
                  getStatusConfig={getStatusConfig}
                  getPaymentMethodInfo={getPaymentMethodInfo}
                />
              )}
            </TabsContent>
          </Tabs>

          {/* Summary Card */}
          <Card className="border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-primary-foreground shadow-lg">
            <div className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-foreground">
                    Tổng chi tiêu (30 ngày)
                  </p>
                  <p className="mt-1 text-3xl">
                    {formatPrice(
                      transactions
                        .filter((t: Transaction) => t.status === "success")
                        .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
                    )}
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/20">
                  <Receipt className="h-8 w-8" />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 border-t border-white/20 pt-3">
                <div>
                  <p className="text-xs text-primary-foreground">
                    Thành công
                  </p>
                  <p className="mt-1">
                    {
                      transactions.filter(
                        (t: Transaction) => t.status === "success",
                      ).length
                    }
                  </p>
                </div>
                <div>
                  <p className="text-xs text-primary-foreground">
                    Đang xử lý
                  </p>
                  <p className="mt-1">
                    {
                      transactions.filter(
                        (t: Transaction) => t.status === "pending",
                      ).length
                    }
                  </p>
                </div>
                <div>
                  <p className="text-xs text-primary-foreground">
                    Thất bại
                  </p>
                  <p className="mt-1">
                    {
                      transactions.filter(
                        (t: Transaction) => t.status === "failed",
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Transaction Detail Dialog */}
      {selectedTransaction && (
        <TransactionDetailDialog
          transaction={selectedTransaction}
          open={showDetailDialog}
          onClose={() => {
            setShowDetailDialog(false);
            setSelectedTransaction(null);
          }}
          formatPrice={formatPrice}
          getStatusConfig={getStatusConfig}
          getPaymentMethodInfo={getPaymentMethodInfo}
        />
      )}
    </div>
  );
}

// Transaction List Component
interface TransactionListProps {
  transactions: Transaction[];
  onViewDetail: (transaction: Transaction) => void;
  formatPrice: (price: number) => string;
  getStatusConfig: (status: Transaction["status"]) => {
    label: string;
    icon: any;
    className: string;
  };
  getPaymentMethodInfo: (
    method: Transaction["paymentMethod"],
  ) => {
    label: string;
    color: string;
  };
}

function TransactionList({
  transactions,
  onViewDetail,
  formatPrice,
  getStatusConfig,
  getPaymentMethodInfo,
}: TransactionListProps) {
  return (
    <div className="space-y-3">
      {transactions.map((transaction) => {
        const statusConfig = getStatusConfig(
          transaction.status,
        );
        const paymentInfo = getPaymentMethodInfo(
          transaction.paymentMethod,
        );
        const StatusIcon = statusConfig.icon;

        return (
          <Card
            key={transaction.id}
            className="overflow-hidden border-0 shadow-md transition-all hover:shadow-lg"
          >
            <div className="p-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left Section */}
                <div className="flex-1 space-y-3">
                  {/* Transaction ID & Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-primary" />
                      <p className="font-mono text-sm">
                        {transaction.transactionId}
                      </p>
                    </div>
                    <Badge className={statusConfig.className}>
                      <StatusIcon
                        className={`mr-1 h-3 w-3 ${
                          transaction.status === "pending"
                            ? "animate-spin"
                            : ""
                        }`}
                      />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Date & Time */}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {transaction.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {transaction.time}
                    </div>
                  </div>

                  {/* Train Info */}
                  <div className="rounded-lg bg-card p-2">
                    <div className="flex items-center gap-2">
                      <Train className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-mono">
                            {transaction.trainNumber}
                          </span>{" "}
                          • {transaction.route}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Mã vé: {transaction.ticketId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span
                      className={`text-sm ${paymentInfo.color}`}
                    >
                      {paymentInfo.label}
                    </span>
                    {transaction.cardLastDigits && (
                      <span className="text-sm text-muted-foreground">
                        •••• {transaction.cardLastDigits}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  {/* Amount */}
                  <div className="flex-1 text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">
                      Số tiền
                    </p>
                    <p className="mt-1 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      {formatPrice(transaction.amount)}
                    </p>
                  </div>

                  {/* View Detail Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetail(transaction)}
                    className="gap-1 border-primary hover:bg-primary/10"
                  >
                    <span className="hidden sm:inline">
                      Xem chi tiết
                    </span>
                    <span className="sm:hidden">Chi tiết</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// Transaction Detail Dialog
interface TransactionDetailDialogProps {
  transaction: Transaction;
  open: boolean;
  onClose: () => void;
  formatPrice: (price: number) => string;
  getStatusConfig: (status: Transaction["status"]) => {
    label: string;
    icon: any;
    className: string;
  };
  getPaymentMethodInfo: (
    method: Transaction["paymentMethod"],
  ) => {
    label: string;
    color: string;
  };
}

function TransactionDetailDialog({
  transaction,
  open,
  onClose,
  formatPrice,
  getStatusConfig,
  getPaymentMethodInfo,
}: TransactionDetailDialogProps) {
  const statusConfig = getStatusConfig(transaction.status);
  const paymentInfo = getPaymentMethodInfo(
    transaction.paymentMethod,
  );
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Chi tiết giao dịch
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Status Banner */}
          <div
            className={`rounded-lg p-2 ${
              transaction.status === "success"
                ? "bg-success/10"
                : transaction.status === "failed"
                  ? "bg-error/10"
                  : "bg-orange-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <StatusIcon
                className={`h-5 w-5 ${
                  transaction.status === "success"
                    ? "text-success"
                    : transaction.status === "failed"
                      ? "text-error"
                      : "text-orange-600 animate-spin"
                }`}
              />
              <div>
                <p
                  className={`${
                    transaction.status === "success"
                      ? "text-emerald-900"
                      : transaction.status === "failed"
                        ? "text-destructive"
                        : "text-orange-900"
                  }`}
                >
                  {statusConfig.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.date} lúc {transaction.time}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Transaction Info */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-muted-foreground">
                Mã giao dịch
              </Label>
              <p className="font-mono text-sm">
                {transaction.transactionId}
              </p>
            </div>
            <div className="flex justify-between">
              <Label className="text-muted-foreground">
                Số tiền
              </Label>
              <p className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {formatPrice(transaction.amount)}
              </p>
            </div>
            <div className="flex justify-between">
              <Label className="text-muted-foreground">
                Phương thức
              </Label>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className={paymentInfo.color}>
                  {paymentInfo.label}
                </span>
                {transaction.cardLastDigits && (
                  <span className="text-sm text-muted-foreground">
                    •••• {transaction.cardLastDigits}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Linked Ticket */}
          <div>
            <Label className="mb-2 block text-muted-foreground">
              Vé liên kết
            </Label>
            <div className="rounded-lg bg-card p-2">
              <div className="flex items-start gap-2">
                <Train className="mt-0.5 h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-mono">
                      {transaction.trainNumber}
                    </span>{" "}
                    • {transaction.route}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Mã vé: {transaction.ticketId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 gap-2 border-primary hover:bg-primary/10"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4" />
              Tải hóa đơn
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="flex flex-col items-center justify-center py-16 px-2 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
        <h3 className="mb-2 text-foreground">
          Đang tải lịch sử giao dịch...
        </h3>
        <p className="text-muted-foreground">
          Vui lòng đợi trong giây lát
        </p>
      </div>
    </Card>
  );
}

// Error State Component
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="flex flex-col items-center justify-center py-16 px-2 text-center">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-error/10">
          <XCircle className="h-10 w-10 text-error" />
        </div>
        <h3 className="mb-2 text-foreground">
          Có lỗi xảy ra
        </h3>
        <p className="mb-3 max-w-md text-muted-foreground">
          {error}
        </p>
        <Button
          size="lg"
          onClick={onRetry}
          className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          Thử lại
        </Button>
      </div>
    </Card>
  );
}

// Empty State Component
function EmptyState({ onGoHome }: { onGoHome: () => void }) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="flex flex-col items-center justify-center py-16 px-2 text-center">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
          <Receipt className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mb-2 text-foreground">
          Bạn chưa có giao dịch nào
        </h3>
        <p className="mb-3 max-w-md text-muted-foreground">
          Lịch sử giao dịch của bạn sẽ được hiển thị tại đây sau
          khi bạn đặt vé.
        </p>
        <Button
          size="lg"
          onClick={onGoHome}
          className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Train className="h-5 w-5" />
          Tìm chuyến tàu
        </Button>
      </div>
    </Card>
  );
}
