import { Ticket, Receipt, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface QuickLinksCardProps {
  onMyTickets: () => void;
  onTransactions: () => void;
}

export function QuickLinksCard({ onMyTickets, onTransactions }: QuickLinksCardProps) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="p-2">
        <h3 className="mb-3 text-foreground">Liên kết nhanh</h3>

        <div className="space-y-3">
          <button
            onClick={onMyTickets}
            className="flex w-full items-center gap-3 rounded-lg border-2 border-primary bg-primary/10 p-2 transition-all hover:border-primary hover:bg-primary/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Ticket className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-primary">Vé của tôi</p>
              <p className="text-sm text-primary">Xem và quản lý vé đã đặt</p>
            </div>
            <ChevronRight className="h-5 w-5 text-primary" />
          </button>

          <button
            onClick={onTransactions}
            className="flex w-full items-center gap-3 rounded-lg border-2 border-emerald-200 bg-success/10 p-2 transition-all hover:border-emerald-400 hover:bg-success/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success">
              <Receipt className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-emerald-900">Giao dịch của tôi</p>
              <p className="text-sm text-success">Xem lịch sử thanh toán</p>
            </div>
            <ChevronRight className="h-5 w-5 text-success" />
          </button>
        </div>
      </div>
    </Card>
  );
}
