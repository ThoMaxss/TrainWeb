"use client";

import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TicketsEmptyState() {
  return (
    <Card className="border-0 bg-background shadow-lg shadow-slate-200/50">
      <div className="flex flex-col items-center justify-center py-16 px-2 text-center">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
          <AlertCircle className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Không tìm thấy vé nào phù hợp</h3>
        <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
      </div>
    </Card>
  );
}
