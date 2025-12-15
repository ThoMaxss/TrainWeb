import { TransactionCard, type Transaction } from "./TransactionCard"

interface TransactionListProps {
  transactions: Transaction[]
  onViewDetail: (transaction: Transaction) => void
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

export function TransactionList({
  transactions,
  onViewDetail,
  formatPrice,
  getStatusConfig,
  getPaymentMethodInfo,
}: TransactionListProps) {
  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onViewDetail={onViewDetail}
          formatPrice={formatPrice}
          getStatusConfig={getStatusConfig}
          getPaymentMethodInfo={getPaymentMethodInfo}
        />
      ))}
    </div>
  )
}
