import { Card } from "@/components/ui/card";
import { ChevronRight, Users, Train, BarChart3, Ticket, Database } from "lucide-react";

interface QuickLinksCardProps {
  onNavigate: (path: string) => void;
}

export function QuickLinksCard({ onNavigate }: QuickLinksCardProps) {
  return (
    <Card className="border">
      <div className="p-6">
        <h3 className="mb-4 text-foreground font-semibold">Quản lý hệ thống</h3>

        <div className="space-y-3">
          <button 
            onClick={() => onNavigate("/admin-dashboard")}
            className="flex w-full items-center gap-3 rounded-lg border-2 border-secondary/20 dark:border-secondary/80 bg-secondary/10 dark:bg-secondary/20 p-3 transition-all hover:border-secondary/40 dark:hover:border-secondary/60 hover:bg-secondary/20 dark:hover:bg-secondary/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-secondary/90 dark:text-secondary/30">Dashboard</p>
              <p className="text-sm text-secondary dark:text-secondary/30">Tổng quan hệ thống</p>
            </div>
            <ChevronRight className="h-5 w-5 text-secondary dark:text-secondary/30" />
          </button>

          <button 
            onClick={() => onNavigate("/staff")}
            className="flex w-full items-center gap-3 rounded-lg border-2 border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 p-3 transition-all hover:border-primary/40 dark:hover:border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-primary">Quản lý nhân viên</p>
              <p className="text-sm text-primary/80">Xem và quản lý nhân viên</p>
            </div>
            <ChevronRight className="h-5 w-5 text-primary" />
          </button>

          <button 
            onClick={() => onNavigate("/trains")}
            className="flex w-full items-center gap-3 rounded-lg border-2 border-success/20 dark:border-success/80 bg-success/10 dark:bg-success/20 p-3 transition-all hover:border-success/40 dark:hover:border-success/60 hover:bg-success/20 dark:hover:bg-success/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success">
              <Train className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-success/90 dark:text-success/30">Quản lý tàu</p>
              <p className="text-sm text-success dark:text-success/30">Cấu hình tàu và tuyến đường</p>
            </div>
            <ChevronRight className="h-5 w-5 text-success" />
          </button>

          <button 
            onClick={() => onNavigate("/tickets")}
            className="flex w-full items-center gap-3 rounded-lg border-2 border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 p-3 transition-all hover:border-primary/40 dark:hover:border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Ticket className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-primary">Quản lý mẫu vé</p>
              <p className="text-sm text-primary/80 dark:text-primary/30">Cấu hình các loại vé</p>
            </div>
            <ChevronRight className="h-5 w-5 text-primary" />
          </button>

          <button 
            onClick={() => onNavigate("/reports")}
            className="flex w-full items-center gap-3 rounded-lg border-2 border-accent/20 dark:border-accent/80 bg-accent/10 dark:bg-accent/20 p-3 transition-all hover:border-accent/40 dark:hover:border-accent/60 hover:bg-accent/20 dark:hover:bg-accent/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
              <Database className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-accent/90 dark:text-accent/30">Báo cáo</p>
              <p className="text-sm text-accent dark:text-accent/30">Thống kê và phân tích</p>
            </div>
            <ChevronRight className="h-5 w-5 text-accent dark:text-accent/30" />
          </button>
        </div>
      </div>
    </Card>
  );
}
