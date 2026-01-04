"use client";

import { Activity, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface StaffStats {
  name: string;
  role: string;
  avatar?: string;
  todayStats: {
    ticketsProcessed: number;
    customersHelped: number;
    issuesResolved: number;
    rating: number;
  };
}

interface DashboardHeaderProps {
  staffInfo: StaffStats;
}

export function DashboardHeader({ staffInfo }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tổng quan bảng điều khiển</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Xin chào, {staffInfo.name} – {staffInfo.role}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-success" />
          <span className="font-medium">{staffInfo.todayStats.ticketsProcessed}</span>
          <span className="text-muted-foreground">vé xử lý</span>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 text-warning fill-current" />
          <span className="font-medium">{staffInfo.todayStats.rating}</span>
          <span className="text-muted-foreground">đánh giá</span>
        </div>
      </div>
    </div>
  );
}
