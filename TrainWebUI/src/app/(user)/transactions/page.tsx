"use client"

import { useState, useEffect, useMemo } from "react"
import { Receipt, Train, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { getBookingsByUserId } from "@/lib/api/booking"
import { BookingStatus } from "@/types"
import { useNavigation } from "@/lib/hooks/useNavigation"
import { TransactionFilters } from "./components/TransactionFilters"
import { TransactionList } from "./components/TransactionList"
import { TransactionDetailDialog } from "./components/TransactionDetailDialog"
import { LoadingState } from "./components/LoadingState"
import { ErrorState, EmptyState } from "./components/States"
import type { Transaction } from "./components/TransactionCard"

export default function TransactionsPage() {
  const { goHome } = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "success" | "failed" | "pending">("all")
  const [timeFilter, setTimeFilter] = useState<"7" | "30" | "custom">("30")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const userId = localStorage.getItem("userId")

      if (!userId) {
        setError("Vui lòng đăng nhập để xem lịch sử giao dịch")
        setIsLoading(false)
        return
      }

      const bookings = await getBookingsByUserId(userId)

      const transformedTransactions: Transaction[] = bookings
        .filter((booking) => booking.status === BookingStatus.Paid)
        .map((booking) => {
          const createdDate = booking.createdAt ? new Date(booking.createdAt) : new Date()

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
          }
        })

      setTransactions(transformedTransactions)
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError("Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesTab = activeTab === "all" || transaction.status === activeTab
    const matchesSearch =
      searchQuery === "" ||
      transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.route.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTime = true
    return matchesTab && matchesSearch && matchesTime
  })

  // Calculate stats
  const stats = {
    all: transactions.length,
    success: transactions.filter((t) => t.status === "success").length,
    failed: transactions.filter((t) => t.status === "failed").length,
    pending: transactions.filter((t) => t.status === "pending").length,
  }

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
    setSelectedTransaction(transaction)
    setShowDetailDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDetailDialog(false)
    setTimeout(() => setSelectedTransaction(null), 300)
  }

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

          {/* Tabs */}
          <Tabs value={activeTab} className="w-full">

            {/* Tab Contents */}
            <TabsContent value="all" className="mt-3 space-y-3">
              {isLoading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={fetchTransactions} />
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
                <ErrorState error={error} onRetry={fetchTransactions} />
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
                <ErrorState error={error} onRetry={fetchTransactions} />
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
                <ErrorState error={error} onRetry={fetchTransactions} />
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
          onClose={handleCloseDialog}
          formatPrice={formatPrice}
          getStatusConfig={getStatusConfig}
          getPaymentMethodInfo={getPaymentMethodInfo}
        />
      )}
    </div>
  )
}


