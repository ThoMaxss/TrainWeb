import { RotateCcw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type TicketStatus = "not-checked-in" | "checked-in" | "cancelled"

interface RecentScan {
  ticketId: string
  passengerName: string
  seat: string
  status: TicketStatus
  scannedAt: string
}

interface RecentScansCardProps {
  scans: RecentScan[]
  onClear: () => void
}

function getStatusBadge(status: TicketStatus) {
  switch (status) {
    case "not-checked-in":
      return <Badge className="bg-warning/10 text-warning hover:bg-warning/10 text-xs">Chưa</Badge>
    case "checked-in":
      return <Badge className="bg-success/10 text-success hover:bg-success/10 text-xs">Xong</Badge>
    case "cancelled":
      return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 text-xs">Hủy</Badge>
  }
}

export function RecentScansCard({ scans, onClear }: RecentScansCardProps) {
  return (
    <Card className="border-0 bg-background shadow-lg rounded-2xl">
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">Lịch sử quét</h3>
            <Badge variant="outline" className="text-xs">
              {scans.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onClear}
            disabled={scans.length === 0}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Khách</TableHead>
                <TableHead className="text-xs">Ghế</TableHead>
                <TableHead className="text-xs">Trạng thái</TableHead>
                <TableHead className="text-xs">Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.map((scan, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-sm">{scan.passengerName}</TableCell>
                  <TableCell className="text-sm">{scan.seat}</TableCell>
                  <TableCell>{getStatusBadge(scan.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{scan.scannedAt}</TableCell>
                </TableRow>
              ))}
              {scans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground text-sm py-6">
                    Chưa có lịch sử quét
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}
