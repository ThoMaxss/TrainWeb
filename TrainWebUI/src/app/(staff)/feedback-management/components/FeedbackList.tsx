import { MessageSquare } from "lucide-react"
import { FeedbackCard, type Feedback } from "./FeedbackCard"

interface FeedbackListProps {
  feedbacks: Feedback[]
  searchQuery: string
  filterStatus: string
  onReply: (feedback: Feedback) => void
  onMarkResolved: (feedbackId: string) => void
  onDelete: (feedbackId: string) => void
}

export function FeedbackList({
  feedbacks,
  searchQuery,
  filterStatus,
  onReply,
  onMarkResolved,
  onDelete,
}: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="col-span-2 text-center py-12">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-4">
          <MessageSquare className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Không có phản hồi nào</h3>
        <p className="text-muted-foreground">
          {searchQuery || filterStatus !== "all"
            ? "Thử thay đổi bộ lọc hoặc tìm kiếm"
            : "Chưa có phản hồi từ khách hàng"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {feedbacks.map((feedback) => (
        <FeedbackCard
          key={feedback.id}
          feedback={feedback}
          onReply={onReply}
          onMarkResolved={onMarkResolved}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
