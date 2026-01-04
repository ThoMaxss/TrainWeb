import { Train } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TrainStatsProps {
  totalTrains: number;
}

export function TrainStats({ totalTrains }: TrainStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="border">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng số tàu</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalTrains}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Train className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
