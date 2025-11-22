import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutCardProps {
  onLogout: () => void;
}

export function LogoutCard({ onLogout }: LogoutCardProps) {
  return (
    <Card className="border-0 border-destructive/20 bg-destructive/10 shadow-md">
      <div className="p-6">
        <Button 
          variant="destructive" 
          size="lg" 
          onClick={onLogout}
          className="w-full gap-2 bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/80 hover:to-destructive/90"
        >
          <LogOut className="h-5 w-5" />
          Đăng xuất
        </Button>
        <p className="mt-3 text-center text-xs text-destructive dark:text-destructive/30">
          Kết thúc phiên làm việc quản trị
        </p>
      </div>
    </Card>
  );
}
