import { Users as UsersIcon, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserManagementHeaderProps {
  onCreateUser: () => void;
}

export function UserManagementHeader({ onCreateUser }: UserManagementHeaderProps) {
  return (
    <div className="border-b bg-gradient-to-r from-green-600/5 via-green-500/3 to-background dark:from-green-600/10 dark:via-green-500/5 dark:to-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <UsersIcon className="h-8 w-8 text-green-600" />
              Quản lý người dùng
            </h1>
            <p className="text-muted-foreground mt-1">
              Quản lý thông tin và quyền hạn người dùng hệ thống
            </p>
          </div>
          <Button onClick={onCreateUser} className="bg-green-600 hover:bg-green-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>
      </div>
    </div>
  );
}
