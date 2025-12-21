export enum UserRole {
  Passenger = 0,
  Staff = 1,
  Admin = 2
}

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  passwordHash?: string;
}

export interface UserDto {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  createdAt?: string;
  token?: string; // Optional JWT token returned by backend
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  role: string;
  email?: string;
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Passenger]: 'Resident',
  [UserRole.Staff]: 'Manager',
  [UserRole.Admin]: 'Admin'
};

export function isUserRole(value: number): value is UserRole {
  return value >= 0 && value <= 2;
}
