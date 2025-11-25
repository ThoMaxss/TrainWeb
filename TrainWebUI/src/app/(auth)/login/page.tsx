'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { login as apiLogin } from '@/lib/api/auth';
import { UserRole, LoginRequest, UserDto } from '@/types';
import { H1, Body, Small } from '@/components/ui/typography';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let userDto: UserDto;
      try {
        // Call backend login API with email and password
        const loginPayload: LoginRequest = {
          email: formData.email,
          password: formData.password,
        };
        const authResponse = await apiLogin(loginPayload);
        
        // Convert AuthResponse to UserDto
        // Note: Backend should return user details, for now using demo data structure
        userDto = { 
          id: 'backend-user-id', // Backend should provide this
          name: authResponse.email?.split('@')[0] || 'User', // Temporary: extract from email
          email: authResponse.email || formData.email, 
          role: authResponse.role === 'Admin' ? UserRole.Admin : 
                authResponse.role === 'Staff' ? UserRole.Staff : UserRole.Passenger,
          createdAt: new Date().toISOString() 
        };
      } catch {
        // Fallback to demo users if backend fails
        const demoUsers = {
          'admin@demo.com': { id:'demo-admin-1', name:'Admin Demo', email:'admin@demo.com', role:UserRole.Admin, createdAt:new Date().toISOString() },
          'staff@demo.com': { id:'demo-staff-1', name:'Staff Demo', email:'staff@demo.com', role:UserRole.Staff, createdAt:new Date().toISOString() },
          'user@demo.com' : { id:'demo-user-1',  name:'User Demo',  email:'user@demo.com',  role:UserRole.Passenger, createdAt:new Date().toISOString() },
        } as const;
        userDto = demoUsers[formData.email as keyof typeof demoUsers];
        if (!userDto) throw new Error('Email không hợp lệ. Vui lòng dùng tài khoản demo.');
      }
      login(userDto);
      switch (userDto.role) {
        case UserRole.Admin: router.push('/admin-dashboard'); break;
        case UserRole.Staff: router.push('/staff-dashboard'); break;
        case UserRole.Passenger: router.push('/search'); break;
        default: router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Main Form Container */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          
          {/* Header */}
          <div className="text-center py-8 px-6 bg-background">
            <H1 className="mb-2">Đăng nhập</H1>
            <Body className="text-muted-foreground">
              Đăng nhập vào tài khoản TrainBooking của bạn
            </Body>
          </div>

          {/* Form */}
          <div className="px-6 py-8 bg-card">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <Small className="text-destructive">{error}</Small>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Field */}
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

              {/* Password Field */}
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>

              {/* Demo Accounts Info */}
              <div className="bg-accent/50 border border-accent rounded-xl p-4">
                <Small className="font-semibold text-accent-foreground mb-3 block">
                  Tài khoản demo để test:
                </Small>
                <div className="space-y-2 text-sm text-accent-foreground">
                  <div><strong>Admin:</strong> admin@demo.com</div>
                  <div><strong>Staff:</strong> staff@demo.com</div>
                  <div><strong>User:</strong> user@demo.com</div>
                  <Small className="text-muted-foreground mt-3 block">
                    Nhập một trong các email trên để thử!
                  </Small>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-4 text-center">
                <Body className="text-muted-foreground">
                  Chưa có tài khoản? {' '}
                  <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                    Đăng ký ngay
                  </Link>
                </Body>

                <Link 
                  href="/forgot-password" 
                  className="block text-primary hover:text-primary/80 font-semibold transition-colors"
                >
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
