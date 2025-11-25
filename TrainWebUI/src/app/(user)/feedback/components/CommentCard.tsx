import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CommentCardProps {
  comment: string;
  onCommentChange: (comment: string) => void;
}

export function CommentCard({ comment, onCommentChange }: CommentCardProps) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="p-2">
        <Label htmlFor="comment" className="mb-2 block text-lg font-semibold text-foreground">
          Nhập ý kiến của bạn{" "}
          <span className="text-muted-foreground font-normal">(tùy chọn)</span>
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Hãy chia sẻ điều bạn hài lòng hoặc muốn cải thiện…"
          className="min-h-[120px] resize-none"
          maxLength={500}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Tối đa 500 ký tự</span>
          <span>{comment.length}/500</span>
        </div>
      </div>
    </Card>
  );
}
