import { apiFetch } from "./config";
import type {
  MeResponse,
  UpdateMeRequest,
  AdminUpdateUserRequest,
  AdminCreateUserRequest,
  UserProfile,
} from "@/types/user";

/**
 * NOTE về phân quyền:
 * - Passenger/Staff/Admin: chỉ được GET/PUT /User/me (cập nhật bản thân)
 * - Admin: được CRUD user qua /User/{id} và /User (POST)
 */

// =======================
// SELF (Passenger/Staff/Admin)
// =======================

/** GET /api/User/me - Get my profile */
export async function getMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>("/User/me");
}

/** PUT /api/User/me - Update my profile (only allowed fields) */
export async function updateMe(data: UpdateMeRequest): Promise<MeResponse> {
  return apiFetch<MeResponse>("/User/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// =======================
// ADMIN ONLY
// =======================

/** GET /api/User/{id} - Admin get any user by id */
export async function adminGetUserById(id: string): Promise<UserProfile> {
  return apiFetch<UserProfile>(`/User/${id}`);
}

/**
 * PUT /api/User/{id} - Admin update any user (can include role)
 * (Staff/User không được gọi)
 */
export async function adminUpdateUser(
  id: string,
  data: AdminUpdateUserRequest
): Promise<UserProfile> {
  return apiFetch<UserProfile>(`/User/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/** DELETE /api/User/{id} - Admin delete user */
export async function adminDeleteUser(id: string): Promise<void> {
  return apiFetch<void>(`/User/${id}`, {
    method: "DELETE",
  });
}

/**
 * POST /api/User - Admin create user record
 * ⚠️ Lưu ý: nếu BE chỉ tạo Firestore record mà KHÔNG tạo Firebase Auth user,
 * thì user tạo mới sẽ không đăng nhập được cho tới khi được tạo trong Firebase Auth.
 */
export async function adminCreateUser(
  data: AdminCreateUserRequest
): Promise<UserProfile> {
  return apiFetch<UserProfile>("/User", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * GET /api/User - Admin list all users
 * ⚠️ Chỉ dùng khi BE có endpoint GET /api/User (AdminOnly)
 */
// export async function adminGetAllUsers(): Promise<UserProfile[]> {
//   return apiFetch<UserProfile[]>("/User");
// }
