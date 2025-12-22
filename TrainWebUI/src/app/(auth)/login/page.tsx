"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { getProfile } from "@/lib/api/auth";
import { useAuth } from "@/components/auth/AuthContext";
import { H1, Body, Small } from "@/components/ui/typography";

import type { MeResponse } from "@/types";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1) Firebase Client login
      const cred = await signInWithEmailAndPassword(auth, formData.email, formData.password);

      // 2) Ensure token exists for apiFetch (apiFetch tự lấy auth.currentUser.getIdToken())
      await cred.user.getIdToken();

      // 3) Call BE to get profile/role (GET /api/User/me)
      const me: MeResponse = await getProfile();

      // 4) Optional: update AuthContext immediately
      // NOTE: context của bạn đang dùng shape { id, email, name, role, createdAt, email_verified }
      if (typeof login === "function") {
        login({
          id: me.id,
          email: me.email,
          name: me.name,
          role: me.role,
          createdAt: me.createdAt ?? null,
          email_verified: me.email_verified,
        });
      }

      // 5) Redirect
      if (returnUrl) {
        router.push(returnUrl);
        return;
      }

      switch (me.role) {
        case "admin":
          router.push("/admin-dashboard");
          break;
        case "staff":
          router.push("/staff-dashboard");
          break;
        default:
          router.push("/search");
          break;
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Đăng nhập thất bại. Vui lòng kiểm tra email/mật khẩu.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="text-center py-8 px-6 bg-background">
            <H1 className="mb-2">Đăng nhập</H1>
            <Body className="text-muted-foreground">Đăng nhập vào tài khoản GoRail của bạn</Body>
          </div>

          <div className="px-6 py-8 bg-card">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <Small className="text-destructive">{error}</Small>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="login-email" className="block text-sm font-semibold text-foreground">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="john.doe@example.com"
                    className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className="block text-sm font-semibold text-foreground">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                    required
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <div className="space-y-4 text-center">
                <Body className="text-muted-foreground">
                  Chưa có tài khoản?{" "}
                  <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                    Đăng ký ngay
                  </Link>
                </Body>

                <Link href="/forgot-password" className="block text-primary hover:text-primary/80 font-semibold transition-colors">
                  Quên mật khẩu?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
