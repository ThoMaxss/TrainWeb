import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TransactionFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeTab: "all" | "success" | "failed" | "pending"
  onTabChange: (tab: "all" | "success" | "failed" | "pending") => void
  timeFilter: "7" | "30" | "custom"
  onTimeFilterChange: (filter: "7" | "30" | "custom") => void
  stats: {
    all: number
    success: number
    failed: number
    pending: number
  }
}

export function TransactionFilters({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  timeFilter,
  onTimeFilterChange,
  stats,
}: TransactionFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as "all" | "success" | "failed" | "pending") }>
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="all" className="gap-2">
            Tất cả
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {stats.all}
            </span>
          </TabsTrigger>
          <TabsTrigger value="success" className="gap-2">
            Thành công
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
              {stats.success}
            </span>
          </TabsTrigger>
          <TabsTrigger value="failed" className="gap-2">
            Thất bại
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
              {stats.failed}
            </span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            Đang xử lý
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning">
              {stats.pending}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search & Time Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã giao dịch, mã vé..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-1 shadow-sm">
          <Button
            variant={timeFilter === "7" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTimeFilterChange("7")}
            className={timeFilter === "7" ? "bg-gradient-to-r from-primary to-primary/80" : ""}
          >
            7 ngày
          </Button>
          <Button
            variant={timeFilter === "30" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTimeFilterChange("30")}
            className={timeFilter === "30" ? "bg-gradient-to-r from-primary to-primary/80" : ""}
          >
            30 ngày
          </Button>
          <Button
            variant={timeFilter === "custom" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTimeFilterChange("custom")}
            className={timeFilter === "custom" ? "bg-gradient-to-r from-primary to-primary/80" : ""}
          >
            Tùy chỉnh
          </Button>
        </div>
      </div>
    </div>
  )
}
