"use client";

import { Star, MessageSquare, ChevronRight } from "lucide-react";
import { BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  passengerName: string;
  date: string;
  trainCode: string;
  category: "service" | "comfort" | "punctuality" | "cleanliness";
}

interface CustomerFeedbackProps {
  feedbackList: Feedback[];
  onNavigate: (path: string) => void;
}

const getFeedbackCategoryColor = (category: Feedback["category"]) => {
  switch (category) {
    case "service":
      return "bg-primary/10 text-primary border-primary";
    case "comfort":
      return "bg-success/10 text-success border-success/20";
    case "punctuality":
      return "bg-warning/10 text-warning border-warning/20";
    case "cleanliness":
      return "bg-secondary/10 text-secondary border-secondary/20";
    default:
      return "bg-card text-foreground border-border";
  }
};

export function CustomerFeedback({ feedbackList, onNavigate }: CustomerFeedbackProps) {
  return (
    <Card className="mt-3 border-0 bg-background shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Đánh giá của khách hàng</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Phản hồi mới nhất từ hành khách
            </p>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            Xem tất cả
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {feedbackList.map((feedback) => (
            <div
              key={feedback.id}
              className="rounded-lg border-2 border-border p-4 transition-all hover:border-warning/30 hover:bg-warning/10 cursor-pointer"
              onClick={() => onNavigate(`/feedback/${feedback.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < feedback.rating
                          ? "fill-warning text-warning"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <Badge 
                  variant="outline"
                  className={getFeedbackCategoryColor(feedback.category)}
                >
                  {feedback.category}
                </Badge>
              </div>
              
              <p className="text-sm text-foreground line-clamp-3 mb-3 leading-relaxed">
                "{feedback.comment}"
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{feedback.passengerName}</p>
                  <p className="text-xs text-muted-foreground">{feedback.trainCode}</p>
                </div>
                <span className="text-xs text-muted-foreground">{feedback.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={() => onNavigate("/feedback")}
          >
            <MessageSquare className="h-4 w-4" />
            Quản lý phản hồi
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={() => onNavigate("/reports/feedback")}
          >
            <BarChart className="h-4 w-4" />
            Báo cáo đánh giá
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
