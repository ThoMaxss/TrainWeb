'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserDto, UserRole } from '@/types';

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

const ROLE_HIERARCHY: Record<string, number> = {
  [UserRole.ADMIN]: 3,
  [UserRole.STAFF]: 2, 
  [UserRole.PASSENGER]: 1,
};

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
        const storedUser = localStorage.getItem('train_booking_user');
        if (storedUser) {
          const user = JSON.parse(storedUser) as UserDto;
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            role: user.role,
          });
        } else {
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
    localStorage.setItem('train_booking_user', JSON.stringify(user));
    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: true,
      role: user.role,
    });
  };

  const logout = () => {
    localStorage.removeItem('train_booking_user');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      role: null,
    });
  };

  const hasRole = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!authState.role) return false;
    
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
      '/admin': [UserRole.ADMIN],
      '/staff': [UserRole.STAFF, UserRole.ADMIN],
      '/user': [UserRole.PASSENGER, UserRole.STAFF, UserRole.ADMIN],
      '/booking': [UserRole.PASSENGER, UserRole.STAFF, UserRole.ADMIN],
      '/my-tickets': [UserRole.PASSENGER, UserRole.STAFF, UserRole.ADMIN],
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