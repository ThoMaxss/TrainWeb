import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils/utils";

type TicketStatus = "not-checked-in" | "checked-in" | "cancelled";

interface RecentScan {
  ticketId: string;
  passengerName: string;
  status: TicketStatus;
  scannedAt: string;
}

interface RecentScansTableProps {
  scans: RecentScan[];
}

function getStatusBadge(status: TicketStatus) {
  switch (status) {
    case "checked-in":
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/10 gap-1 text-xs">
          <CheckCircle className="h-3 w-3" />
          Check-in
        </Badge>
      );
    case "not-checked-in":
      return (
        <Badge className="bg-warning/10 text-warning hover:bg-warning/10 gap-1 text-xs">
          <AlertTriangle className="h-3 w-3" />
          Chưa
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 gap-1 text-xs">
          <XCircle className="h-3 w-3" />
          Hủy
        </Badge>
      );
  }
}

export function RecentScansTable({ scans }: RecentScansTableProps) {
  if (scans.length === 0) {
    return (
      <Card className="p-4 text-center border-2 border-dashed border-border/50">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Clock className="h-12 w-12 opacity-30" />
          <p className="text-sm">Chưa có lịch sử quét vé</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted/50 px-4 py-3 border-b">
        <h3 className="font-semibold text-foreground">Lịch sử quét gần đây</h3>
        <p className="text-xs text-muted-foreground">{scans.length} vé đã quét</p>
      </div>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã vé</TableHead>
              <TableHead>Hành khách</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scans.map((scan, index) => (
              <TableRow
                key={`${scan.ticketId}-${index}`}
                className={cn(
                  "transition-colors",
                  scan.status === "checked-in" && "bg-success/5",
                  scan.status === "cancelled" && "bg-destructive/5"
                )}
              >
                <TableCell className="font-mono text-sm">{scan.ticketId}</TableCell>
                <TableCell className="font-medium">{scan.passengerName}</TableCell>
                <TableCell>{getStatusBadge(scan.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(scan.scannedAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
