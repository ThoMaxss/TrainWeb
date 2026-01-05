import type { UserProfile, UserRole } from "@/types/user";

function safeLocalStorageGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function normalizeRole(role: unknown): UserRole | null {
  if (typeof role === "number") {
    if (role === 2) return "admin";
    if (role === 1) return "staff";
    if (role === 0) return "passenger";
  }

  if (typeof role === "string") {
    const r = role.trim().toLowerCase();
    // Numeric strings
    if (r === "2") return "admin";
    if (r === "1") return "staff";
    if (r === "0") return "passenger";
    // Word strings
    if (r === "admin") return "admin";
    if (r === "staff") return "staff";
    if (r === "passenger") return "passenger";
  }

  return null;
}

/**
 * Get the current user's ID from localStorage (GoRail key only).
 */
export function getCurrentUserId(): string | null {
  const stored = safeLocalStorageGet("gorail_user");
  if (stored) {
    try {
      const user = JSON.parse(stored) as Partial<UserProfile>;
      if (user?.id) return user.id;
    } catch (e) {
      console.error("Failed to parse gorail_user:", e);
    }
  }
  return null;
}

/** Get the current user object from localStorage (GoRail key only) */
export function getCurrentUser(): UserProfile | null {
  const stored = safeLocalStorageGet("gorail_user");
  if (stored) {
    try {
      const user = JSON.parse(stored) as UserProfile;
      const normalizedRole = normalizeRole(user.role) ?? "passenger";
      return { ...user, role: normalizedRole };
    } catch (e) {
      console.error("Failed to parse gorail_user:", e);
      return null;
    }
  }
  return null;
}
