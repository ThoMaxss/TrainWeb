import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserDto, UserRole } from "@/types";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<UserDto>;
  onFormChange: (data: Partial<UserDto>) => void;
  onSubmit: () => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
}: CreateUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <DialogDescription>Tạo tài khoản người dùng mới trong hệ thống</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="create-name">Họ và tên</Label>
            <Input
              id="create-name"
              value={formData.name || ""}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              placeholder="Nhập họ và tên"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-email">Email</Label>
            <Input
              id="create-email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-role">Vai trò</Label>
            <Select
              value={formData.role !== undefined ? String(formData.role) : String(UserRole.Passenger)}
              onValueChange={(value: string) => onFormChange({ ...formData, role: value as UserRole })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-md">
                <SelectItem value={String(UserRole.Passenger)}>Hành khách</SelectItem>
                <SelectItem value={String(UserRole.Staff)}>Nhân viên</SelectItem>
                <SelectItem value={String(UserRole.Admin)}>Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit} className="bg-success hover:bg-success/80">
            Tạo người dùng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
