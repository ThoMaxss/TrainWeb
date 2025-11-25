import { ChevronRight } from "lucide-react";

interface ProfileHeaderProps {
  onBack: () => void;
}

export function ProfileHeader({ onBack }: ProfileHeaderProps) {
  return (
    <div className="border-b bg-background shadow-sm">
      <div className="container mx-auto px-2 lg:px-2 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-card transition-colors"
          >
            <ChevronRight className="h-5 w-5 rotate-180 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-primary">Tài khoản của tôi</h1>
            <p className="text-sm text-muted-foreground">Quản lý thông tin cá nhân và cài đặt</p>
          </div>
        </div>
      </div>
    </div>
  );
}
