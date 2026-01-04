import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TripDto } from "@/types";
import { AlertCircle } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripDto | null;
  onConfirm: () => void;
}

export function DeleteDialog({ open, onOpenChange, trip, onConfirm }: DeleteDialogProps) {
  if (!trip) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Xác nhận xóa lịch trình</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-3">
            Bạn có chắc chắn muốn xóa lịch trình tàu{" "}
            <strong>{trip.train?.name || "—"}</strong> (
            {trip.originStation} → {trip.destinationStation})?
            <br />
            <br />
            Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan đến lịch trình này.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xóa lịch trình
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
