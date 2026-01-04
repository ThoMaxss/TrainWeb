import { CheckCircle, Home, Ticket, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/utils";
import { Smile, Meh, Frown } from "lucide-react";

interface SuccessScreenProps {
  rating: number;
  onGoHome: () => void;
  onViewTickets: () => void;
}

export function SuccessScreen({ rating, onGoHome, onViewTickets }: SuccessScreenProps) {
  const getEmojiForRating = (stars: number) => {
    if (stars <= 2) return { icon: Frown, color: "text-destructive", label: "Không hài lòng" };
    if (stars <= 3) return { icon: Meh, color: "text-warning", label: "Bình thường" };
    return { icon: Smile, color: "text-success", label: "Hài lòng" };
  };

  const emojiRating = rating > 0 ? getEmojiForRating(rating) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 py-16">
        <div className="mx-auto max-w-2xl">
          <Card className="border">
            <div className="flex flex-col items-center justify-center py-16 px-2 text-center">
              {/* Success Icon */}
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-success animate-bounce-once">
                <CheckCircle className="h-12 w-12 text-primary-foreground" />
              </div>

              {/* Thank You Message */}
              <h1 className="mb-3 text-success text-2xl font-bold">
                Cảm ơn bạn đã gửi phản hồi!
              </h1>
              <p className="mb-2 max-w-md text-muted-foreground">
                Ý kiến của bạn rất quan trọng với chúng tôi. Chúng tôi sẽ cải
                thiện dịch vụ để phục vụ bạn tốt hơn.
              </p>

              {/* Rating Display */}
              {rating > 0 && (
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-6 w-6",
                          star <= rating
                            ? "fill-warning text-warning"
                            : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                  {emojiRating && (
                    <>
                      <Separator orientation="vertical" className="h-6" />
                      <emojiRating.icon className={cn("h-6 w-6", emojiRating.color)} />
                      <span className="text-sm text-muted-foreground">
                        {emojiRating.label}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <Button
                  size="lg"
                  onClick={onGoHome}
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                >
                  <Home className="h-5 w-5" />
                  Quay lại trang chủ
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onViewTickets}
                  className="flex-1 gap-2 border-primary hover:bg-primary/10"
                >
                  <Ticket className="h-5 w-5" />
                  Xem vé của tôi
                </Button>
              </div>

              {/* Additional Info */}
              <p className="mt-5 text-xs text-muted-foreground">
                Bạn sẽ nhận được phản hồi từ chúng tôi qua email trong vòng 24 giờ
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Add bounce animation */}
      <style>{`
        @keyframes bounce-once {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(0.9); }
          50% { transform: scale(1.1); }
          75% { transform: scale(0.95); }
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
