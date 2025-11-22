"use client";

import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

interface TicketCounts {
  all: number;
  upcoming: number;
  completed: number;
  cancelled: number;
}

interface TicketSearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: "all" | "upcoming" | "completed" | "cancelled";
  onFilterChange: (filter: "all" | "upcoming" | "completed" | "cancelled") => void;
  ticketCounts: TicketCounts;
}

export function TicketSearchFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  ticketCounts,
}: TicketSearchFiltersProps) {
  return (
    <Card className="mb-3 border-0 bg-background shadow-lg shadow-slate-200/50">
      <div className="p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            placeholder="Nhập mã vé, tên hành khách, hoặc tuyến..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 border-border focus-visible:ring-blue-500 focus-visible:ring-2 transition-shadow"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("all")}
            className={cn(
              "transition-all",
              activeFilter === "all"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/30"
                : "hover:bg-primary/10 hover:border-primary",
            )}
          >
            Tất cả ({ticketCounts.all})
          </Button>
          <Button
            variant={activeFilter === "upcoming" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("upcoming")}
            className={cn(
              "transition-all",
              activeFilter === "upcoming"
                ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md shadow-emerald-500/30"
                : "hover:bg-emerald-50 hover:border-emerald-300",
            )}
          >
            Sắp đi ({ticketCounts.upcoming})
          </Button>
          <Button
            variant={activeFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("completed")}
            className={cn(
              "transition-all",
              activeFilter === "completed"
                ? "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 shadow-md shadow-slate-500/30"
                : "hover:bg-muted/50 hover:border-border",
            )}
          >
            Đã đi ({ticketCounts.completed})
          </Button>
          <Button
            variant={activeFilter === "cancelled" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("cancelled")}
            className={cn(
              "transition-all",
              activeFilter === "cancelled"
                ? "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-md shadow-rose-500/30"
                : "hover:bg-rose-50 hover:border-rose-300",
            )}
          >
            Đã hủy ({ticketCounts.cancelled})
          </Button>
        </div>
      </div>
    </Card>
  );
}
