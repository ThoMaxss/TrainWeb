import { useState } from "react";
import { Star, Smile, Meh, Frown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/utils";

interface RatingCardProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export function RatingCard({ rating, onRatingChange }: RatingCardProps) {
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const getEmojiForRating = (stars: number) => {
    if (stars <= 2) return { icon: Frown, color: "text-destructive", label: "Không hài lòng" };
    if (stars <= 3) return { icon: Meh, color: "text-warning", label: "Bình thường" };
    return { icon: Smile, color: "text-success", label: "Hài lòng" };
  };

  const emojiRating = rating > 0 ? getEmojiForRating(rating) : null;

  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="p-2">
        <Label className="mb-3 block text-lg font-semibold text-foreground">
          Bạn đánh giá chuyến đi này thế nào?
        </Label>

        {/* Star Rating */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="group transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={cn(
                    "h-10 w-10 transition-colors sm:h-12 sm:w-12",
                    star <= (hoveredRating || rating)
                      ? "fill-warning text-warning"
                      : "text-muted-foreground group-hover:text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>

          {/* Rating Label with Emoji */}
          {rating > 0 && (
            <div className="flex items-center gap-2 animate-fade-in">
              {emojiRating && (
                <>
                  <emojiRating.icon className={cn("h-8 w-8", emojiRating.color)} />
                  <p className="text-lg text-muted-foreground">
                    {emojiRating.label}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
