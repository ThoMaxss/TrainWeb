import { Star } from "lucide-react";

export function FeedbackHeader() {
  return (
    <div className="border-b bg-background shadow-sm">
      <div className="container mx-auto px-2 lg:px-2 py-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600">
              <Star className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Đánh giá chuyến đi</h1>
              <p className="text-sm text-muted-foreground">
                Chia sẻ trải nghiệm của bạn để chúng tôi phục vụ tốt hơn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
