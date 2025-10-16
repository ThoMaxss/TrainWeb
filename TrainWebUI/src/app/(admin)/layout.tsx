'use client';

import { AdminGuard } from '@/components/auth/RouteGuard';
import { Shield, Users, Train, Ticket, User, LogOut, Menu, Bell, Settings } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { ToastProvider } from '@/components/ui/toast';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

// 🎨 Modern admin layout with top navigation
export default function AdminProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const navItems = [
    { href: '/admin-dashboard', icon: Shield, label: 'Dashboard' },
    { href: '/trains', icon: Train, label: 'Quản lý tàu' },
    { href: '/staff', icon: Users, label: 'Nhân viên' },
    { href: '/tickets', icon: Ticket, label: 'Quản lý vé' },
  ];

  return (
    <AdminGuard showFallback={true}>
      <ToastProvider>
      <div className="min-h-screen bg-background" role="main" aria-label="Admin Panel">
        
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
          <div className="max-w-[2000px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-6">
              
              {/* Logo & Brand */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
                  <p className="text-xs text-muted-foreground">TrainBooking System</p>
                </div>
              </div>

              {/* Navigation Links - Desktop */}
              <nav className="hidden lg:flex items-center gap-2" role="menubar">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-md'
                          : 'text-foreground hover:bg-muted hover:text-primary'
                      }`}
                      role="menuitem"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <ThemeToggle />
                
                <button className="p-2.5 rounded-lg hover:bg-muted transition-colors relative">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="flex items-center gap-3 pl-3 border-l border-border">
                  <Link 
                    href="/profile/admin"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="p-2.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    aria-label="Đăng xuất"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="max-w-[2000px] mx-auto px-6 py-8">
          {children}
        </main>
      </div>
      </ToastProvider>
    </AdminGuard>
  )
}
