import { Settings as SettingsIcon, Globe, Sun, Moon, Lock, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface SettingsCardProps {
  language: string;
  theme: "light" | "dark";
  onLanguageChange: (lang: string) => void;
  onThemeChange: (theme: "light" | "dark") => void;
  onChangePassword: () => void;
}

export function SettingsCard({
  language,
  theme,
  onLanguageChange,
  onThemeChange,
  onChangePassword,
}: SettingsCardProps) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="p-2">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
            <SettingsIcon className="h-5 w-5 text-secondary" />
          </div>
          <h3 className="text-foreground">Cài đặt</h3>
        </div>

        <div className="space-y-3">
          {/* Language */}
          <div className="flex items-center justify-between rounded-lg p-2 hover:bg-card transition-colors">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Ngôn ngữ</p>
                <p className="text-sm text-muted-foreground">Chọn ngôn ngữ hiển thị</p>
              </div>
            </div>
            <select
              className="border rounded px-2 py-2"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          <Separator />

          {/* Theme */}
          <div className="flex items-center justify-between rounded-lg p-2 hover:bg-card transition-colors">
            <div className="flex items-center gap-3">
              {theme === "light" ? (
                <Sun className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Giao diện</p>
                <p className="text-sm text-muted-foreground">{theme === "light" ? "Sáng" : "Tối"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => onThemeChange("light")}
                className="gap-2"
              >
                <Sun className="h-4 w-4" />
                Sáng
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => onThemeChange("dark")}
                className="gap-2"
              >
                <Moon className="h-4 w-4" />
                Tối
              </Button>
            </div>
          </div>

          <Separator />

          {/* Change Password */}
          <button
            onClick={onChangePassword}
            className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-card transition-colors"
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
        </div>
      </div>
    </Card>
  );
}
