'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserDto, UserRole, isUserRole } from '@/types';

interface AuthState {
  user: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
}

interface AuthContextType extends AuthState {
  login: (user: UserDto) => void;
  logout: () => void;
  hasRole: (requiredRole: UserRole | UserRole[]) => boolean;
  canAccess: (resource: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.Admin]: 3,
  [UserRole.Staff]: 2,
  [UserRole.Passenger]: 1,
};

function normalizeUserRole(role: unknown): UserRole | null {
  if (typeof role === 'number' && isUserRole(role)) return role;
  if (typeof role === 'string') {
    const r = role.trim().toLowerCase();
    if (r.includes('admin')) return UserRole.Admin;
    if (r.includes('staff')) return UserRole.Staff;
    if (r.includes('passenger') || r.includes('user')) return UserRole.Passenger;
    console.warn(`Unknown role string: "${role}", defaulting to Passenger`);
    return UserRole.Passenger; // Default to Passenger instead of null
  }
  if (role == null) return null;
  console.warn(`Unexpected role type: ${typeof role}`, role);
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    role: null,
  });

  useEffect(() => {
    // Initialize auth state from localStorage or session
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('gorail_user');
        if (storedUser) {
          const loaded = JSON.parse(storedUser) as UserDto;
          const normalizedRole = normalizeUserRole(loaded.role ?? null);
          const user: UserDto = { ...loaded, role: normalizedRole ?? undefined };
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            role: normalizedRole,
          });
        } else {
          // No stored user: end loading without auto-login
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = (user: UserDto) => {
    const normalizedRole = normalizeUserRole(user.role ?? null);
    const normalizedUser: UserDto = { ...user, role: normalizedRole ?? undefined };
    // Persist token if available on the user object
    localStorage.setItem('gorail_user', JSON.stringify(normalizedUser));
    setAuthState({
      user: normalizedUser,
      isLoading: false,
      isAuthenticated: true,
      role: normalizedRole,
    });
  };

  const logout = () => {
    localStorage.removeItem('gorail_user');
    localStorage.removeItem('userId'); // Also remove userId for backward compatibility
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      role: null,
    });
  };

  const hasRole = (requiredRole: UserRole | UserRole[]): boolean => {
    if (authState.role === null) return false;
    
    const userLevel = ROLE_HIERARCHY[authState.role];
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    return requiredRoles.some(role => {
      const requiredLevel = ROLE_HIERARCHY[role];
      return userLevel >= requiredLevel;
    });
  };

  const canAccess = (resource: string): boolean => {
    if (!authState.isAuthenticated) return false;
    
    // Define resource access rules
    const accessRules: Record<string, UserRole[]> = {
      '/admin': [UserRole.Admin],
      '/staff': [UserRole.Staff, UserRole.Admin],
      '/user': [UserRole.Passenger, UserRole.Staff, UserRole.Admin],
      '/booking': [UserRole.Passenger, UserRole.Staff, UserRole.Admin],
      '/my-tickets': [UserRole.Passenger, UserRole.Staff, UserRole.Admin],
    };

    const allowedRoles = accessRules[resource];
    return allowedRoles ? hasRole(allowedRoles) : false;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        ...authState, 
        login, 
        logout, 
        hasRole, 
        canAccess 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}