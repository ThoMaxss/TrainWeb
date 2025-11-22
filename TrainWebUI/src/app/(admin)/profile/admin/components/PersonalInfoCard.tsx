import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit2, UserIcon } from "lucide-react";

interface LocalAdminProfile {
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  role: string;
  department?: string;
}

interface PersonalInfoCardProps {
  profile: LocalAdminProfile;
  onEdit: () => void;
}

export function PersonalInfoCard({ profile, onEdit }: PersonalInfoCardProps) {
  return (
    <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <UserIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-foreground font-semibold">Thông tin cá nhân</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="gap-2 border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/30"
          >
            <Edit2 className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs text-muted-foreground">Họ tên</Label>
            <p className="mt-1 font-medium">{profile.name || "--"}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <p className="mt-1 font-medium">{profile.email}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Số điện thoại</Label>
            <p className="mt-1 font-medium">{profile.phone || "--"}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Chức vụ</Label>
            <p className="mt-1 font-medium">{profile.role}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Phòng ban</Label>
            <p className="mt-1 font-medium">{profile.department ?? "--"}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Ngày sinh</Label>
            <p className="mt-1 font-medium">{profile.birthDate ?? "--"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
