/**
 * Get the current user's ID from localStorage
 * Supports both new format (train_booking_user object) and legacy format (userId string)
 */
export function getCurrentUserId(): string | null {
  // Try new format first
  const storedUser = localStorage.getItem("train_booking_user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user.id) return user.id;
    } catch (e) {
      console.error("Failed to parse train_booking_user:", e);
    }
  }

  // Fallback to legacy format
  return localStorage.getItem("userId");
}

/**
 * Get the current user object from localStorage
 */
export function getCurrentUser() {
  const storedUser = localStorage.getItem("train_booking_user");
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse train_booking_user:", e);
      return null;
    }
  }
  return null;
}
