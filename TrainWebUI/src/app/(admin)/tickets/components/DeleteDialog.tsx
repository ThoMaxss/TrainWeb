import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TicketTypeDto } from "@/types";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketType: TicketTypeDto | null;
  onConfirm: () => void;
}

export function DeleteDialog({
  open,
  onOpenChange,
  ticketType,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Xóa mẫu vé
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa mẫu vé <strong>{ticketType?.name}</strong>?
            <br />
            Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn mẫu vé khỏi hệ thống.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
