"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import type { UserRole } from "@/types/user";
import { AlertCircle, Lock, User as UserIcon } from "lucide-react";
import { H2, Body } from "@/components/ui/typography";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requireAuth?: boolean;
  fallbackPath?: string; // nơi redirect nếu showFallback = false
  showFallback?: boolean; // true => show UI AccessDenied, false => redirect
}

interface LoadingSkeletonProps {
  className?: string;
}

type IconComponent = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

function roleLabel(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Admin";
    case "staff":
      return "Staff";
    case "passenger":
      return "Passenger";
    default:
      return "User";
  }
}

function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className || ""}`}>
      <div className="h-8 bg-muted rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    </div>
  );
}

function AccessDenied({ message, icon: Icon = Lock }: { message: string; icon?: IconComponent }) {
  return (
    <div
      className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center bg-destructive/10 border-2 border-destructive/20 rounded-xl"
      role="alert"
      aria-labelledby="access-denied-title"
      aria-describedby="access-denied-message"
    >
      <Icon className="h-16 w-16 text-destructive mb-4" aria-hidden />
      <H2 id="access-denied-title" className="text-destructive mb-3">
        Truy cập bị từ chối
      </H2>
      <Body id="access-denied-message" className="text-destructive/80 max-w-md">
        {message}
      </Body>

      <button
        onClick={() => (window.location.href = "/")}
        className="mt-6 px-6 py-3 bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors font-semibold"
      >
        Về trang chủ
      </button>
    </div>
  );
}

export function RouteGuard({
  children,
  requiredRole,
  requireAuth = true,
  fallbackPath = "/login",
  showFallback = true,
}: RouteGuardProps) {
  // AuthContext của bạn nên trả:
  // - isLoading: boolean
  // - isAuthenticated: boolean
  // - role: UserRole | null
  // - hasRole(roles: UserRole[]): boolean
  const { isLoading, isAuthenticated, hasRole, role } = useAuth();
  const router = useRouter();

  const requiredRoles = useMemo<UserRole[] | null>(() => {
    if (!requiredRole) return null;
    return Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  }, [requiredRole]);

  const needAuthButNotLoggedIn = requireAuth && !isAuthenticated;
  const roleDenied = !!requiredRoles && !hasRole(requiredRoles);

  useEffect(() => {
    if (isLoading) return;

    if (!showFallback) {
      if (needAuthButNotLoggedIn) {
        router.replace(fallbackPath);
        return;
      }

      if (roleDenied) {
        const dest =
          role === "admin"
            ? "/admin-dashboard"
            : role === "staff"
              ? "/staff-dashboard"
              : "/search";

        router.replace(dest);
      }
    }
  }, [isLoading, showFallback, needAuthButNotLoggedIn, fallbackPath, roleDenied, role, router]);

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <LoadingSkeleton className="max-w-4xl mx-auto" />
      </div>
    );
  }

  // Not authenticated
  if (needAuthButNotLoggedIn) {
    if (showFallback) {
      return <AccessDenied message="Bạn cần đăng nhập để truy cập trang này." icon={UserIcon} />;
    }
    return null;
  }

  // Role denied
  if (roleDenied) {
    if (showFallback) {
      const roleNames = requiredRoles!.map(roleLabel).join(", ");
      return (
        <AccessDenied message={`Bạn cần quyền ${roleNames} để truy cập trang này.`} icon={AlertCircle} />
      );
    }
    return null;
  }

  return <>{children}</>;
}

// Specialized guards
export function AdminGuard({
  children,
  showFallback = true,
}: {
  children: React.ReactNode;
  showFallback?: boolean;
}) {
  return (
    <RouteGuard requiredRole="admin" showFallback={showFallback}>
      {children}
    </RouteGuard>
  );
}

export function StaffGuard({
  children,
  showFallback = true,
}: {
  children: React.ReactNode;
  showFallback?: boolean;
}) {
  // staff được vào + admin được vào
  return (
    <RouteGuard requiredRole={["staff", "admin"]} showFallback={showFallback}>
      {children}
    </RouteGuard>
  );
}

export function UserGuard({
  children,
  showFallback = true,
}: {
  children: React.ReactNode;
  showFallback?: boolean;
}) {
  // user/passenger + staff + admin
  return (
    <RouteGuard requiredRole={["passenger", "staff", "admin"]} showFallback={showFallback}>
      {children}
    </RouteGuard>
  );
}
