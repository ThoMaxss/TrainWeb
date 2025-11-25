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
        className="border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
        onClick={() => onNavigate("/manage-tickets")}
      >
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-foreground">Vé hôm nay</p>
              <h2 className="mt-2 text-3xl font-bold text-primary-foreground">
                {data.todayTickets.toLocaleString()}
              </h2>
              <div className="mt-2 flex items-center gap-1 text-sm text-primary-foreground">
                {data.ticketsChange > 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{Math.abs(data.ticketsChange)}% so với hôm qua</span>
              </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/20 backdrop-blur-sm">
              <Ticket className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Revenue */}
      <Card 
        className="border-0 bg-gradient-to-br from-success to-success/80 text-primary-foreground shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
        onClick={() => onNavigate("/reports/revenue")}
      >
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success/70">Doanh thu hôm nay</p>
              <h2 className="mt-2 text-3xl font-bold text-primary-foreground">
                {(data.todayRevenue / 1000000).toFixed(1)}M
              </h2>
              <div className="mt-2 flex items-center gap-1 text-sm text-success/70">
                {data.revenueChange > 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{Math.abs(data.revenueChange)}% so với hôm qua</span>
              </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/20 backdrop-blur-sm">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Trains */}
      <Card className="border-0 bg-gradient-to-br from-accent to-accent/60 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent/10">Tàu sắp khởi hành</p>
              <h2 className="mt-2 text-3xl font-bold text-primary-foreground">{data.upcomingTrains}</h2>
              <div className="mt-2 flex items-center gap-1 text-sm text-accent/10">
                <Clock className="h-4 w-4" />
                <span>Trong 24 giờ tới</span>
              </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/20 backdrop-blur-sm">
              <Train className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Score */}
      <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-primary-foreground shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary/10">Hiệu suất hoàn thành</p>
              <h2 className="mt-2 text-3xl font-bold text-primary-foreground">{data.completionRate}%</h2>
              <div className="mt-2 w-full bg-background/20 rounded-full h-2">
                <div 
                  className="bg-background rounded-full h-2 transition-all duration-500"
                  style={{ width: `${data.completionRate}%` }}
                ></div>
              </div>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/20 backdrop-blur-sm">
              <Zap className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
