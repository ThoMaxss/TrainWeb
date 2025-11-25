import { MessageSquare, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils/utils"
import type { Feedback } from "./FeedbackCard"

interface ReplyDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedFeedback: Feedback | null
  replyMessage: string
  onReplyMessageChange: (message: string) => void
  onSubmitReply: () => void
}

export function ReplyDialog({
  isOpen,
  onClose,
  selectedFeedback,
  replyMessage,
  onReplyMessageChange,
  onSubmitReply,
}: ReplyDialogProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Trả lời phản hồi
          </DialogTitle>
        </DialogHeader>

        {selectedFeedback && (
          <div className="space-y-4">
            {/* Original Feedback */}
            <div className="bg-muted/50 rounded-lg p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">{renderStars(selectedFeedback.rating)}</div>
              <h4 className="font-semibold text-foreground mb-1">{selectedFeedback.subject}</h4>
              <p className="text-sm text-muted-foreground">{selectedFeedback.message}</p>
            </div>

            {/* Reply Input */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Phản hồi của bạn <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Nhập phản hồi cho khách hàng..."
                value={replyMessage}
                onChange={(e) => onReplyMessageChange(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={onSubmitReply} disabled={!replyMessage.trim()} className="bg-primary hover:bg-primary/90">
            <CheckCircle className="h-4 w-4 mr-2" />
            Gửi phản hồi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
