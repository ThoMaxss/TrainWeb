import { Card } from "@/components/ui/card";
import { ChevronRight, Users, Train, BarChart3, Ticket, Database } from "lucide-react";

interface QuickLinksCardProps {
  onNavigate: (path: string) => void;
}

export function QuickLinksCard({ onNavigate }: QuickLinksCardProps) {
  return (
    <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
      <div className="p-6">
        <h3 className="mb-4 text-foreground font-semibold">Quản lý hệ thống</h3>

        <div className="space-y-3">
          <button 
            onClick={() => onNavigate("/admin-dashboard")}
            className="flex w-full items-center gap-3 rounded-lg border-2 border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/30 p-3 transition-all hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-600">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-violet-900 dark:text-violet-100">Dashboard</p>
              <p className="text-sm text-violet-700 dark:text-violet-300">Tổng quan hệ thống</p>
            </div>
            <ChevronRight className="h-5 w-5 text-violet-600 dark:text-violet-400" />
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
            className="flex w-full items-center gap-3 rounded-lg border-2 border-emerald-200 dark:border-emerald-800 bg-success/10 dark:bg-success/20 p-3 transition-all hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-success/20 dark:hover:bg-success/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success">
              <Train className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-emerald-900 dark:text-emerald-100">Quản lý tàu</p>
              <p className="text-sm text-success dark:text-emerald-300">Cấu hình tàu và tuyến đường</p>
            </div>
            <ChevronRight className="h-5 w-5 text-success" />
          </button>

          <button 
            onClick={() => onNavigate("/tickets")}
            className="flex w-full items-center gap-3 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-3 transition-all hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <Ticket className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-blue-900 dark:text-blue-100">Quản lý mẫu vé</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Cấu hình các loại vé</p>
            </div>
            <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </button>

          <button 
            onClick={() => onNavigate("/reports")}
            className="flex w-full items-center gap-3 rounded-lg border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/30 p-3 transition-all hover:border-orange-400 dark:hover:border-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600">
              <Database className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-orange-900 dark:text-orange-100">Báo cáo</p>
              <p className="text-sm text-orange-700 dark:text-orange-300">Thống kê và phân tích</p>
            </div>
            <ChevronRight className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </button>
        </div>
      </div>
    </Card>
  );
}
