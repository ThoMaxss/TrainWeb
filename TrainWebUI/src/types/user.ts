// types/user.ts

/**
 * Runtime and type-safe user roles.
 * We export both a runtime `UserRole` object (so code can do `UserRole.Staff`)
 * and a `UserRole` type (union of literal strings) for type annotations.
 */
export const UserRole = {
  Passenger: "passenger",
  Staff: "staff",
  Admin: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface UserProfile {
  /** Firestore Id = Firebase UID */
  id: string;

  name: string;
  email: string;

  /** role chuẩn lowercase */
  role: UserRole;

  /** ISO string (nếu BE trả), hoặc null/undefined */
  createdAt?: string | null;

  /** Các field profile bạn thêm */
  cccd?: string | null;
  phone?: string | null;
  avatarURL?: string | null;

  /**
   * Nếu BE trả từ UserDto: IsEmailVerified
   * (lưu DB, có thể sync theo token)
   */
  isEmailVerified?: boolean | null;

  /**
   * Nếu BE trả từ claim trong /me (AuthController kiểu cũ)
   * -> giữ để tương thích, optional
   */
  email_verified?: boolean;
}

/**
 * Response chuẩn cho GET /api/User/me (theo UserController trả user.ToDto()).
 * Nếu BE của bạn trả PascalCase (Id/Name/Email...) thì bạn map tại api layer.
 */
export type MeResponse = UserProfile;

/**
 * Update profile bản thân: PUT /api/User/me
 * (staff/user chỉ được update các field này)
 */
export interface UpdateMeRequest {
  name?: string;
  cccd?: string;
  phone?: string;
  avatarURL?: string;
}

/**
 * Request payload when a user registers (FE -> BE)
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

/**
 * DTOs used across the app
 */
export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string | null;
}

export interface UserDto extends UserEntity {
  token?: string | null;
  isEmailVerified?: boolean | null;
  cccd?: string | null;
  phone?: string | null;
  avatarURL?: string | null;
}

/**
 * Admin update user bất kỳ: PUT /api/User/{id}
 * Admin có thể đổi role (nếu BE cho phép)
 */
export interface AdminUpdateUserRequest extends UpdateMeRequest {
  role?: UserRole;
}

/**
 * (Optional) Admin create user theo Firebase UID có sẵn: POST /api/User
 * Lưu ý: với Firebase Client register, thường không cần create user từ BE.
 */
export interface AdminCreateUserRequest {
  id: string; // Firebase UID
  name: string;
  email: string;
  role: UserRole;

  cccd?: string;
  phone?: string;
  avatarURL?: string;
}

/**
 * Nếu bạn vẫn còn dùng AuthController cũ ở FE:
 * - Auth BE login: { idToken }
 */
export interface LoginRequest {
  idToken: string;
}

/**
 * Nếu bạn còn dùng AuthController cũ:
 * AuthController trả:
 * - register: { message, uid, role }
 * - login: { message, uid, email, role }
 */
export interface AuthResponse {
  message: string;
  uid: string;
  role: UserRole;
  email?: string;
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  passenger: "Hành khách",
  staff: "Nhân viên",
  admin: "Admin",
};

export function isUserRole(value: unknown): value is UserRole {
  return value === "passenger" || value === "staff" || value === "admin";
}
