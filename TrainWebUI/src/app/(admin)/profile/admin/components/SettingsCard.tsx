import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Globe, Lock, Shield, ChevronRight } from "lucide-react";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";

interface SettingsCardProps {
  language: string;
  setLanguage: (lang: string) => void;
  onChangePassword: () => void;
}

export function SettingsCard({ language, setLanguage, onChangePassword }: SettingsCardProps) {
  return (
    <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
            <Settings className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-foreground font-semibold">Cài đặt</h3>
        </div>

        <div className="space-y-3">
          {/* Language */}
          <div className="flex items-center justify-between rounded-lg p-3 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Ngôn ngữ</p>
                <p className="text-sm text-muted-foreground">Chọn ngôn ngữ hiển thị</p>
              </div>
            </div>
            <select 
              className="border rounded px-3 py-2 bg-background text-sm" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          <Separator />

          {/* Theme */}
          <AdminThemeToggle />

          <Separator />

          {/* Change Password */}
          <button 
            onClick={onChangePassword}
            className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Đổi mật khẩu</p>
                <p className="text-sm text-muted-foreground">Cập nhật mật khẩu của bạn</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <Separator />

          {/* Security */}
          <button className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Bảo mật</p>
                <p className="text-sm text-muted-foreground">Xác thực hai yếu tố, phiên đăng nhập</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </Card>
  );
}
