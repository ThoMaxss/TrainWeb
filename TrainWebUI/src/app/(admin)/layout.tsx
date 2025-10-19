'use client';

import { AdminGuard } from '@/components/auth/RouteGuard';
import { Shield, Users, Train, Ticket, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { ToastProvider } from '@/components/ui/toast';

// 🎨 Enhanced admin layout with unified design system and security
export default function AdminProfileLayout({
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
    <AdminGuard showFallback={true}>
      <ToastProvider>
      <div className="flex h-screen bg-card" role="main" aria-label="Admin Panel">
        {/* Admin Sidebar */}
        <aside 
          className="w-64 bg-background border-r-2 border-border p-2 shadow-lg"
          role="navigation"
          aria-label="Admin Navigation"
        >
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
              <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            </div>
            <p className="text-sm text-muted-foreground">Chào mừng, {user?.name}</p>
          </div>
          
          <nav className="space-y-2" role="menubar">
            <Link 
              href="/admin-dashboard" 
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-primary/10 text-foreground hover:text-primary font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[48px]"
              role="menuitem"
              aria-label="Trang tổng quan Admin"
            >
              <Users className="h-5 w-5" aria-hidden="true" />
              Dashboard
            </Link>
            <Link 
              href="/trains" 
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-primary/10 text-foreground hover:text-primary font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[48px]"
              role="menuitem"
              aria-label="Quản lý tàu hỏa"
            >
              <Train className="h-5 w-5" aria-hidden="true" />
              Quản lý tàu
            </Link>
            <Link 
              href="/staff" 
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-primary/10 text-foreground hover:text-primary font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[48px]"
              role="menuitem"
              aria-label="Quản lý nhân viên"
            >
              <Users className="h-5 w-5" aria-hidden="true" />
              Quản lý nhân viên
            </Link>
            <Link 
              href="/tickets" 
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-primary/10 text-foreground hover:text-primary font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[48px]"
              role="menuitem"
              aria-label="Quản lý vé tàu"
            >
              <Ticket className="h-5 w-5" aria-hidden="true" />
              Quản lý vé
            </Link>
            <Link 
              href="/profile/admin" 
              className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-primary/10 text-foreground hover:text-primary font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[48px]"
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
      </ToastProvider>
    </AdminGuard>
  )
}
