import { LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LogoutCardProps {
  onLogout: () => void;
}

export function LogoutCard({ onLogout }: LogoutCardProps) {
  return (
    <Card className="border-0 border-destructive/20 bg-error/10 shadow-md">
      <div className="p-2">
        <Button
          variant="destructive"
          size="lg"
          onClick={onLogout}
          className="w-full gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
        >
          <LogOut className="h-5 w-5" />
          Đăng xuất
        </Button>
        <p className="mt-2 text-center text-xs text-error">
          Bạn sẽ cần đăng nhập lại để sử dụng dịch vụ
        </p>
      </div>
    </Card>
  );
}
