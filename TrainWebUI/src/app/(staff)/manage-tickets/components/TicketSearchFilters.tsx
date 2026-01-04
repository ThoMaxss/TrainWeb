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
    <Card className="mb-3 border">
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
          >
            Tất cả ({ticketCounts.all})
          </Button>
          <Button
            variant={activeFilter === "upcoming" ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("upcoming")}
            className={cn(
              activeFilter === "upcoming" && "bg-success hover:bg-success/90"
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
                ? "bg-slate-600 hover:bg-slate-700"
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
                ? "bg-destructive hover:bg-destructive/90"
                : "hover:bg-destructive/10 hover:border-destructive/20",
            )}
          >
            Đã hủy ({ticketCounts.cancelled})
          </Button>
        </div>
      </div>
    </Card>
  );
}
