import { Edit2, Trash2, MoreVertical, Mail, Calendar, Shield, Users as UsersIcon, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { UserDto, UserRole } from "@/types";

interface UserTableProps {
  users: UserDto[];
  loading: boolean;
  onEditUser: (user: UserDto) => void;
  onDeleteUser: (user: UserDto) => void;
}

export function UserTable({ users, loading, onEditUser, onDeleteUser }: UserTableProps) {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return "bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary/30";
      case UserRole.Staff:
        return "bg-success/10 text-success dark:bg-success/20 dark:text-success/30";
      case UserRole.Passenger:
        return "bg-primary/10 text-primary dark:bg-primary-900/30 dark:text-primary/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return Shield;
      case UserRole.Staff:
        return UserCheck;
      case UserRole.Passenger:
        return UsersIcon;
      default:
        return UsersIcon;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin:
        return "Quản trị viên";
      case UserRole.Staff:
        return "Nhân viên";
      case UserRole.Passenger:
        return "Hành khách";
      default:
        return role;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Người dùng</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Vai trò</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Ngày tạo</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Đang tải...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Không tìm thấy người dùng
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const RoleIcon = getRoleIcon(user.role ?? UserRole.Passenger);
                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-success text-white">
                            {getInitials(user.name ?? "U")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={cn("gap-1", getRoleBadgeColor(user.role ?? UserRole.Passenger))}>
                        <RoleIcon className="h-3 w-3" />
                        {getRoleLabel(user.role ?? UserRole.Passenger)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(user.createdAt ?? new Date().toISOString())}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditUser(user)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteUser(user)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
