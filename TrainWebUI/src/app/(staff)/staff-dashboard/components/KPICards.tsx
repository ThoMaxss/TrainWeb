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
        className="border border-border bg-card shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onNavigate("/manage-tickets")}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vé hôm nay</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">
                {data.todayTickets.toLocaleString()}
              </h2>
              <div className="mt-2 flex items-center gap-1 text-sm text-success">
                {data.ticketsChange > 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                )}
                <span className={data.ticketsChange > 0 ? "text-success" : "text-destructive"}>
                  {Math.abs(data.ticketsChange)}% so với hôm qua
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Ticket className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Revenue */}
      <Card 
        className="border border-border bg-card shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onNavigate("/reports/revenue")}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Doanh thu hôm nay</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">
                {(data.todayRevenue / 1000000).toFixed(1)}M
              </h2>
              <div className="mt-2 flex items-center gap-1 text-sm">
                {data.revenueChange > 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-success" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                )}
                <span className={data.revenueChange > 0 ? "text-success" : "text-destructive"}>
                  {Math.abs(data.revenueChange)}% so với hôm qua
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 text-success">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Trains */}
      <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tàu sắp khởi hành</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">{data.upcomingTrains}</h2>
              <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Trong 24 giờ tới</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <Train className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Score */}
      <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-full mr-4">
              <p className="text-sm font-medium text-gray-500">Hiệu suất hoàn thành</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">{data.completionRate}%</h2>
              <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-purple-600 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${data.completionRate}%` }}
                ></div>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 flex-shrink-0">
              <Zap className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
 