import { Train as TrainIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TrainDto } from "@/types";

interface TrainProfileCardProps {
  train: TrainDto;
}

export function TrainProfileCard({ train }: TrainProfileCardProps) {
  return (
    <Card className="border">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <TrainIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{train.name}</CardTitle>
              <CardDescription className="mt-1">Loại: {train.type}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">Mã tàu</Label>
              <p className="text-foreground font-medium mt-1">{train.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Tên tàu</Label>
              <p className="text-foreground font-medium mt-1">{train.name}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">Loại tàu</Label>
              <p className="text-foreground font-medium mt-1">{train.type}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
