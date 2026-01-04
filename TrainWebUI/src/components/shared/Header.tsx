// 🎨 Role-aware Header component with unified navigation across roles
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { H3 } from "@/components/ui/typography";
import { Train, Menu, X, Search, LogOut } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils/utils";
import { useAuth } from "@/components/auth/AuthContext";
import { USER_ROLE_LABELS, type UserRole } from "@/types";
import { navAdmin, navCommon, navStaff, navUser, accountMenu } from "@/config/nav";
import { API_CONFIG } from '@/lib/api/config';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { user, role, isAuthenticated, logout } = useAuth();
  const [lastApiError, setLastApiError] = useState<{ attemptedUrl: string; expectedBase: string; time: string; message: string } | null>(null);

  // ✅ fallback role (role có thể null khi chưa load)
  const roleKey: UserRole = (role ?? "passenger") as UserRole;

  const roleNav = useMemo(() => {
    if (roleKey === "admin") return navAdmin;
    if (roleKey === "staff") return navStaff;
    return navUser;
  }, [roleKey]);

  const navItems = useMemo(() => {
    // Admin và Staff không dùng navCommon (Trang chủ, Tìm kiếm, Vé của tôi)
    if (roleKey === "admin" || roleKey === "staff") return roleNav;
    // Passenger vẫn dùng navCommon
    return [...navCommon, ...roleNav];
  }, [roleNav, roleKey]);

  const getProfileUrl = useMemo(() => {
    if (roleKey === "admin") return "/profile/admin";
    if (roleKey === "staff") return "/profile/staff";
    return "/profile";
  }, [roleKey]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
  }, [mobileMenuOpen]);

  // Listen to runtime API failure events for dev debugging
  useEffect(() => {
    function handle(e: Event) {
      // Use typed access to the global debug var
      const win = window as unknown as { __GORAIL_LAST_API_ERROR?: { attemptedUrl: string; expectedBase: string; time: string; message: string } };
      const d = e instanceof CustomEvent ? e.detail : win.__GORAIL_LAST_API_ERROR;
      if (d) setLastApiError(d);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("gorail:lastApiError", handle as EventListener);
      // seed initial value
      // Seed initial value from global debug var if present
      const win = window as unknown as { __GORAIL_LAST_API_ERROR?: { attemptedUrl: string; expectedBase: string; time: string; message: string } };
      if (win.__GORAIL_LAST_API_ERROR) setLastApiError(win.__GORAIL_LAST_API_ERROR);
    }
    return () => window.removeEventListener("gorail:lastApiError", handle as EventListener);
  }, []);

  return (
    <header className="sticky top-0 z-[30] w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8 gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity flex-shrink-0"
          aria-label="GoRail - Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Train className="h-6 w-6" />
          </div>
          <span className="hidden sm:block text-xl font-bold text-gray-900 tracking-tight">GoRail</span>
        </Link>

        <nav className="hidden lg:flex items-center justify-center gap-2 flex-1 max-w-2xl mx-auto" role="navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-muted/50",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
              {item.badge && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-accent text-accent-foreground rounded">
                  {item.badge}
                </span>
              )}
              {pathname === item.href && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 lg:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-9 w-9"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Quick search"
          >
            <Search className="h-4 w-4" />
          </Button>

          <ThemeToggle variant="simple" />

          {isAuthenticated && <NotificationBell />}

          {isAuthenticated && user ? (
            <div className="hidden lg:block relative">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-medium">
                  {(user.name ?? user.email ?? "U").charAt(0).toUpperCase()}
                </div>
                <span className="text-sm">{user.name ?? user.email}</span>
              </Button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border bg-card shadow-lg z-50 py-1">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{user.name ?? user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {USER_ROLE_LABELS[roleKey]}
                      </p>
                    </div>

                    {accountMenu.map((item) => {
                      // Điều chỉnh href cho profile dựa trên role
                      let href = item.href;
                      if (item.href === "/profile") href = getProfileUrl;

                      return (
                        <Link
                          key={item.href}
                          href={href}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          {item.icon && <item.icon className="h-4 w-4" />}
                          {item.label}
                        </Link>
                      );
                    })}

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors w-full text-left text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="px-6">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-6">
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t bg-background/95 backdrop-blur">
          <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto">
              <input
                type="search"
                placeholder="Search trains, stations..."
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed top-[3.5rem] right-0 bottom-0 w-[80%] max-w-sm bg-background border-l z-50 lg:hidden transition-transform duration-300 ease-in-out overflow-y-auto",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="flex flex-col p-4 gap-1">
          {isAuthenticated && user ? (
            <div className="mb-4 p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-medium">
                  {(user.name ?? user.email ?? "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm">{user.name ?? user.email}</p>
                  <p className="text-xs text-muted-foreground">{USER_ROLE_LABELS[roleKey]}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={getProfileUrl} className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Hồ sơ
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-4 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full justify-start bg-gradient-to-r from-primary to-secondary">
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
              {item.badge && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] font-semibold bg-accent text-accent-foreground rounded">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
