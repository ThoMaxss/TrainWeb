'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { UserRole } from '@/types';
import { AlertCircle, Lock, User } from 'lucide-react';
import { H2, Body } from '@/components/ui/typography';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requireAuth?: boolean;
  fallbackPath?: string;
  showFallback?: boolean;
}

interface LoadingSkeletonProps {
  className?: string;
}

function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-8 bg-muted rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    </div>
  );
}

function AccessDenied({ message, icon: Icon = Lock }: { message: string; icon?: React.ComponentType<any> }) {
  return (
    <div 
      className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center bg-destructive/10 border-2 border-destructive/20 rounded-xl"
      role="alert"
      aria-labelledby="access-denied-title"
      aria-describedby="access-denied-message"
    >
      <Icon 
        className="h-16 w-16 text-destructive mb-4" 
        aria-hidden="true"
      />
      <H2 
        id="access-denied-title" 
        className="text-destructive mb-3"
      >
        Truy cập bị từ chối
      </H2>
      <Body 
        id="access-denied-message" 
        className="text-destructive/80 max-w-md"
      >
        {message}
      </Body>
      <button 
        onClick={() => window.history.back()}
        className="mt-6 px-6 py-3 bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors font-semibold"
        aria-label="Quay lại trang trước"
      >
        Quay lại
      </button>
    </div>
  );
}

export function RouteGuard({ 
  children, 
  requiredRole, 
  requireAuth = true, 
  fallbackPath = '/login',
  showFallback = true 
}: RouteGuardProps) {
  const { isLoading, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  // Loading state - prevent flicker
  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <LoadingSkeleton className="max-w-4xl mx-auto" />
      </div>
    );
  }

  // Authentication required but user not authenticated
  if (requireAuth && !isAuthenticated) {
    if (showFallback) {
      return (
        <AccessDenied 
          message="Bạn cần đăng nhập để truy cập trang này."
          icon={User}
        />
      );
    } else {
      router.replace(fallbackPath);
      return null;
    }
  }

  // Role-based access control
  if (requiredRole && !hasRole(requiredRole)) {
    if (showFallback) {
      const roleNames = Array.isArray(requiredRole) 
        ? requiredRole.join(', ') 
        : requiredRole;
      return (
        <AccessDenied 
          message={`Bạn cần quyền ${roleNames} để truy cập trang này.`}
          icon={AlertCircle}
        />
      );
    } else {
      router.replace('/');
      return null;
    }
  }

  return <>{children}</>;
}

// Specialized guards for different roles
export function AdminGuard({ children, showFallback = true }: { children: React.ReactNode; showFallback?: boolean }) {
  return (
    <RouteGuard 
      requiredRole={UserRole.ADMIN} 
      showFallback={showFallback}
    >
      {children}
    </RouteGuard>
  );
}

export function StaffGuard({ children, showFallback = true }: { children: React.ReactNode; showFallback?: boolean }) {
  return (
    <RouteGuard 
      requiredRole={[UserRole.STAFF, UserRole.ADMIN]} 
      showFallback={showFallback}
    >
      {children}
    </RouteGuard>
  );
}

export function UserGuard({ children, showFallback = true }: { children: React.ReactNode; showFallback?: boolean }) {
  return (
    <RouteGuard 
      requiredRole={[UserRole.PASSENGER, UserRole.STAFF, UserRole.ADMIN]} 
      showFallback={showFallback}
    >
      {children}
    </RouteGuard>
  );
}