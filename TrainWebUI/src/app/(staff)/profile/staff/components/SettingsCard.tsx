"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Settings, Globe, Lock, Bell, ChevronRight } from "lucide-react";
import { StaffThemeToggle } from "@/components/staff/StaffThemeToggle";

interface SettingsCardProps {
  language: string;
  setLanguage: (lang: string) => void;
  onChangePassword: () => void;
  notificationsEnabled?: boolean;
  onToggleNotifications?: () => void;
}

export function SettingsCard({
  language,
  setLanguage,
  onChangePassword,
  notificationsEnabled = true,
  onToggleNotifications,
}: SettingsCardProps) {
  return (
    <Card className="border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-5 w-5 text-success" />
          <h3 className="text-lg font-semibold">Cài đặt</h3>
        </div>

        <div className="space-y-4">
          {/* Language */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Globe className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Ngôn ngữ</p>
                <p className="text-sm text-muted-foreground">Chọn ngôn ngữ hiển thị</p>
              </div>
            </div>
            <div className="flex gap-2 ml-[52px]">
              <button
                onClick={() => setLanguage("vi")}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  language === "vi"
                    ? "bg-success text-white border-success"
                    : "bg-background border-border hover:border-success/50"
                }`}
              >
                Tiếng Việt
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  language === "en"
                    ? "bg-success text-white border-success"
                    : "bg-background border-border hover:border-success/50"
                }`}
              >
                English
              </button>
            </div>
          </div>

          <Separator />

          {/* Theme */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Settings className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Giao diện</p>
                <p className="text-sm text-muted-foreground">Chọn chế độ sáng hoặc tối</p>
              </div>
            </div>
            <div className="ml-[52px]">
              <StaffThemeToggle />
            </div>
          </div>

          <Separator />

          {/* Change Password */}
          <button
            onClick={onChangePassword}
            className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-success/10 transition-colors group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 group-hover:bg-success group-hover:text-white transition-colors">
              <Lock className="h-5 w-5 text-success group-hover:text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">Đổi mật khẩu</p>
              <p className="text-sm text-muted-foreground">Cập nhật mật khẩu của bạn</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-success" />
          </button>

          {/* Notifications */}
          {onToggleNotifications && (
            <>
              <Separator />
              <button
                onClick={onToggleNotifications}
                className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-success/10 transition-colors group"
              >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 group-hover:bg-success group-hover:text-white transition-colors">
                    <Bell className="h-5 w-5 text-success group-hover:text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">Thông báo</p>
                  <p className="text-sm text-muted-foreground">
                    {notificationsEnabled ? "Đang bật" : "Đang tắt"}
                  </p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notificationsEnabled ? "bg-success" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      notificationsEnabled ? "translate-x-6" : "translate-x-1"
                    } mt-0.5`}
                  />
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
