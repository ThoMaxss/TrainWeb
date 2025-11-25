import { XCircle, RefreshCw, Home } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Đã xảy ra lỗi</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
        <Button onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </Button>
      </div>
    </Card>
  )
}

interface EmptyStateProps {
  onGoHome: () => void
}

export function EmptyState({ onGoHome }: EmptyStateProps) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Home className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Chưa có giao dịch nào</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Bạn chưa có giao dịch nào. Hãy đặt vé để bắt đầu hành trình!
        </p>
        <Button onClick={onGoHome} className="gap-2">
          <Home className="h-4 w-4" />
          Về trang chủ
        </Button>
      </div>
    </Card>
  )
}
