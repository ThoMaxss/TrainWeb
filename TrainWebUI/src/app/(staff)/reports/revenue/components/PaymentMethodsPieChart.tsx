"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface PaymentMethodData {
  method: string;
  value: number;
  percentage: number;
  [key: string]: string | number;
}

interface PaymentMethodsChartProps {
  data: PaymentMethodData[];
}

import CHART_COLORS, { PIE_COLORS as LIB_PIE_COLORS } from '@/lib/chartColors';
const PIE_COLORS = LIB_PIE_COLORS;

export function PaymentMethodsPieChart({ data }: PaymentMethodsChartProps) {
  return (
    <Card className="border-0 bg-background/80 backdrop-blur-sm shadow-xl shadow-primary/10">
      <div className="p-2">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-foreground">Phương thức thanh toán</h3>
          <p className="text-sm text-muted-foreground font-medium">Phân bổ theo giá trị</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data as any}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
              formatter={(value: any) => `${value.toLocaleString("vi-VN")}₫`}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-3 space-y-2">
          {data.map((item, index) => (
            <div key={item.method} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full shadow-sm"
                  style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                />
                <span className="text-muted-foreground font-medium">{item.method}</span>
              </div>
              <span className="font-bold text-foreground">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
