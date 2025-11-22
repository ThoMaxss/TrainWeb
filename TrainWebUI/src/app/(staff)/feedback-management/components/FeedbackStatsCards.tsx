import { MessageSquare, Clock, CheckCircle, Star } from "lucide-react"
import { Card } from "@/components/ui/card"

interface FeedbackStatsCardsProps {
  stats: {
    total: number
    pending: number
    replied: number
    resolved: number
    avgRating: number
  }
}

export function FeedbackStatsCards({ stats }: FeedbackStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4 border-0 bg-gradient-to-br from-primary/5 to-primary/10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <MessageSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tổng số</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-0 bg-gradient-to-br from-warning/5 to-accent/10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning">
            <Clock className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Chờ xử lý</p>
            <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-0 bg-gradient-to-br from-success/5 to-success/10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success">
            <CheckCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Đã xử lý</p>
            <p className="text-2xl font-bold text-foreground">{stats.replied + stats.resolved}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-0 bg-gradient-to-br from-warning/5 to-warning/10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning">
            <Star className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Đánh giá TB</p>
            <p className="text-2xl font-bold text-foreground">{stats.avgRating.toFixed(1)}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
