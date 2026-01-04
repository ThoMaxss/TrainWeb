import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";

interface ScheduleStatsProps {
  totalSchedules: number;
  activeSchedules: number;
  uniqueRoutes: number;
}

export function ScheduleStats({ totalSchedules, activeSchedules, uniqueRoutes }: ScheduleStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng lịch trình</p>
            <h3 className="text-2xl font-bold">{totalSchedules}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
            <Clock className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Còn chỗ</p>
            <h3 className="text-2xl font-bold">{activeSchedules}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tuyến đường</p>
            <h3 className="text-2xl font-bold">{uniqueRoutes}</h3>
          </div>
        </div>
      </Card>
    </div>
  );
}
