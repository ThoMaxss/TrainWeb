import { UserRole } from './common';

// Main User DTO matching backend
export interface UserDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  dateOfBirth?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Simplified User type (for backward compatibility with old API code)
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Passenger' | 'Staff' | 'Admin';
  createdAt: string;
}

// Alias for UserDto (for backward compatibility)
export interface UserEntity extends UserDto {}

// Auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}

// Role check response
export interface CheckRoleResponse {
  userId: string;
  role: string;
  hasRole: boolean;
}
