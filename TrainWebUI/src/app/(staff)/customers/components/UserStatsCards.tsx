import { Shield, Users as UsersIcon, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserDto, UserRole } from "@/types";

interface UserStatsCardsProps {
  users: UserDto[];
}

export function UserStatsCards({ users }: UserStatsCardsProps) {
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === UserRole.Admin).length,
    staff: users.filter((u) => u.role === UserRole.Staff).length,
    passengers: users.filter((u) => u.role === UserRole.Passenger).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary font-medium">Tổng số</p>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </div>
          <UsersIcon className="h-10 w-10 text-primary/40" />
        </div>
      </Card>

      <Card className="p-4 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary dark:text-secondary/30 font-medium">Admin</p>
            <p className="text-3xl font-bold text-secondary dark:text-secondary/30">{stats.admins}</p>
          </div>
          <Shield className="h-10 w-10 text-secondary/40" />
        </div>
      </Card>

      <Card className="p-4 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-success dark:text-success/70 font-medium">Nhân viên</p>
            <p className="text-3xl font-bold text-success dark:text-success/90">{stats.staff}</p>
          </div>
          <UserCheck className="h-10 w-10 text-success/40" />
        </div>
      </Card>

      <Card className="p-4 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Hành khách</p>
            <p className="text-3xl font-bold text-foreground">{stats.passengers}</p>
          </div>
          <UsersIcon className="h-10 w-10 text-muted-foreground/40" />
        </div>
      </Card>
    </div>
  );
}
