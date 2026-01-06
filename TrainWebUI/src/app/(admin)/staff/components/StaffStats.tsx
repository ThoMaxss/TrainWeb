import { Users, Shield, UserCheck, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StaffStatsProps {
  totalUsers: number;
  staffCount: number;
  adminCount: number;
  passengerCount: number;
}

export function StaffStats({
  totalUsers,
  staffCount,
  adminCount,
  passengerCount,
}: StaffStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng người dùng</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalUsers}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nhân viên</p>
              <p className="text-2xl font-bold text-foreground mt-1">{staffCount}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Quản trị viên</p>
              <p className="text-2xl font-bold text-foreground mt-1">{adminCount}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hành khách</p>
              <p className="text-2xl font-bold text-foreground mt-1">{passengerCount}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
