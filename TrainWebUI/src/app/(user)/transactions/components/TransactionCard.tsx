import { Receipt, Calendar, Clock, Train, CreditCard, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface Transaction {
  id: string
  transactionId: string
  date: string
  time: string
  ticketId: string
  trainNumber: string
  route: string
  amount: number
  paymentMethod: "VISA" | "MasterCard" | "MoMo" | "VNPay"
  status: "success" | "failed" | "pending"
  cardLastDigits?: string
  bookingId: string
}

interface TransactionCardProps {
  transaction: Transaction
  onViewDetail: (transaction: Transaction) => void
  formatPrice: (price: number) => string
  getStatusConfig: (status: Transaction["status"]) => {
    label: string
    icon: React.ElementType
    className: string
  }
  getPaymentMethodInfo: (method: Transaction["paymentMethod"]) => {
    label: string
    color: string
  }
}

export function TransactionCard({
  transaction,
  onViewDetail,
  formatPrice,
  getStatusConfig,
  getPaymentMethodInfo,
}: TransactionCardProps) {
  const statusConfig = getStatusConfig(transaction.status)
  const paymentInfo = getPaymentMethodInfo(transaction.paymentMethod)
  const StatusIcon = statusConfig.icon

  return (
    <Card className="overflow-hidden border transition-all hover:border-primary">
      <div className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left Section */}
          <div className="flex-1 space-y-3">
            {/* Transaction ID & Status */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                <p className="font-mono text-sm">{transaction.transactionId}</p>
              </div>
              <Badge className={statusConfig.className}>
                <StatusIcon
                  className={`mr-1 h-3 w-3 ${transaction.status === "pending" ? "animate-spin" : ""}`}
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
            <div className="rounded-lg bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                <Train className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-mono">{transaction.trainNumber}</span> • {transaction.route}
                  </p>
                  <p className="text-xs text-muted-foreground">Mã vé: {transaction.ticketId}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className={`text-sm ${paymentInfo.color}`}>{paymentInfo.label}</span>
              {transaction.cardLastDigits && (
                <span className="text-sm text-muted-foreground">•••• {transaction.cardLastDigits}</span>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            {/* Amount */}
            <div className="flex-1 text-left sm:text-right">
              <p className="text-xs text-muted-foreground">Số tiền</p>
              <p className="mt-1 text-xl font-bold text-foreground">
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
              <span className="hidden sm:inline">Xem chi tiết</span>
              <span className="sm:hidden">Chi tiết</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
