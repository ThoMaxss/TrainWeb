"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueData {
  date: string;
  revenue: number;
  tickets: number;
  refunds: number;
}

interface RevenueTrendChartProps {
  data: RevenueData[];
  timeFilterLabel: string;
}

const COLORS = {
  primary: "#3B82F6",
  danger: "#EF4444",
};

export function RevenueTrendChart({ data, timeFilterLabel }: RevenueTrendChartProps) {
  return (
    <Card className="border-0 bg-background/80 backdrop-blur-sm shadow-xl shadow-blue-500/10 lg:col-span-2">
      <div className="p-2">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Xu hướng doanh thu</h3>
            <p className="text-sm text-muted-foreground font-medium">{timeFilterLabel}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1.5 border-primary bg-primary/10/50">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span className="text-xs font-medium">Doanh thu</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 border-destructive/20 bg-error/10/50">
              <div className="h-2 w-2 rounded-full bg-error"></div>
              <span className="text-xs font-medium">Hoàn vé</span>
            </Badge>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
              formatter={(value: any) => `${value.toLocaleString("vi-VN")}₫`}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={COLORS.primary}
              strokeWidth={3}
              dot={{ fill: COLORS.primary, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="refunds"
              stroke={COLORS.danger}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: COLORS.danger, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
