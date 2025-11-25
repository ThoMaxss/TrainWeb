import { User as UserIcon, Edit2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Gender = "Nam" | "Nữ" | "Khác";

interface PersonalInfoCardProps {
  profile: {
    name: string;
    email: string;
    phone: string;
    birthDate?: string;
    gender?: Gender;
  };
  onEdit: () => void;
}

export function PersonalInfoCard({ profile, onEdit }: PersonalInfoCardProps) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="p-2">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UserIcon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-foreground">Thông tin cá nhân</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="gap-2 border-primary hover:bg-primary/10"
          >
            <Edit2 className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs text-muted-foreground">Họ tên</Label>
            <p className="mt-1">{profile.name || "--"}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <p className="mt-1">{profile.email}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Số điện thoại</Label>
            <p className="mt-1">{profile.phone}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Ngày sinh</Label>
            <p className="mt-1">{profile.birthDate ?? "--"}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Giới tính</Label>
            <p className="mt-1">{profile.gender ?? "--"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
