import { Mail, Calendar, Shield, UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserDto, UserRole, USER_ROLE_LABELS } from "@/types";

interface UserProfileCardProps {
  user: UserDto;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const getRoleBadge = (role?: UserRole) => {
    if (role === undefined) return null;
    const colorClasses = {
      [UserRole.Admin]: "bg-purple-100 text-purple-700 hover:bg-purple-100",
      [UserRole.Staff]: "bg-primary/10 text-primary hover:bg-primary/10",
      [UserRole.Passenger]: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    };
    return (
      <Badge className={`gap-1 text-base ${colorClasses[role]}`}>
        <Shield className="h-4 w-4" />
        {USER_ROLE_LABELS[role]}
      </Badge>
    );
  };

  return (
    <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <UserIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="mt-1">{user.email}</CardDescription>
            </div>
          </div>
          {getRoleBadge(user.role)}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">Mã người dùng</Label>
              <p className="text-foreground font-medium mt-1">{user.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Địa chỉ Email</Label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-foreground font-medium">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">Vai trò</Label>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <p className="text-foreground font-medium">
                  {user.role !== undefined ? USER_ROLE_LABELS[user.role] : "—"}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Ngày tạo</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-foreground font-medium">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
