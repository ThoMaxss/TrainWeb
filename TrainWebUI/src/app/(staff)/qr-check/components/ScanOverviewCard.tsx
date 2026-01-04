import { Activity, CheckCircle, Clock, XCircle, History, Scan } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ScanStats {
  total: number
  checkedIn: number
  pending: number
  cancelled: number
  lastScanAt: string | null
  state: {
    label: string
    badge: string
  }
}

interface ScannedTicket {
  id: string
  passengerName: string
}

interface ScanOverviewCardProps {
  stats: ScanStats
  scannedTicket: ScannedTicket | null
  mode: "scan" | "manual"
}

export function ScanOverviewCard({ stats, scannedTicket, mode }: ScanOverviewCardProps) {
  return (
    <Card className="border bg-primary text-primary-foreground rounded-lg">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Scan className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Trạng thái hệ thống</h2>
        </div>
        
        <p className="text-2xl font-bold mb-2">{stats.state.label}</p>
        
        <p className="text-sm text-primary-foreground/80 mb-4">
          {scannedTicket
            ? `Đang hiển thị vé ${scannedTicket.passengerName || "khách"} • ${scannedTicket.id}`
            : mode === "scan"
              ? "Máy quét đã sẵn sàng. Hướng camera vào mã QR."
              : "Nhập mã vé thủ công để tra cứu nhanh."}
        </p>

        {stats.lastScanAt && (
          <p className="flex items-center gap-2 text-xs text-primary-foreground/70 mb-4">
            <History className="h-4 w-4" />
            Lần quét gần nhất: {stats.lastScanAt}
          </p>
        )}

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="rounded-xl bg-background/15 px-3 py-3">
            <CheckCircle className="h-5 w-5 text-success/90 mb-2" />
            <p className="text-xs text-primary-foreground/70">Check-in</p>
            <p className="text-lg font-bold">{stats.checkedIn}</p>
          </div>
          <div className="rounded-xl bg-background/15 px-3 py-3">
            <Clock className="h-5 w-5 text-warning/90 mb-2" />
            <p className="text-xs text-primary-foreground/70">Chờ xử lý</p>
            <p className="text-lg font-bold">{stats.pending}</p>
          </div>
          <div className="rounded-xl bg-background/15 px-3 py-3">
            <XCircle className="h-5 w-5 text-destructive/90 mb-2" />
            <p className="text-xs text-primary-foreground/70">Từ chối</p>
            <p className="text-lg font-bold">{stats.cancelled}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
