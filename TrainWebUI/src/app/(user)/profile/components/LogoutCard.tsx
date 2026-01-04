"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, AlertTriangle } from "lucide-react";

interface LogoutCardProps {
  onLogout: () => void;
}

export function LogoutCard({ onLogout }: LogoutCardProps) {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="text-lg font-semibold">Khu vực nguy hiểm</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Đăng xuất khỏi tài khoản của bạn. Bạn sẽ cần đăng nhập lại để tiếp tục.
        </p>

        <Button
          onClick={onLogout}
          variant="destructive"
          className="w-full"
          size="lg"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Đăng xuất
        </Button>
      </div>
    </Card>
  );
}
