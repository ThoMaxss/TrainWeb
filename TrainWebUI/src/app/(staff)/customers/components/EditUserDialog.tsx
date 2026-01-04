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

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<UserDto>;
  onFormChange: (data: Partial<UserDto>) => void;
  onSubmit: () => void;
}

export function EditUserDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
}: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          <DialogDescription>Cập nhật thông tin người dùng</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Họ và tên</Label>
            <Input
              id="edit-name"
              value={formData.name || ""}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role">Vai trò</Label>
            <Select
              value={formData.role !== undefined ? String(formData.role) : String(UserRole.Passenger)}
              onValueChange={(value: string) => onFormChange({ ...formData, role: Number(value) as UserRole })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
