import { Train, Ticket, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onGoHome: () => void
  tab: "upcoming" | "completed" | "cancelled"
}

export function EmptyState({ onGoHome, tab }: EmptyStateProps) {
  const messages = {
    upcoming: {
      title: "Bạn chưa có vé nào sắp tới",
      description: "Hãy tìm chuyến tàu và đặt vé ngay để bắt đầu hành trình!",
      showButton: true,
    },
    completed: {
      title: "Chưa có vé nào đã hoàn thành",
      description: "Các chuyến tàu đã đi sẽ được hiển thị tại đây.",
      showButton: false,
    },
    cancelled: {
      title: "Bạn chưa hủy vé nào",
      description: "Các vé đã hủy sẽ được lưu lại tại đây.",
      showButton: false,
    },
  }

  const message = messages[tab]

  return (
    <Card className="border border-border bg-card shadow-sm">
      <div className="flex flex-col items-center justify-center py-16 px-2 text-center">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Ticket className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mb-2 text-foreground">{message.title}</h3>
        <p className="mb-3 max-w-md text-muted-foreground">{message.description}</p>
        {message.showButton && (
          <Button
            size="lg"
            onClick={onGoHome}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Train className="h-5 w-5" />
            Tìm vé tàu
          </Button>
        )}
      </div>
    </Card>
  )
}

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Card className="border border-border bg-card shadow-sm">
      <div className="flex flex-col items-center justify-center py-16 px-2 text-center">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="mb-2 text-foreground">Không thể tải vé</h3>
        <p className="mb-3 max-w-md text-muted-foreground">{error}</p>
        <Button
          size="lg"
          onClick={onRetry}
          variant="outline"
          className="gap-2"
        >
          Thử lại
        </Button>
      </div>
    </Card>
  )
}
