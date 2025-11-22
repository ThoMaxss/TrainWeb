import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutCardProps {
  onLogout: () => void;
}

export function LogoutCard({ onLogout }: LogoutCardProps) {
  return (
    <Card className="bg-background/70 backdrop-blur-sm border-2 border-destructive/20 dark:border-destructive/30 shadow-sm">
      <div className="p-6">
        <Button 
          variant="destructive" 
          size="lg" 
          onClick={onLogout}
          className="w-full gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
        >
          <LogOut className="h-5 w-5" />
          Đăng xuất
        </Button>
        <p className="mt-3 text-center text-xs text-destructive dark:text-red-400">
          Kết thúc phiên làm việc quản trị
        </p>
      </div>
    </Card>
  );
}
