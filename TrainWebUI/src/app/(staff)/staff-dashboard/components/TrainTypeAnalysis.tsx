"use client";

import { Filter, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils/utils";

interface TicketType {
  type: string;
  tickets: number;
  revenue: number;
  fill: string;
  growth: number;
}

interface TrainTypeAnalysisProps {
  data: TicketType[];
  formatCurrency: (amount: number) => string;
}

export function TrainTypeAnalysis({ data, formatCurrency }: TrainTypeAnalysisProps) {
  return (
    <Card className="mb-5 border-0 bg-background shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Phân tích theo loại tàu</CardTitle>
            <p className="text-sm text-muted-foreground">Doanh số và tăng trưởng hôm nay</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Lọc
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Chi tiết
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="type"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`, 
                borderRadius: "8px",
                fontSize: "14px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number, name: string, props: any) => [
                name === "tickets" ? `${value} vé` : formatCurrency(value),
                name === "tickets" ? "Số vé" : "Doanh thu"
              ]}
            />
            <Bar dataKey="tickets" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {data.map((type) => (
            <div
              key={type.type}
              className="flex items-center justify-between p-2 rounded-lg border-2 border-border/50 hover:border-primary transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: type.fill }}
                  />
                  <span className="font-semibold text-lg">{type.type}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(type.revenue)}
                </p>
              </div>
              <div className="text-right">
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  type.growth > 0 ? "text-success" : "text-destructive"
                )}>
                  {type.growth > 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{Math.abs(type.growth)}%</span>
                </div>
                <p className="text-xs text-muted-foreground">vs hôm qua</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
