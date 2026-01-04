import { apiFetch } from './config';
import { UserDto } from '@/types';

// User endpoints based on backend UserController

// GET /api/User/profile/{userId} - Get user profile
export async function getUserProfile(userId: string): Promise<UserDto> {
  return apiFetch<UserDto>(`/User/profile/${userId}`);
}

// PUT /api/User/profile/{userId} - Update user profile
export async function updateUserProfile(userId: string, profileData: Partial<UserDto>): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/User/profile/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

// POST /api/User/change-password - Change password
export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/User/change-password', {
    method: 'POST',
    body: JSON.stringify({ userId, currentPassword, newPassword }),
  });
}

// GET /api/User/all - Get all users with pagination (Admin only)
export async function getAllUsers(pageNumber: number = 1, pageSize: number = 100): Promise<UserDto[]> {
  const response = await apiFetch<{ data: UserDto[], pagination: any }>(`/User/all?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return response?.data || [];
}

// POST /api/User/deactivate/{userId} - Deactivate user (Admin only)
export async function deactivateUser(userId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/User/deactivate/${userId}`, {
    method: 'POST',
  });
}

// POST /api/User/activate/{userId} - Activate user (Admin only)
export async function activateUser(userId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/User/activate/${userId}`, {
    method: 'POST',
  });
}

// Legacy support - these don't exist on backend, throw errors
export async function getUserById(id: string): Promise<UserDto> {
  return getUserProfile(id);
}

export async function createUser(userData: UserDto): Promise<UserDto> {
  throw new Error('createUser not supported - use Auth/register instead');
}

export async function updateUser(id: string, userData: UserDto): Promise<UserDto> {
  await updateUserProfile(id, userData);
  return getUserProfile(id);
}

export async function deleteUser(id: string): Promise<void> {
  await deactivateUser(id);
}
