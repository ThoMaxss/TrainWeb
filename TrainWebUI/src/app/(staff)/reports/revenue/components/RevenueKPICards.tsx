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
      <Card className="border-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 shadow-xl shadow-green-500/10 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
        <div className="p-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-green-500/40">
              <DollarSign className="h-6 w-6 text-primary-foreground" />
            </div>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 border-0 font-semibold shadow-sm",
                data.revenueChange >= 0 ? "bg-success/10 text-success" : "bg-error/10 text-error",
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
          <h3 className="text-2xl font-bold text-emerald-900 mb-1">
            {data.totalRevenue.toLocaleString("vi-VN")}₫
          </h3>
          <p className="text-sm font-medium text-success">Tổng doanh thu</p>
        </div>
      </Card>

      {/* Tickets Sold */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
        <div className="p-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40">
              <Ticket className="h-6 w-6 text-primary-foreground" />
            </div>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 border-0 font-semibold shadow-sm",
                data.ticketsChange >= 0 ? "bg-success/10 text-success" : "bg-error/10 text-error",
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
      <Card className="border-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-xl shadow-amber-500/10 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <div className="p-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/40">
              <RefreshCw className="h-6 w-6 text-primary-foreground" />
            </div>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 border-0 font-semibold shadow-sm",
                data.refundsChange <= 0 ? "bg-success/10 text-success" : "bg-error/10 text-error",
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
          <h3 className="text-2xl font-bold text-amber-900 mb-1">{data.refunds.toLocaleString("vi-VN")}₫</h3>
          <p className="text-sm font-medium text-amber-700">Hoàn vé</p>
        </div>
      </Card>

      {/* Failed Transactions */}
      <Card className="border-0 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 shadow-xl shadow-red-500/10 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
        <div className="p-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/40">
              <XCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 border-0 font-semibold shadow-sm",
                data.failedChange <= 0 ? "bg-success/10 text-success" : "bg-error/10 text-error",
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
          <p className="text-sm font-medium text-error">Giao dịch thất bại</p>
        </div>
      </Card>
    </div>
  );
}
