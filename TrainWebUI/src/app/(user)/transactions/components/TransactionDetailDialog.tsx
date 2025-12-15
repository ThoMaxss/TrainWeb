import { Receipt, CreditCard, Train, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Transaction } from "./TransactionCard"

interface TransactionDetailDialogProps {
  transaction: Transaction | null
  open: boolean
  onClose: () => void
  formatPrice: (price: number) => string
  getStatusConfig: (status: Transaction["status"]) => {
    label: string
    icon: string
    color: string
  }
  getPaymentMethodInfo: (method: Transaction["paymentMethod"]) => {
    label: string
    color: string
  }
}

export function TransactionDetailDialog({
  transaction,
  open,
  onClose,
  formatPrice,
  getStatusConfig,
  getPaymentMethodInfo,
}: TransactionDetailDialogProps) {
  if (!transaction) return null

  const statusConfig = getStatusConfig(transaction.status)
  const paymentInfo = getPaymentMethodInfo(transaction.paymentMethod)
  const StatusIcon = statusConfig.icon

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Chi tiết giao dịch
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Banner */}
          <div
            className={`rounded-lg p-4 ${
              transaction.status === "success"
                ? "bg-success/10"
                : transaction.status === "failed"
                  ? "bg-destructive/10"
                  : "bg-warning/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <StatusIcon
                className={`h-5 w-5 ${
                  transaction.status === "success"
                    ? "text-success"
                    : transaction.status === "failed"
                      ? "text-destructive"
                      : "text-warning animate-spin"
                }`}
              />
              <div>
                <p
                  className={`font-semibold ${
                    transaction.status === "success"
                      ? "text-success"
                      : transaction.status === "failed"
                        ? "text-destructive"
                        : "text-warning"
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
              <Label className="text-muted-foreground">Mã giao dịch</Label>
              <p className="font-mono text-sm">{transaction.transactionId}</p>
            </div>
            <div className="flex justify-between">
              <Label className="text-muted-foreground">Số tiền</Label>
              <p className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {formatPrice(transaction.amount)}
              </p>
            </div>
            <div className="flex justify-between">
              <Label className="text-muted-foreground">Phương thức</Label>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className={paymentInfo.color}>{paymentInfo.label}</span>
                {transaction.cardLastDigits && (
                  <span className="text-sm text-muted-foreground">•••• {transaction.cardLastDigits}</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Linked Ticket */}
          <div>
            <Label className="mb-2 block text-muted-foreground">Vé liên kết</Label>
            <div className="rounded-lg bg-muted/30 p-3">
              <div className="flex items-start gap-2">
                <Train className="mt-0.5 h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-mono">{transaction.trainNumber}</span> • {transaction.route}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Mã vé: {transaction.ticketId}</p>
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
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
