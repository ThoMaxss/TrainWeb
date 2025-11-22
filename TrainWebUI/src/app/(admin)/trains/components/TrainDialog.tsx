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
import { TrainDto } from "@/types";

interface TrainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTrain: TrainDto | null;
  formData: TrainDto;
  setFormData: (data: TrainDto) => void;
  onSave: () => void;
}

export function TrainDialog({
  open,
  onOpenChange,
  editingTrain,
  formData,
  setFormData,
  onSave,
}: TrainDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingTrain ? "Chỉnh sửa tàu" : "Thêm tàu mới"}</DialogTitle>
          <DialogDescription>
            {editingTrain
              ? "Cập nhật thông tin tàu"
              : "Tạo thông tin tàu mới với tên và loại tàu"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên tàu <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên tàu"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">
              Loại tàu <span className="text-destructive">*</span>
            </Label>
            <Input
              id="type"
              value={formData.type || ""}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="Nhập loại tàu"
              className="h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={onSave}
            disabled={!formData.name || !formData.type}
          >
            {editingTrain ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
