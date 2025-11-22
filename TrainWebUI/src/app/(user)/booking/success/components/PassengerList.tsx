import { User } from "lucide-react"

interface Passenger {
  fullName: string
  seatNumber: string
  coachNumber: number
}

interface PassengerListProps {
  passengers: Passenger[]
}

export function PassengerList({ passengers }: PassengerListProps) {
  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        Hành khách ({passengers.length})
      </p>
      <div className="space-y-2">
        {passengers.map((passenger, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg bg-card p-2"
          >
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm">{passenger.fullName}</p>
              <p className="text-xs text-muted-foreground">
                Toa {passenger.coachNumber}, Ghế {passenger.seatNumber}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
