import { Activity, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function TrainActivitySummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Trạng thái</p>
              <p className="text-xl font-bold text-foreground mt-1">Hoạt động</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <Activity className="h-6 w-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chuyến đi</p>
              <p className="text-xl font-bold text-foreground mt-1">0</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
