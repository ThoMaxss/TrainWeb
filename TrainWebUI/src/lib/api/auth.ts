import { apiFetch } from './config';
import { AuthResponse, RegisterRequest, LoginRequest } from '@/types';

interface CheckRoleResponse {
  hasRole: boolean;
}

// Auth endpoints based on backend documentation

// POST /api/Auth/login - Login with email & password
// Request: { email: string; password: string }
// Response: { message: string; token: string; role: string }
export async function login(payload: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/Auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// POST /api/Auth/register - Register user
// Request: { name, email, password, role? }
// Response: { message, email, role }
export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/Auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// GET /api/Auth/check-role - Undocumented helper (if backend supports)
// Note: This endpoint is not present in API_DOCUMENTATION.md
export async function checkRole(userId: string, role: string): Promise<CheckRoleResponse> {
  const params = new URLSearchParams({ userId, role });
  return apiFetch<CheckRoleResponse>(`/Auth/check-role?${params}`);
}
