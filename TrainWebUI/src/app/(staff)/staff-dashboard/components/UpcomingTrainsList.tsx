"use client";

import { Clock, CheckCircle, XCircle, Users, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export interface UpcomingTrain {
  code: string;
  route: string;
  departureTime: string;
  totalTickets: number;
  checkedIn: number;
  cancelled: number;
  status: "on-time" | "delayed" | "cancelled";
  delayMinutes?: number;
}

interface UpcomingTrainsListProps {
  trains: UpcomingTrain[];
  onNavigate: (path: string) => void;
}

const getTrainStatusBadge = (train: UpcomingTrain) => {
  switch (train.status) {
    case "on-time":
      return (
        <Badge className="bg-success/10 text-success border-emerald-200">
          <CheckCircle className="mr-1 h-3 w-3" />
          Đúng giờ
        </Badge>
      );
    case "delayed":
      return (
        <Badge className="bg-warning/10 text-warning border-warning/20">
          <Clock className="mr-1 h-3 w-3" />
          Trễ {train.delayMinutes}p
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-error/10 text-error border-destructive/20">
          <XCircle className="mr-1 h-3 w-3" />
          Đã hủy
        </Badge>
      );
    default:
      return null;
  }
};

export function UpcomingTrainsList({ trains, onNavigate }: UpcomingTrainsListProps) {
  return (
    <Card className="border-0 bg-background shadow-md lg:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Chuyến tàu sắp khởi hành</CardTitle>
          <Button variant="ghost" size="sm" className="gap-2">
            Xem tất cả
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trains.map((train) => (
            <div
              key={train.code}
              className="rounded-lg border-2 border-border p-2 transition-all hover:border-primary hover:bg-primary/10/50 cursor-pointer"
              onClick={() => onNavigate(`/trains/${train.code}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge
                      variant="outline"
                      className="border-primary text-primary font-semibold"
                    >
                      {train.code}
                    </Badge>
                    <span className="font-medium text-lg">{train.route}</span>
                    {getTrainStatusBadge(train)}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {train.departureTime}
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <span>Tổng: {train.totalTickets} vé</span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Tỷ lệ check-in</span>
                  <span className="text-sm font-medium">
                    {Math.round((train.checkedIn / train.totalTickets) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(train.checkedIn / train.totalTickets) * 100} 
                  className="h-2"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex items-center gap-2 rounded-md bg-success/10 px-2 py-1 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-success font-medium">
                    {train.checkedIn} đã check-in
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-card px-2 py-1 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">
                    {train.totalTickets - train.checkedIn - train.cancelled} chưa check-in
                  </span>
                </div>
                {train.cancelled > 0 && (
                  <div className="flex items-center gap-2 rounded-md bg-error/10 px-2 py-1 text-sm">
                    <XCircle className="h-4 w-4 text-error" />
                    <span className="text-error font-medium">
                      {train.cancelled} đã hủy
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
