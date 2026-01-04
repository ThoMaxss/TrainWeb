"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { getCurrentUserId } from "@/lib/utils/auth"
import { Receipt, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getBookingsByUserId } from "@/lib/api/booking";
import { BookingStatus } from "@/types";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionList } from "./components/TransactionList";
import { TransactionDetailDialog } from "./components/TransactionDetailDialog";
import type { Transaction } from "./components/TransactionCard";

const CACHE_KEY = "transactions_cache";
const CACHE_DURATION = 60 * 1000; // 60s cache to limit refetch

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "success" | "failed" | "pending">("all");
  const [timeFilter, setTimeFilter] = useState<"7" | "30" | "custom">("30");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions with caching
  const fetchTransactions = useCallback(async () => {
    const controller = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      const userId = getCurrentUserId();
      if (!userId) {
        setError("Vui lòng đăng nhập để xem lịch sử giao dịch");
        setIsLoading(false);
        return;
      }

      // Check cache
      const cached = sessionStorage.getItem(`${CACHE_KEY}_${userId}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setTransactions(data);
          setIsLoading(false);
          return;
        }
      }

      const bookings = await getBookingsByUserId(userId);
      const transformedTransactions: Transaction[] = bookings
        .filter((booking) => booking.status === BookingStatus.Paid)
        .map((booking) => {
          const createdDate = booking.createdAt ? new Date(booking.createdAt) : new Date();
          return {
            id: booking.id || "",
            transactionId: `TXN${booking.id?.substring(0, 8).toUpperCase()}`,
            date: createdDate.toLocaleDateString("vi-VN"),
            time: createdDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            ticketId: booking.id || "N/A",
            trainNumber: booking.trip?.train?.name || "N/A",
            route: `${booking.trip?.originStation || "N/A"} - ${booking.trip?.destinationStation || "N/A"}`,
            amount: booking.seat?.price || 0,
            paymentMethod: "MoMo" as const,
            status: "success" as const,
            bookingId: booking.id || "",
          };
        });

      setTransactions(transformedTransactions);
      
      // Cache result
      sessionStorage.setItem(
        `${CACHE_KEY}_${userId}`,
        JSON.stringify({ data: transformedTransactions, timestamp: Date.now() })
      );
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Error fetching transactions:", err);
        setError("Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Memoized filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesTab = activeTab === "all" || transaction.status === activeTab;
      const matchesSearch =
        searchQuery === "" ||
        transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.route.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [transactions, activeTab, searchQuery]);

  // Memoized stats
  const stats = useMemo(
    () => ({
      all: transactions.length,
      success: transactions.filter((t) => t.status === "success").length,
      failed: transactions.filter((t) => t.status === "failed").length,
      pending: transactions.filter((t) => t.status === "pending").length,
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    }),
    [transactions]
  );

  const handleViewDetail = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailDialog(true);
  }, []);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  }, []);

  const getStatusConfig = useCallback((status: Transaction["status"]) => {
    const labelMap = {
      success: "Thành công",
      failed: "Thất bại",
      pending: "Đang xử lý",
    } as const;
    const iconMap = {
      success: CheckCircle,
      failed: AlertCircle,
      pending: Clock,
    } as const;
    const badgeClassMap = {
      success: "bg-success/10 text-success border-transparent",
      failed: "bg-destructive/10 text-destructive border-transparent",
      pending: "bg-warning/10 text-warning border-transparent",
    } as const;
    return {
      label: labelMap[status],
      icon: iconMap[status],
      className: badgeClassMap[status],
    };
  }, []);

  const getPaymentMethodInfo = useCallback((method: Transaction["paymentMethod"]) => {
    const colorMap: Record<string, string> = {
      MoMo: "var(--color-momo)",
      VNPay: "var(--color-info)",
      VISA: "var(--color-primary)",
      MasterCard: "var(--color-destructive)",
    };
    return {
      label: method,
      color: colorMap[method] || "var(--color-muted-foreground)",
    };
  }, []);

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Đang tải giao dịch..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-6 text-center border">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={fetchTransactions}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Thử lại
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Stats */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Lịch sử giao dịch</h1>
              <p className="text-muted-foreground">Quản lý và theo dõi các giao dịch của bạn</p>
            </div>
            <Receipt className="w-12 h-12 text-primary opacity-50" />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tổng giao dịch</p>
                  <p className="text-2xl font-bold">{stats.all}</p>
                </div>
                <Receipt className="w-8 h-8 text-primary opacity-50" />
              </div>
            </Card>

            <Card className="p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Thất bại</p>
                  <p className="text-2xl font-bold" style={{ color: "var(--color-success)" }}>{stats.success}</p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--color-success), transparent 85%)" }}>
                  <span className="text-xl" style={{ color: "var(--color-success)" }}>✓</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Đang xử lý</p>
                  <p className="text-2xl font-bold" style={{ color: "var(--color-warning)" }}>{stats.pending}</p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--color-warning), transparent 85%)" }}>
                  <span className="text-xl" style={{ color: "var(--color-warning)" }}>⏱</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border bg-primary text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80 mb-1">Tổng chi tiêu</p>
                  <p className="text-xl font-bold">{formatPrice(stats.totalAmount)}</p>
                </div>
                <DollarSign className="w-8 h-8 opacity-70" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-6">
          {/* Filters */}
          <TransactionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
            stats={stats}
          />

          {/* Transaction List */}
          {filteredTransactions.length === 0 ? (
            <Card className="w-full p-12 text-center rounded-2xl border">
              <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Không có giao dịch</h3>
              <p className="text-muted-foreground mb-6">
                Chưa có giao dịch nào trong thời gian này
              </p>
            </Card>
          ) : (
            <TransactionList
              transactions={filteredTransactions}
              onViewDetail={handleViewDetail}
              formatPrice={formatPrice}
              getStatusConfig={getStatusConfig}
              getPaymentMethodInfo={getPaymentMethodInfo}
            />
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      {selectedTransaction && (
        <TransactionDetailDialog
          transaction={selectedTransaction}
          open={showDetailDialog}
          onClose={() => setShowDetailDialog(false)}
          formatPrice={formatPrice}
          getStatusConfig={getStatusConfig}
          getPaymentMethodInfo={getPaymentMethodInfo}
        />
      )}
    </div>
  );
}


