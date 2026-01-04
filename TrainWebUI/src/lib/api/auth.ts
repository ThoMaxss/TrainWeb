import { apiFetch } from "./config";
import type { MeResponse } from "@/types/user";

/**
 * Với Firebase Client Auth:
 * - FE login/register bằng Firebase Auth SDK
 * - BE chỉ verify Firebase ID Token (Authorization: Bearer ...)
 * - Profile/role lấy qua GET /api/User/me
 */

/** Call BE to get current profile (also ensures Firestore user exists) */
export async function getProfile(idToken?: string): Promise<MeResponse> {
  if (idToken) {
    return apiFetch<MeResponse>("/User/me", {
      headers: { Authorization: `Bearer ${idToken}` },
    });
  }

  return apiFetch<MeResponse>("/User/me");
}

/**
 * Optional: If you want a single "bootstrap" call after Firebase login/register
 * you can call getProfile() then redirect based on role.
 */
export async function bootstrap(): Promise<MeResponse> {
  return getProfile();
}
