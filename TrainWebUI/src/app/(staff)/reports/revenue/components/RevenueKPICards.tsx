"use client";

import { DollarSign, Ticket, RefreshCw, XCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";

interface KPIData {
  totalRevenue: number;
  revenueChange: number;
  ticketsSold: number;
  ticketsChange: number;
  refunds: number;
  refundsChange: number;
  failedTransactions: number;
  failedChange: number;
}

interface RevenueKPICardsProps {
  data: KPIData;
}

export function RevenueKPICards({ data }: RevenueKPICardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <Card className="border-0 bg-gradient-to-br from-success/5 via-success/10 to-success/20 shadow-xl shadow-success/10 hover:shadow-2xl hover:shadow-success/20 transition-all duration-300">
        <div className="p-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success to-success/80 shadow-lg shadow-success/40">
              <DollarSign className="h-6 w-6 text-primary-foreground" />
            </div>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 border-0 font-semibold shadow-sm",
                data.revenueChange >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {data.revenueChange >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(data.revenueChange)}%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-success mb-1">
            {data.totalRevenue.toLocaleString("vi-VN")}₫
          </h3>
          <p className="text-sm font-medium text-success">Tổng doanh thu</p>
        </div>
      </Card>

      {/* Tickets Sold */}
      <Card className="border-0 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300">
        <div className="p-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 shadow-lg shadow-primary/40">
              <Ticket className="h-6 w-6 text-primary-foreground" />
            </div>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 border-0 font-semibold shadow-sm",
                data.ticketsChange >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {data.ticketsChange >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(data.ticketsChange)}%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-primary mb-1">{data.ticketsSold.toLocaleString("vi-VN")}</h3>
          <p className="text-sm font-medium text-primary">Vé đã bán</p>
        </div>
      </Card>

      {/* Refunds */}
      <Card className="border-0 bg-gradient-to-br from-warning/5 via-accent/10 to-warning/20 shadow-xl shadow-warning/10 hover:shadow-2xl hover:shadow-warning/20 transition-all duration-300">
        <div className="p-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-warning to-accent/60 shadow-lg shadow-warning/40">
              <RefreshCw className="h-6 w-6 text-primary-foreground" />
            </div>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 border-0 font-semibold shadow-sm",
                data.refundsChange <= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {data.refundsChange <= 0 ? (
                <ArrowDownRight className="h-3 w-3" />
              ) : (
                <ArrowUpRight className="h-3 w-3" />
              )}
              {Math.abs(data.refundsChange)}%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-warning mb-1">{data.refunds.toLocaleString("vi-VN")}₫</h3>
          <p className="text-sm font-medium text-warning">Hoàn vé</p>
        </div>
      </Card>

      {/* Failed Transactions */}
      <Card className="border-0 bg-gradient-to-br from-destructive/5 via-destructive/10 to-destructive/20 shadow-xl shadow-destructive/10 hover:shadow-2xl hover:shadow-destructive/20 transition-all duration-300">
        <div className="p-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-destructive to-destructive/60 shadow-lg shadow-destructive/40">
              <XCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 border-0 font-semibold shadow-sm",
                data.failedChange <= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {data.failedChange <= 0 ? (
                <ArrowDownRight className="h-3 w-3" />
              ) : (
                <ArrowUpRight className="h-3 w-3" />
              )}
              {Math.abs(data.failedChange)}%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-destructive mb-1">
            {data.failedTransactions.toLocaleString("vi-VN")}
          </h3>
          <p className="text-sm font-medium text-destructive">Giao dịch thất bại</p>
        </div>
      </Card>
    </div>
  );
}
