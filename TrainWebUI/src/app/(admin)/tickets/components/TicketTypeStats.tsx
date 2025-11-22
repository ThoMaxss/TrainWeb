import { Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TicketTypeStatsProps {
  totalTypes: number;
}

export function TicketTypeStats({ totalTypes }: TicketTypeStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng mẫu vé</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalTypes}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Ticket className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
