import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, XCircle, Clock, History } from "lucide-react";

interface ScanStats {
  total: number;
  checkedIn: number;
  pending: number;
  cancelled: number;
  lastScanAt: string | null;
  state: {
    label: string;
    badge: string;
  };
}

interface ScanStatsCardsProps {
  stats: ScanStats;
}

export function ScanStatsCards({ stats }: ScanStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
      {/* Status Badge */}
      <Card className="p-4 border-2 border-primary/30 bg-primary/5">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-5 w-5 text-primary" />
          <p className="text-sm font-semibold text-primary">Trạng thái</p>
        </div>
        <Badge className={stats.state.badge}>{stats.state.label}</Badge>
      </Card>

      {/* Total Scans */}
      <Card className="p-4 border bg-muted">
        <div className="flex items-center gap-2 mb-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">Tổng số</p>
        </div>
        <p className="text-2xl font-bold text-foreground">{stats.total}</p>
      </Card>

      {/* Checked In */}
      <Card className="p-4 border bg-success/5">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-success" />
          <p className="text-sm font-semibold text-success">Đã check-in</p>
        </div>
        <p className="text-2xl font-bold text-success">{stats.checkedIn}</p>
      </Card>

      {/* Pending */}
      <Card className="p-4 border bg-warning/5">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-warning" />
          <p className="text-sm font-semibold text-warning">Chờ check-in</p>
        </div>
        <p className="text-2xl font-bold text-warning">{stats.pending}</p>
      </Card>

      {/* Cancelled */}
      <Card className="p-4 border bg-destructive/5">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm font-semibold text-destructive">Đã hủy</p>
        </div>
        <p className="text-2xl font-bold text-destructive">{stats.cancelled}</p>
      </Card>
    </div>
  );
}
