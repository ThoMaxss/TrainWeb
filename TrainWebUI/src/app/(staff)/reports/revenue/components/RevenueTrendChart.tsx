"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CHART_COLORS, { PIE_COLORS } from '@/lib/chartColors';

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
  primary: CHART_COLORS.primary,
  danger: CHART_COLORS.destructive,
};

export function RevenueTrendChart({ data, timeFilterLabel }: RevenueTrendChartProps) {
  return (
    <Card className="border-0 bg-background/80 backdrop-blur-sm shadow-xl shadow-primary/10 lg:col-span-2">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Xu hướng doanh thu</h3>
            <p className="text-sm text-muted-foreground font-medium">{timeFilterLabel}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1.5 border-primary bg-primary/10">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span className="text-xs font-medium">Doanh thu</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 border-destructive/20 bg-destructive/10">
              <div className="h-2 w-2 rounded-full bg-destructive"></div>
              <span className="text-xs font-medium">Hoàn vé</span>
            </Badge>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
              formatter={(value: number) => `${value.toLocaleString("vi-VN")}₫`}
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
