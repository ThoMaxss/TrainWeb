'use client';

import { StaffGuard } from '@/components/auth/RouteGuard';
import { Briefcase, Users, Ticket, QrCode, RefreshCw, BarChart3, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';

// 🎨 Enhanced staff layout with unified design system and security
export default function StaffProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <StaffGuard showFallback={true}>
      <div className="flex h-screen bg-card" role="main" aria-label="Staff Portal">
        {/* Staff Sidebar */}
        <aside 
          className="w-64 bg-background border-r-2 border-border p-2 shadow-lg"
          role="navigation"
          aria-label="Staff Navigation"
        >
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="h-6 w-6 text-success" aria-hidden="true" />
              <h1 className="text-xl font-bold text-foreground">Staff Portal</h1>
            </div>
            <p className="text-sm text-muted-foreground">Chào mừng, {user?.name}</p>
          </div>
          
          <nav className="space-y-2" role="menubar">
            <Link 
              href="/staff-dashboard" 
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-success/10 text-foreground hover:text-success font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-green-500 min-h-[48px]"
              role="menuitem"
              aria-label="Trang tổng quan nhân viên"
            >
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
              Dashboard
            </Link>
            <Link 
              href="/customers" 
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-success/10 text-foreground hover:text-success font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-green-500 min-h-[48px]"
              role="menuitem"
              aria-label="Quản lý khách hàng"
            >
              <Users className="h-5 w-5" aria-hidden="true" />
              Khách hàng
            </Link>
            <Link 
              href="/manage-tickets" 
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-success/10 text-foreground hover:text-success font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-green-500 min-h-[48px]"
              role="menuitem"
              aria-label="Quản lý vé tàu"
            >
              <Ticket className="h-5 w-5" aria-hidden="true" />
              Quản lý vé
            </Link>
            <Link 
              href="/qr-check" 
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-success/10 text-foreground hover:text-success font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-green-500 min-h-[48px]"
              role="menuitem"
              aria-label="Kiểm tra mã QR"
            >
              <QrCode className="h-5 w-5" aria-hidden="true" />
              Kiểm tra QR
            </Link>
            <Link 
              href="/refunds" 
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-success/10 text-foreground hover:text-success font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-green-500 min-h-[48px]"
              role="menuitem"
              aria-label="Xử lý hoàn tiền"
            >
              <RefreshCw className="h-5 w-5" aria-hidden="true" />
              Hoàn tiền
            </Link>
            <Link 
              href="/reports" 
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-success/10 text-foreground hover:text-success font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-green-500 min-h-[48px]"
              role="menuitem"
              aria-label="Báo cáo thống kê"
            >
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
              Báo cáo
            </Link>
            <Link 
              href="/profile/staff" 
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-success/10 text-foreground hover:text-success font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-green-500 min-h-[48px]"
              role="menuitem"
              aria-label="Hồ sơ cá nhân"
            >
              <User className="h-5 w-5" aria-hidden="true" />
              Profile
            </Link>
          </nav>

          <div className="mt-5 pt-3 border-t border-border">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-error/10 text-foreground hover:text-error font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-red-500 min-h-[48px] w-full"
              aria-label="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
              Đăng xuất
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-card" role="main">
          {children}
        </main>
      </div>
    </StaffGuard>
  )
}
