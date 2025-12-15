/**
 * Get the current user's ID from localStorage (GoRail key only).
 */
export function getCurrentUserId(): string | null {
  const stored = localStorage.getItem("gorail_user");
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user.id) return user.id;
    } catch (e) {
      console.error("Failed to parse gorail_user:", e);
    }
  }
  return null;
}

/** Get the current user object from localStorage (GoRail key only) */
export function getCurrentUser() {
  const stored = localStorage.getItem("gorail_user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse gorail_user:", e);
      return null;
    }
  }
  return null;
}
