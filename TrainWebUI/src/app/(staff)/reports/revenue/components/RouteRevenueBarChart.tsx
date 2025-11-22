"use client";

import { Card } from "@/components/ui/card";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface RouteRevenueData {
  route: string;
  revenue: number;
  tickets: number;
}

interface RouteRevenueChartProps {
  data: RouteRevenueData[];
}

const COLORS = { primary: "#3B82F6" };

export function RouteRevenueBarChart({ data }: RouteRevenueChartProps) {
  return (
    <Card className="border-0 bg-background/80 backdrop-blur-sm shadow-xl shadow-blue-500/10">
      <div className="p-2">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Doanh thu theo tuyến</h3>
            <p className="text-sm text-muted-foreground font-medium">Top 5 tuyến có doanh thu cao nhất</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              type="number"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <YAxis type="category" dataKey="route" stroke="#6B7280" fontSize={12} tickLine={false} width={150} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
              formatter={(value: any, name: string) => {
                if (name === "revenue") return [`${value.toLocaleString("vi-VN")}₫`, "Doanh thu"]
                return [value, "Vé bán"]
              }}
            />
            <Bar dataKey="revenue" fill={COLORS.primary} radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
