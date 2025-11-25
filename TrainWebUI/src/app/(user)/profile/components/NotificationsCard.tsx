import { Bell, Shield, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface NotificationsCardProps {
  notificationsEnabled: boolean;
  onNotificationsChange: (enabled: boolean) => void;
}

export function NotificationsCard({
  notificationsEnabled,
  onNotificationsChange,
}: NotificationsCardProps) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="p-2">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Bell className="h-5 w-5 text-warning" />
          </div>
          <h3 className="text-foreground">Thông báo & Quyền riêng tư</h3>
        </div>

        <div className="space-y-3">
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between rounded-lg p-2 hover:bg-card transition-colors">
            <div className="flex-1">
              <p className="font-medium">Nhận thông báo</p>
              <p className="text-sm text-muted-foreground">
                Nhận cập nhật về chuyến đi và khuyến mãi
              </p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 accent-primary"
              checked={notificationsEnabled}
              onChange={(e) => onNotificationsChange(e.target.checked)}
            />
          </div>

          <Separator />

          {/* Privacy Policy */}
          <button className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-card transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Chính sách bảo mật</p>
                <p className="text-sm text-muted-foreground">Xem chính sách của chúng tôi</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </Card>
  );
}
