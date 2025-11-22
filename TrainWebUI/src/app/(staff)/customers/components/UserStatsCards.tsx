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
      <Card className="p-4 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Tổng số</p>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
          </div>
          <UsersIcon className="h-10 w-10 text-blue-600/40" />
        </div>
      </Card>

      <Card className="p-4 border-0 bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">Admin</p>
            <p className="text-3xl font-bold text-violet-700 dark:text-violet-300">{stats.admins}</p>
          </div>
          <Shield className="h-10 w-10 text-violet-600/40" />
        </div>
      </Card>

      <Card className="p-4 border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Nhân viên</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.staff}</p>
          </div>
          <UserCheck className="h-10 w-10 text-green-600/40" />
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
