'use client';

import React from 'react';
import { useAuth } from './AuthContext';
import { UserRole } from '@/types';

interface ConditionalRenderProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requireAuth?: boolean;
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * Conditional component that shows/hides content based on user role
 * Use this for UI elements that should be visible/hidden based on permissions
 */
export function ConditionalRender({ 
  children, 
  requiredRole, 
  requireAuth = false,
  fallback = null,
  className
}: ConditionalRenderProps) {
  const { isAuthenticated, hasRole, isLoading } = useAuth();

  // Show loading placeholder to prevent flicker
  if (isLoading) {
    return (
      <div className={`animate-pulse bg-muted rounded ${className}`} style={{ minHeight: '2rem' }}>
        <span className="sr-only">Đang tải...</span>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  return <div className={className}>{children}</div>;
}

// Specialized conditional renders for different roles
export function AdminOnly({ 
  children, 
  fallback = null, 
  className 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
  className?: string;
}) {
  return (
    <ConditionalRender 
      requiredRole={UserRole.Admin} 
      fallback={fallback}
      className={className}
    >
      {children}
    </ConditionalRender>
  );
}

export function StaffOnly({ 
  children, 
  fallback = null, 
  className 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
  className?: string;
}) {
  return (
    <ConditionalRender 
      requiredRole={[UserRole.Staff, UserRole.Admin]} 
      fallback={fallback}
      className={className}
    >
      {children}
    </ConditionalRender>
  );
}

export function AuthenticatedOnly({ 
  children, 
  fallback = null, 
  className 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
  className?: string;
}) {
  return (
    <ConditionalRender 
      requireAuth={true} 
      fallback={fallback}
      className={className}
    >
      {children}
    </ConditionalRender>
  );
}

export function GuestOnly({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-muted rounded ${className}`} style={{ minHeight: '2rem' }}>
        <span className="sr-only">Đang tải...</span>
      </div>
    );
  }

  return !isAuthenticated ? <div className={className}>{children}</div> : null;
}