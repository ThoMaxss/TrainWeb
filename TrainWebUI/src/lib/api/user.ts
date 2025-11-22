import { apiFetch } from './config';
import { UserDto } from '@/types';

// User endpoints based on backend documentation

// GET /api/User - Get all users
export async function getAllUsers(): Promise<UserDto[]> {
  return apiFetch<UserDto[]>('/User');
}

// GET /api/User/{id} - Get user by ID
export async function getUserById(id: string): Promise<UserDto> {
  return apiFetch<UserDto>(`/User/${id}`);
}

// POST /api/User - Create user
export async function createUser(userData: UserDto): Promise<UserDto> {
  return apiFetch<UserDto>('/User', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// PUT /api/User/{id} - Update user (returns User domain object, not DTO)
export async function updateUser(id: string, userData: UserDto): Promise<UserDto> {
  return apiFetch<UserDto>(`/User/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

// DELETE /api/User/{id} - Delete user
export async function deleteUser(id: string): Promise<void> {
  return apiFetch<void>(`/User/${id}`, {
    method: 'DELETE',
  });
}
