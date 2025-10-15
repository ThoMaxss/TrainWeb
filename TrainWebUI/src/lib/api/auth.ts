import { apiFetch } from './config';
import { UserEntity, UserDto, User, CheckRoleResponse } from '@/types';

// Auth endpoints based on backend documentation

// POST /api/auth/login - Email-only login
export async function login(email: string): Promise<UserEntity> {
  return apiFetch<UserEntity>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(email), // Raw JSON string as per backend
  });
}

// POST /api/auth/register - Register user
export async function register(userData: UserEntity): Promise<string> {
  return apiFetch<string>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// GET /api/auth/check-role - Check if user has specific role
export async function checkRole(userId: string, role: string): Promise<CheckRoleResponse> {
  const params = new URLSearchParams({ userId, role });
  return apiFetch<CheckRoleResponse>(`/auth/check-role?${params}`);
}
