"use client";

import { Info, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export function RevenueInsightsBox() {
  return (
    <Card className="border-2 border-primary/60 bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 backdrop-blur-sm shadow-xl shadow-primary/10">
      <div className="p-2">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/20 shadow-lg shadow-primary/40 shrink-0">
            <Info className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="mb-3 text-lg font-bold text-primary">📊 Điểm nổi bật</h4>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-background/80 backdrop-blur-sm p-2 border border-primary/50 shadow-md hover:shadow-lg transition-all duration-200">
                <p className="text-xs font-medium text-primary mb-1">Tuyến bán chạy nhất</p>
                <p className="font-bold text-primary">Hà Nội - TP.HCM</p>
                <p className="text-xs text-primary mt-1 font-medium">89.5 triệu ₫ • 448 vé</p>
              </div>
              <div className="rounded-xl bg-background/80 backdrop-blur-sm p-2 border border-primary/50 shadow-md hover:shadow-lg transition-all duration-200">
                <p className="text-xs font-medium text-primary mb-1">Tỷ lệ hoàn vé</p>
                <p className="font-bold text-success flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" />
                  11.6% (-15.2%)
                </p>
                <p className="text-xs text-primary mt-1 font-medium">Giảm so với tuần trước</p>
              </div>
              <div className="rounded-xl bg-background/80 backdrop-blur-sm p-2 border border-primary/50 shadow-md hover:shadow-lg transition-all duration-200">
                <p className="text-xs font-medium text-primary mb-1">Xu hướng</p>
                <p className="font-bold text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Tăng trưởng
                </p>
                <p className="text-xs text-primary mt-1 font-medium">Doanh thu tăng đều</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
