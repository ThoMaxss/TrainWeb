export enum UserRole {
  Passenger = 0,
  Staff = 1,
  Admin = 2
}

export interface UserEntity {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string; // Male, Female, Other
  idNumber?: string; // ID card / passport number
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  userRole: UserRole;
  profilePicture?: string;
  lastLoginAt?: string;
  failedLoginAttempts?: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  passwordHash?: string;
}

export interface UserDto {
  id?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  idNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  role?: UserRole;
  userRole?: UserRole;
  profilePicture?: string;
  lastLoginAt?: string;
  failedLoginAttempts?: number;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  // Alias for backward compatibility
  name?: string;
  token?: string; // Optional JWT token returned by backend
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    userRole: string;
  };
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Passenger]: 'Resident',
  [UserRole.Staff]: 'Manager',
  [UserRole.Admin]: 'Admin'
};

export function isUserRole(value: number): value is UserRole {
  return value >= 0 && value <= 2;
}
