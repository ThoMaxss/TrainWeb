"use client";

import { Ticket, DollarSign, Train, Clock, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KPIData {
  todayTickets: number;
  todayRevenue: number;
  upcomingTrains: number;
  newFeedback: number;
  activeIssues: number;
  completionRate: number;
  ticketsChange: number;
  revenueChange: number;
  trainsChange: number;
  feedbackChange: number;
}

interface KPICardsProps {
  data: KPIData;
  onNavigate: (path: string) => void;
}

export function KPICards({ data, onNavigate }: KPICardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Today's Tickets */}
      <Card 
        className="border bg-primary text-primary-foreground cursor-pointer hover:border-primary-foreground"
        onClick={() => onNavigate("/manage-tickets")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Vé hôm nay</p>
              <h2 className="mt-2 text-3xl font-bold">
                {data.todayTickets.toLocaleString()}
              </h2>
              <div className="mt-2 flex items-center gap-1 text-sm opacity-80">
                {data.ticketsChange > 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{Math.abs(data.ticketsChange)}% so với hôm qua</span>
              </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/20">
              <Ticket className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Revenue */}
      <Card 
        className="border bg-success text-primary-foreground cursor-pointer hover:border-primary-foreground"
        onClick={() => onNavigate("/reports/revenue")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Doanh thu hôm nay</p>
              <h2 className="mt-2 text-3xl font-bold">
                {(data.todayRevenue / 1000000).toFixed(1)}M
              </h2>
              <div className="mt-2 flex items-center gap-1 text-sm opacity-80">
                {data.revenueChange > 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{Math.abs(data.revenueChange)}% so với hôm qua</span>
              </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/20">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Trains */}
      <Card className="border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tàu sắp khởi hành</p>
              <h2 className="mt-2 text-3xl font-bold">{data.upcomingTrains}</h2>
              <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Trong 24 giờ tới</span>
              </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Train className="h-8 w-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Score */}
      <Card className="border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hiệu suất hoàn thành</p>
              <h2 className="mt-2 text-3xl font-bold">{data.completionRate}%</h2>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2"
                  style={{ width: `${data.completionRate}%` }}
                ></div>
              </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
