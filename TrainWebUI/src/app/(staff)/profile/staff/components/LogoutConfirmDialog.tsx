import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface LogoutConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirmLogout: () => void
}

export function LogoutConfirmDialog({ isOpen, onClose, onConfirmLogout }: LogoutConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Xác nhận đăng xuất</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn đăng xuất? Bạn sẽ cần đăng nhập lại để tiếp tục làm việc.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirmLogout}>
            Đăng xuất
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
