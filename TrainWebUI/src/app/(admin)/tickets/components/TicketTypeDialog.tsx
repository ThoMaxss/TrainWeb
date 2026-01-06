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
import { TicketTypeDto } from "@/types";

interface TicketTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTicketType: TicketTypeDto | null;
  formData: TicketTypeDto;
  setFormData: (data: TicketTypeDto) => void;
  onSave: () => void;
}

export function TicketTypeDialog({
  open,
  onOpenChange,
  editingTicketType,
  formData,
  setFormData,
  onSave,
}: TicketTypeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingTicketType ? "Chỉnh sửa mẫu vé" : "Thêm mẫu vé mới"}
          </DialogTitle>
          <DialogDescription>
            {editingTicketType
              ? "Cập nhật thông tin mẫu vé"
              : "Tạo mẫu vé mới với tên và tỷ lệ giảm giá"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên mẫu vé <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Vd: Vé người lớn, Vé trẻ em, Vé sinh viên..."
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">
              Giảm giá (%) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="discount"
              type="number"
              min="0"
              max="100"
              step="1"
              value={formData.discountPercent !== undefined ? formData.discountPercent : ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setFormData({ 
                  ...formData, 
                  discountPercent: isNaN(value) ? 0 : value * 100
                });
                console.log(formData);
              }}
              placeholder="Nhập tỷ lệ giảm giá (0-100)"
              className="h-10"
            />
            
            <p className="text-xs text-muted-foreground">
              Nhập số từ 0 đến 100 (ví dụ: 20 = giảm 20%)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={onSave}
            disabled={!formData.name || formData.discountPercent === undefined}
          >
            {editingTicketType ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
