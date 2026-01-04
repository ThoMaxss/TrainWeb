import { Clock, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ActivitySummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Trạng thái tài khoản</p>
              <p className="text-xl font-bold text-foreground mt-1">Hoạt động</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <Activity className="h-6 w-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đăng nhập lần cuối</p>
              <p className="text-xl font-bold text-foreground mt-1">—</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hoạt động</p>
              <p className="text-xl font-bold text-foreground mt-1">0</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
