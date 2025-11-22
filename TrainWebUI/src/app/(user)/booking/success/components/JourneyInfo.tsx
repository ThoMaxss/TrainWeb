import { Train, Calendar, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface TripInfo {
  trainNumber: string
  trainName: string
  route: string
  departureDate: string
  departureTime: string
  arrivalTime: string
}

interface JourneyInfoProps {
  tripInfo: TripInfo
}

export function JourneyInfo({ tripInfo }: JourneyInfoProps) {
  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">Thông tin chuyến đi</p>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Train className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-mono">{tripInfo.trainNumber} - {tripInfo.trainName}</p>
            <p className="text-sm text-muted-foreground">{tripInfo.route}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Ngày đi</p>
              <p className="text-sm">{tripInfo.departureDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Giờ khởi hành</p>
              <p className="text-sm">{tripInfo.departureTime} → {tripInfo.arrivalTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
