import { Star, User, MessageSquare, CheckCircle, Clock, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils/utils"

export interface Feedback {
  id: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  category: "service" | "train" | "booking" | "other"
  subject: string
  message: string
  status: "pending" | "replied" | "resolved"
  createdAt: string
  repliedAt?: string
  reply?: string
  repliedBy?: string
}

interface FeedbackCardProps {
  feedback: Feedback
  onReply: (feedback: Feedback) => void
  onMarkResolved: (feedbackId: string) => void
  onDelete: (feedbackId: string) => void
}

export function FeedbackCard({ feedback, onReply, onMarkResolved, onDelete }: FeedbackCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn("h-4 w-4", star <= rating ? "fill-warning text-warning" : "text-muted-foreground/30")}
          />
        ))}
      </div>
    )
  }

  const getStatusBadge = (status: Feedback["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/10">
            <Clock className="h-3 w-3 mr-1" />
            Chờ xử lý
          </Badge>
        )
      case "replied":
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            <MessageSquare className="h-3 w-3 mr-1" />
            Đã trả lời
          </Badge>
        )
      case "resolved":
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/10">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã giải quyết
          </Badge>
        )
    }
  }

  const getCategoryLabel = (category: Feedback["category"]) => {
    switch (category) {
      case "service":
        return "Dịch vụ"
      case "train":
        return "Tàu hỏa"
      case "booking":
        return "Đặt vé"
      case "other":
        return "Khác"
    }
  }

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{feedback.userName}</p>
                <p className="text-xs text-muted-foreground">{feedback.userEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {renderStars(feedback.rating)}
              <Badge variant="outline" className="text-xs">
                {getCategoryLabel(feedback.category)}
              </Badge>
            </div>
          </div>
          {getStatusBadge(feedback.status)}
        </div>

        <Separator />

        {/* Content */}
        <div>
          <h4 className="font-semibold text-foreground mb-2">{feedback.subject}</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">{feedback.message}</p>
        </div>

        {/* Reply */}
        {feedback.reply && (
          <div className="bg-muted/50 rounded-lg p-3 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Phản hồi của nhân viên:</p>
            <p className="text-sm text-foreground">{feedback.reply}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(feedback.repliedAt!).toLocaleString("vi-VN")}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">{new Date(feedback.createdAt).toLocaleString("vi-VN")}</p>
          <div className="flex gap-2">
            {feedback.status === "pending" && (
              <Button size="sm" onClick={() => onReply(feedback)} className="bg-primary hover:bg-primary/90">
                <MessageSquare className="h-3 w-3 mr-1" />
                Trả lời
              </Button>
            )}
            {feedback.status === "replied" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMarkResolved(feedback.id)}
                className="border-success text-success hover:bg-success/10"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Đánh dấu hoàn thành
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(feedback.id)}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
