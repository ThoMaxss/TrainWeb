import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserDto, UserRole } from "@/types";

interface StaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: UserDto | null;
  formData: UserDto;
  setFormData: (data: UserDto) => void;
  onSave: () => void;
}

export function StaffDialog({
  open,
  onOpenChange,
  editingUser,
  formData,
  setFormData,
  onSave,
}: StaffDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</DialogTitle>
          <DialogDescription>
            {editingUser
              ? "Cập nhật thông tin và vai trò người dùng"
              : "Tạo tài khoản người dùng mới với tên, email và vai trò"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName || ""}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Nhập tên đầy đủ"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="nguoidung@example.com"
              className="h-10"
              disabled={!!editingUser}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              Số điện thoại
            </Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="0123456789"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">
              Giới tính
            </Label>
            <Select
              value={formData.gender || ""}
              onValueChange={(v) => setFormData({ ...formData, gender: v })}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Nam</SelectItem>
                <SelectItem value="Female">Nữ</SelectItem>
                <SelectItem value="Other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">
              Địa chỉ
            </Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Nhập địa chỉ"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">
              Ngày sinh
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth?.split('T')[0] || ""}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idNumber">
              Số CMND/Hộ chiếu
            </Label>
            <Input
              id="idNumber"
              value={formData.idNumber || ""}
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              placeholder="Nhập số CMND hoặc hộ chiếu"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label>
              Vai trò <span className="text-destructive">*</span>
            </Label>
            <Select
              value={String(formData.role)}
              onValueChange={(v) =>
                setFormData({ ...formData, role: Number(v) as UserRole })
              }
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(UserRole.Admin)}>Quản trị viên</SelectItem>
                <SelectItem value={String(UserRole.Staff)}>Quản lý</SelectItem>
                <SelectItem value={String(UserRole.Passenger)}>Hành khách</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            onClick={onSave}
            disabled={!formData.name || !formData.email}
          >
            {editingUser ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
