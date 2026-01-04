import { Train, Calendar, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SelectedSeat {
  id: string
  coachNumber: number
  seatNumber: string
  seatType: string
  price: number
}

interface TripInfo {
  trainNumber: string
  route: string
  departureDate: string
  departureTime: string
  arrivalTime: string
}

interface BookingSummaryCardProps {
  tripInfo: TripInfo
  selectedSeats: SelectedSeat[]
  formatPrice: (price: number) => string
}

export function BookingSummaryCard({ tripInfo, selectedSeats, formatPrice }: BookingSummaryCardProps) {
  return (
    <Card className="border-0 shadow-md sticky top-20">
      <div className="p-2">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Train className="h-5 w-5 text-primary" />
          Tóm tắt đặt chỗ
        </h3>

        <div className="space-y-3">
          {/* Trip Info */}
          <div>
            <p className="text-sm font-medium">{tripInfo.trainNumber}</p>
            <p className="text-sm text-muted-foreground">{tripInfo.route}</p>
          </div>

          <Separator />

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Ngày đi</p>
                <p className="font-medium">{tripInfo.departureDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Giờ đi</p>
                <p className="font-medium">
                  {tripInfo.departureTime} - {tripInfo.arrivalTime}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Selected Seats */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ghế đã chọn</p>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <Badge
                  key={seat.id}
                  variant="secondary"
                  className="bg-primary text-primary-foreground hover:bg-hover-primary"
                >
                  Toa {seat.coachNumber}, Ghế {seat.seatNumber}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-2">
            {selectedSeats.map((seat, idx) => (
              <div key={seat.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  HK {idx + 1} - Ghế {seat.seatNumber}
                </span>
                <span className="font-medium">{formatPrice(seat.price)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold">Tổng cộng</span>
              <span className="text-primary text-lg font-bold">
                {formatPrice(selectedSeats.reduce((sum, seat) => sum + seat.price, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
