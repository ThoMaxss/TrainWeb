"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { apiFetch, ApiError } from "@/lib/api/config";
import type { UserRole, UserProfile } from "@/types/user";

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
}

interface AuthContextType extends AuthState {
  // giữ lại để tương thích code cũ (nếu bạn còn gọi)
  login: (user: UserProfile) => void;

  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;

  hasRole: (requiredRole: UserRole | UserRole[]) => boolean;
  canAccess: (resource: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// role hierarchy: admin > staff > passenger
const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  staff: 2,
  passenger: 1,
};

function normalizeRole(role: unknown): UserRole | null {
  if (typeof role !== "string") return null;
  const r = role.trim().toLowerCase();
  if (r === "admin" || r === "staff" || r === "passenger") return r;
  return null;
}

function safeLocalStorageSet(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function safeLocalStorageRemove(key: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

// BE /api/User/me có thể trả PascalCase hoặc camelCase => normalize
type RawMe = Record<string, unknown>;

function pick(raw: RawMe, ...keys: string[]) {
  for (const k of keys) {
    const v = raw[k];
    if (v !== undefined && v !== null) return v;
  }
  return undefined;
}

function asString(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return undefined;
}

function asBool(v: unknown): boolean | undefined {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.toLowerCase();
    if (s === "true") return true;
    if (s === "false") return false;
  }
  return undefined;
}


function mapMe(raw: RawMe): UserProfile {
  const id =
    asString(pick(raw, "id", "Id", "uid", "Uid")) ??
    "";

  const email =
    asString(pick(raw, "email", "Email")) ??
    auth.currentUser?.email ??
    "";

  const name =
    asString(pick(raw, "name", "Name")) ??
    auth.currentUser?.displayName ??
    (email ? String(email).split("@")[0] : "User");

  const roleStr = asString(pick(raw, "role", "Role")) ?? "passenger";
  const role = normalizeRole(roleStr) ?? "passenger";

  const createdAt = asString(pick(raw, "createdAt", "CreatedAt")) ?? null;

  return {
    id,
    email,
    name,
    role,
    createdAt,

    cccd: asString(pick(raw, "cccd", "CCCD")) ?? null,
    phone: asString(pick(raw, "phone", "Phone")) ?? null,
    avatarURL: asString(pick(raw, "avatarURL", "AvatarURL")) ?? null,

    isEmailVerified: asBool(pick(raw, "isEmailVerified", "IsEmailVerified")) ?? null,

    email_verified: asBool(pick(raw, "email_verified")) ?? undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    role: null,
  });

  const setAndPersist = useCallback((user: UserProfile | null, role: UserRole | null) => {
    if (user) {
      const normalizedRole = role ?? user.role ?? "passenger";
      const normalizedUser: UserProfile = { ...user, role: normalizedRole };

      safeLocalStorageSet("gorail_user", JSON.stringify(normalizedUser));
      const uid = normalizedUser.id ?? "";
      if (uid) safeLocalStorageSet("userId", uid);
      else safeLocalStorageRemove("userId");

      setAuthState({
        user: normalizedUser,
        isLoading: false,
        isAuthenticated: true,
        role: normalizedRole,
      });
    } else {
      safeLocalStorageRemove("gorail_user");
      safeLocalStorageRemove("userId");

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        role: null,
      });
    }
  }, []);

  const fetchMe = useCallback(async (fbUserUid?: string) => {
    // ✅ chuẩn mới: /api/User/me
    const raw = await apiFetch<RawMe>("/User/me", { method: "GET" });
    const user = mapMe(raw);

    // fallback id nếu raw không có
    const id = user.id || fbUserUid || auth.currentUser?.uid || "";
    const fixedUser: UserProfile = { ...user, id };

    return { user: fixedUser, role: fixedUser.role };
  }, []);

  const refreshMe = useCallback(async () => {
    if (!auth.currentUser) {
      setAndPersist(null, null);
      return;
    }

    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { user, role } = await fetchMe(auth.currentUser.uid);
      setAndPersist(user, role);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        await signOut(auth);
      }
      setAndPersist(null, null);
    }
  }, [fetchMe, setAndPersist]);

  // Firebase session -> call BE /User/me để lấy role/profile
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      try {
        if (!fbUser) {
          setAndPersist(null, null);
          return;
        }

        // đảm bảo có token (không forceRefresh liên tục)
        await fbUser.getIdToken();

        const { user, role } = await fetchMe(fbUser.uid);
        setAndPersist(user, role);
      } catch (err: unknown) {
        console.error("Auth init error:", err);

        if (err instanceof ApiError && err.status === 401) {
          try {
            await signOut(auth);
          } catch {}
        }

        setAndPersist(null, null);
      }
    });

    return () => unsub();
  }, [fetchMe, setAndPersist]);

  // giữ login() để tương thích luồng cũ
  const login = useCallback(
    (user: UserProfile) => {
      const role = user.role ?? "passenger";
      setAndPersist(user, role);
    },
    [setAndPersist]
  );

  const logout = useCallback(async () => {
    await signOut(auth);
    setAndPersist(null, null);
  }, [setAndPersist]);

  const hasRole = useCallback(
    (requiredRole: UserRole | UserRole[]) => {
      if (authState.role === null) return false;

      const userLevel = ROLE_HIERARCHY[authState.role];
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

      return requiredRoles.some((r) => userLevel >= ROLE_HIERARCHY[r]);
    },
    [authState.role]
  );

  const canAccess = useCallback(
    (resource: string) => {
      if (!authState.isAuthenticated) return false;

      const accessRules: Record<string, UserRole[]> = {
        "/admin": ["admin"],
        "/staff": ["staff", "admin"],
        "/user": ["passenger", "staff", "admin"],
        "/booking": ["passenger", "staff", "admin"],
        "/my-tickets": ["passenger", "staff", "admin"],
      };

      const allowed = accessRules[resource];
      return allowed ? hasRole(allowed) : false;
    },
    [authState.isAuthenticated, hasRole]
  );

  const value = useMemo<AuthContextType>(
    () => ({ ...authState, login, logout, refreshMe, hasRole, canAccess }),
    [authState, login, logout, refreshMe, hasRole, canAccess]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
