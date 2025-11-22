"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

interface PaymentMethod {
  method: string;
  value: number;
  amount: number;
  fill: string;
  trend: "up" | "down";
}

interface PaymentMethodsChartProps {
  data: PaymentMethod[];
  formatCurrency: (amount: number) => string;
}

export function PaymentMethodsChart({ data, formatCurrency }: PaymentMethodsChartProps) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground">Phương thức thanh toán</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tỷ lệ và xu hướng hôm nay
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data as any}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ method, percent }: any) =>
                `${method} ${((percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value: number, name: string, props: any) => [
                `${value}% (${formatCurrency(props.payload.amount)})`, 
                "Tỷ lệ"
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-3 space-y-3">
          {data.map((method) => (
            <div
              key={method.method}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: method.fill }}
                />
                <span className="font-medium">{method.method}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {formatCurrency(method.amount)}
                </span>
                {method.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-success" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-error" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
