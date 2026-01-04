"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Train } from "lucide-react";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { ApiError } from "@/lib/api/config";

import { auth } from "@/lib/firebase";
import { getProfile } from "@/lib/api/auth";
import { useAuth } from "@/components/auth/AuthContext";
import { Body, Small } from "@/components/ui/typography";
import AuthLayout from "@/components/auth/AuthLayout";

import type { MeResponse, UserProfile, UserRole } from "@/types";

export default function LoginClient() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get("returnUrl");

  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // apply persistence according to rememberMe
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      // 1) Firebase Client login
      const cred = await signInWithEmailAndPassword(auth, formData.email, formData.password);

      // 2) Ensure token exists and pass it explicitly to avoid race with auth.currentUser
      const idToken = await cred.user.getIdToken();

      // 3) Call BE to get profile/role (pass token to be safe)
      const me: MeResponse = await getProfile(idToken);

      if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
        console.debug('[auth] login token length:', idToken?.length, 'profile:', me);
      }

      if (typeof login === "function") {
        const payload: UserProfile = {
          id: me.id,
          email: me.email,
          name: me.name,
          role: (me.role as unknown as UserRole) ?? "passenger",
          createdAt: me.createdAt ?? null,
        };
        login(payload);
      }

      // 4) Redirect
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
      // Friendly mapping for common Firebase errors
      const firebaseMessage = (e: unknown) => {
        const m = e instanceof Error ? e.message : String(e);
        if (m.includes("auth/wrong-password") || m.includes("auth/invalid-credential") || m.includes("auth/invalid-password")) return "Email hoặc mật khẩu không đúng.";
        if (m.includes("auth/user-not-found")) return "Tài khoản không tồn tại.";
        if (m.includes("auth/too-many-requests")) return "Quá nhiều lần thử. Vui lòng thử lại sau.";
        if (m.includes("auth/invalid-email")) return "Email không hợp lệ.";
        return null;
      };

      // ApiError from backend (e.g., 500, 401)
      if (err instanceof ApiError) {
        setError(`Lỗi máy chủ: ${err.message || 'Vui lòng thử lại sau.'}`);
      } else if (firebaseMessage(err)) {
        setError(firebaseMessage(err)!);
      } else {
        const msg = err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng kiểm tra email/mật khẩu.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Chào mừng bạn trở lại với GoRail"
      footer={
        <Body className="text-sm text-muted-foreground">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            Đăng ký ngay
          </Link>
        </Body>
      }
    >
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in duration-200">
          <Small className="text-destructive font-medium">{error}</Small>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-2">Email</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Mail className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <input
              id="login-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              placeholder="example@gorail.vn"
              className="w-full bg-background border border-input rounded-lg py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-sm font-medium text-foreground mb-2">Mật khẩu</label>
            <Link href="/forgot-password" className="text-xs text-primary hover:text-primary/80 font-medium">Quên mật khẩu?</Link>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Lock className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full bg-background border border-input rounded-lg py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-input"
            />
            Ghi nhớ đăng nhập
          </label>

          <Link href="/forgot-password" className="text-xs text-primary hover:text-primary/80 font-medium">Quên mật khẩu?</Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <div className="flex items-center justify-center gap-2">
            {loading && <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
            <span>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
          </div>
        </button>
      </form>
    </AuthLayout>
  )
}
