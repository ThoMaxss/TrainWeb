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
      <Card className="p-4 border-0 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary-950/30 dark:to-primary-900/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary font-medium">Tổng số</p>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </div>
          <UsersIcon className="h-10 w-10 text-primary/40" />
        </div>
      </Card>

      <Card className="p-4 border-0 bg-gradient-to-br from-secondary/5 to-secondary/10 dark:from-secondary/20 dark:to-secondary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary dark:text-secondary/30 font-medium">Admin</p>
            <p className="text-3xl font-bold text-secondary dark:text-secondary/30">{stats.admins}</p>
          </div>
          <Shield className="h-10 w-10 text-secondary/40" />
        </div>
      </Card>

      <Card className="p-4 border-0 bg-gradient-to-br from-success/5 to-success/10 dark:from-success/10 dark:to-success/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-success dark:text-success/70 font-medium">Nhân viên</p>
            <p className="text-3xl font-bold text-success dark:text-success/90">{stats.staff}</p>
          </div>
          <UserCheck className="h-10 w-10 text-success/40" />
        </div>
      </Card>

      <Card className="p-4 border-0 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-950/30 dark:to-gray-900/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Hành khách</p>
            <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">{stats.passengers}</p>
          </div>
          <UsersIcon className="h-10 w-10 text-gray-600/40" />
        </div>
      </Card>
    </div>
  );
}
