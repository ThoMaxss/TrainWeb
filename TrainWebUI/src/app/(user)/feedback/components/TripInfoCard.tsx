import { Train, Calendar, Users, Armchair } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TripInfoCardProps {
  tripInfo: {
    trainNumber: string;
    route: string;
    date: string;
    seats: string[];
  };
}

export function TripInfoCard({ tripInfo }: TripInfoCardProps) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="p-2">
        <h3 className="mb-3 text-lg font-semibold text-foreground">Thông tin chuyến đi</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Train className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tàu số</p>
              <p className="font-mono font-medium">{tripInfo.trainNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ngày khởi hành</p>
              <p className="font-medium">{tripInfo.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hành trình</p>
              <p className="font-medium">{tripInfo.route}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Armchair className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Chỗ ngồi</p>
              <div className="flex gap-1">
                {tripInfo.seats.map((seat, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="border-primary text-xs"
                  >
                    {seat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
