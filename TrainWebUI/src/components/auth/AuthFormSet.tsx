'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, Eye, EyeOff, Check } from 'lucide-react';

import { useAuth } from '@/components/auth/AuthContext';
import { Display, Body, Small } from '@/components/ui/typography';

import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';

import { apiFetch, ApiError } from '@/lib/api/config';
import type { UserRole } from '@/types/user';

type MeResponse = {
  // BE có thể trả PascalCase hoặc camelCase, nên normalize bên dưới
  id?: string;
  Id?: string;

  uid?: string; // nếu có
  Uid?: string;

  name?: string;
  Name?: string;

  email?: string;
  Email?: string;

  role?: string; // "Passenger" | "passenger" | ...
  Role?: string;

  createdAt?: string | null;
  CreatedAt?: string | null;

  // optional profile fields
  phone?: string | null;
  Phone?: string | null;
  cccd?: string | null;
  CCCD?: string | null;
  avatarURL?: string | null;
  AvatarURL?: string | null;

  isEmailVerified?: boolean | null;
  IsEmailVerified?: boolean | null;

  email_verified?: boolean; // nếu có từ auth/me cũ (compat)
};

function normalizeRole(role?: string): UserRole {
  const r = (role || '').toLowerCase();
  if (r === 'admin') return 'admin';
  if (r === 'staff') return 'staff';
  return 'passenger';
}

function roleToRedirectPath(role: UserRole) {
  switch (role) {
    case 'admin':
      return '/admin-dashboard';
    case 'staff':
      return '/staff-dashboard';
    default:
      return '/search';
  }
}

function normalizeMe(raw: MeResponse): {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string | null;
} {
  const id = raw.id ?? raw.Id ?? raw.uid ?? raw.Uid ?? '';
  const name = raw.name ?? raw.Name ?? '';
  const email = raw.email ?? raw.Email ?? '';
  const roleStr = raw.role ?? raw.Role ?? '';
  const createdAt = raw.createdAt ?? raw.CreatedAt ?? null;

  return {
    id,
    name,
    email,
    role: normalizeRole(roleStr),
    createdAt,
  };
}

function firebaseErrorToMessage(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password'))
    return 'Email hoặc mật khẩu không đúng.';
  if (msg.includes('auth/user-not-found')) return 'Tài khoản không tồn tại.';
  if (msg.includes('auth/email-already-in-use')) return 'Email này đã được sử dụng.';
  if (msg.includes('auth/weak-password')) return 'Mật khẩu quá yếu (tối thiểu 6 ký tự).';
  if (msg.includes('auth/invalid-email')) return 'Email không hợp lệ.';
  return 'Có lỗi xảy ra. Vui lòng thử lại.';
}

export default function AuthFormSet() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { refreshMe } = useAuth();
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  async function fetchMe(idToken?: string): Promise<MeResponse> {
    // ✅ endpoint chuẩn hoá theo BE mới: /api/User/me
    if (idToken) {
      return apiFetch<MeResponse>('/User/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${idToken}` },
      });
    }

    return apiFetch<MeResponse>('/User/me', { method: 'GET' });
  }

  async function updateMeProfile(payload: { name?: string; phone?: string }) {
    // ✅ lưu dữ liệu profile (SĐT chỉ lưu data)
    // endpoint chuẩn hoá: PUT /api/User/me
    return apiFetch('/User/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async function applyPersistence() {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await applyPersistence();

      // 1) Login Firebase
      const cred = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);

      // 2) Ensure ID token and call BE /User/me to verify token + get role
      const idToken = await cred.user.getIdToken();
      const rawMe = await fetchMe(idToken);

      if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
        console.debug('[auth] login token length:', idToken?.length, 'profile raw:', rawMe);
      }
      const me = normalizeMe(rawMe);

      // 3) Update context (RouteGuard dùng)
      await refreshMe();

      // 4) Redirect theo role
      router.push(roleToRedirectPath(me.role));
    } catch (err: unknown) {
      console.error('Login error:', err);

      if (err instanceof ApiError && err.status === 401) {
        setError('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError(firebaseErrorToMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (!agreeTerms) {
      setError('Vui lòng đồng ý với Điều khoản & Chính sách');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await applyPersistence();


      // 1) Register Firebase
      const cred = await createUserWithEmailAndPassword(auth, registerData.email, registerData.password);

      // 2) Set displayName (để profile Firebase có name)
      const nameTrim = registerData.name.trim();
      if (nameTrim) {
        await updateProfile(cred.user, { displayName: nameTrim });
      }

      // 3) Bootstrap Firestore user bằng cách gọi /User/me (pass current token to be safe)
      const idToken = await cred.user.getIdToken();
      const rawMe = await fetchMe(idToken);

      if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
        console.debug('[auth] register token length:', idToken?.length, 'profile raw:', rawMe);
      }
      const me = normalizeMe(rawMe);

      // 4) Lưu SĐT (và name) vào Firestore nếu có
      const phoneTrim = registerData.phone.trim();
      if (nameTrim || phoneTrim) {
        await updateMeProfile({ name: nameTrim || undefined, phone: phoneTrim || undefined });
      }

      // 5) Refresh context
      await refreshMe();

      setSuccess(true);

      // 6) Redirect
      setTimeout(() => {
        router.push(roleToRedirectPath(me.role));
      }, 800);
    } catch (err: unknown) {
      console.error('Register error:', err);

      if (err instanceof ApiError && err.status === 401) {
        setError('Token không hợp lệ. Vui lòng thử đăng ký lại.');
      } else {
        setError(firebaseErrorToMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          {/* Header */}
          <div className="text-center py-8 px-6 bg-background">
            <Display className="mb-2">Welcome to GoRail</Display>
            <Body className="text-muted-foreground">
              {activeTab === 'login'
                ? 'Trải nghiệm đặt vé tàu dễ dàng.'
                : 'Đăng ký GoRail để đặt vé tàu ngay hôm nay.'}
            </Body>
          </div>

          {/* Tab Switcher */}
          <div className="mx-6 my-6">
            <div className="bg-background rounded-xl p-1 flex gap-1 border border-border">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError('');
                  setSuccess(false);
                }}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setError('');
                  setSuccess(false);
                }}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                Đăng ký
              </button>
            </div>
          </div>

          {/* Error/Success */}
          {error && (
            <div className="mx-6 mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <Small className="text-destructive">{error}</Small>
            </div>
          )}

          {success && (
            <div className="mx-6 mb-4 p-4 bg-success/10 border border-success/20 rounded-xl">
              <Small className="text-success">Đăng ký thành công! Đang chuyển hướng...</Small>
            </div>
          )}

          {/* Forms */}
          <div className="px-6 pb-8 bg-card">
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Email</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="john.doe@example.com"
                      className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Mật khẩu</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="**************"
                      className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        rememberMe ? 'bg-primary border-primary' : 'bg-background border-input'
                      }`}
                    >
                      {rememberMe && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <Small className="text-foreground">Ghi nhớ đăng nhập</Small>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>

                {/* Demo Accounts Info */}
                <div className="bg-accent/50 border border-accent rounded-xl p-4 mt-4">
                  <Small className="font-semibold text-accent-foreground mb-2 block">
                    💡 Tài khoản demo để test:
                  </Small>
                  <div className="space-y-1 text-xs text-accent-foreground">
                    <p><strong>Admin:</strong> admin@demo.com</p>
                    <p><strong>Staff:</strong> staff@demo.com</p>
                    <p><strong>User:</strong> user@demo.com</p>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Họ và tên</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Nhập email của bạn</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="john.doe@example.com"
                      className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Nhập số điện thoại của bạn</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="0123456789"
                      className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Mật khẩu</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="**************"
                      className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Nhập lại mật khẩu</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="**************"
                      className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setAgreeTerms(!agreeTerms)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        agreeTerms ? 'bg-primary border-primary' : 'bg-background border-input'
                      }`}
                    >
                      {agreeTerms && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <Small className="text-foreground">
                      Tôi đồng ý với <span className="text-accent font-semibold">Điều khoản & Chính sách</span>
                    </Small>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setSubscribeNewsletter(!subscribeNewsletter)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        subscribeNewsletter ? 'bg-primary border-primary' : 'bg-background border-input'
                      }`}
                    >
                      {subscribeNewsletter && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <Small className="text-foreground">Đăng ký nhận bản tin ưu đãi</Small>
                  </label>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg mt-4"
                >
                  {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
