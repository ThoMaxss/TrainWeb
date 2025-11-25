"use client";

import { TrendingUp, Download, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueData {
  day: string;
  revenue: number;
  target: number;
  tickets: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
  onNavigateReport: () => void;
  formatCurrency: (amount: number) => string;
}

export function RevenueChart({ 
  data, 
  selectedPeriod, 
  onPeriodChange, 
  onNavigateReport,
  formatCurrency 
}: RevenueChartProps) {
  return (
    <Card className="border-0 bg-background shadow-md lg:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Doanh thu & Vé bán</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              7 ngày gần nhất với mục tiêu
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">7 ngày</SelectItem>
                <SelectItem value="month">30 ngày</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="day"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              yAxisId="revenue"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <YAxis
              yAxisId="tickets"
              orientation="right"
              stroke="var(--color-success)"
              fontSize={12}
              tickLine={false}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
                fontSize: "14px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number, name: string) => [
                name === "revenue" ? formatCurrency(value * 1000) : value,
                name === "revenue" ? "Doanh thu" : name === "target" ? "Mục tiêu" : "Số vé",
              ]}
            />
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="target"
              stroke="var(--color-warning)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Bar
              yAxisId="tickets"
              dataKey="tickets"
              fill="var(--color-success)"
              fillOpacity={0.6}
              radius={[2, 2, 0, 0]}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="mt-3 pt-3 border-t">
          <Button
            variant="outline"
            className="w-full gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary"
            onClick={onNavigateReport}
          >
            <TrendingUp className="h-4 w-4" />
            Xem báo cáo chi tiết
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
