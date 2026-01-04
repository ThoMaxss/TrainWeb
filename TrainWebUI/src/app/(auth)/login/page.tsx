'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  
  // Get return URL from query params
  const returnUrl = searchParams.get('returnUrl');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Real API login
      const loginPayload: LoginRequest = {
        email: formData.email,
        password: formData.password,
      };
      const authResponse = await apiLogin(loginPayload);
      
      // Convert AuthResponse to UserDto (AuthResponse doesn't include id/name)
      const userDto: UserDto = { 
        id: authResponse.email || formData.email,
        name: (authResponse.email || formData.email).split('@')[0] || 'User',
        email: authResponse.email || formData.email, 
        role: authResponse.role === 'Admin' ? UserRole.Admin : 
              authResponse.role === 'Staff' ? UserRole.Staff : UserRole.Passenger,
        createdAt: new Date().toISOString(),
        token: authResponse.token,
      };
      
      login(userDto);
      
      // Redirect to returnUrl if provided, otherwise use role-based routing
      if (returnUrl) {
        console.log("✅ Login successful, redirecting to:", returnUrl);
        router.push(returnUrl);
      } else {
        switch (userDto.role) {
          case UserRole.Admin: router.push('/admin-dashboard'); break;
          case UserRole.Staff: router.push('/staff-dashboard'); break;
          case UserRole.Passenger: router.push('/search'); break;
          default: router.push('/');
        }
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
        <div className="bg-background rounded-lg border border-border overflow-hidden">
          
          {/* Header */}
          <div className="text-center py-8 px-6 bg-background">
            <H1 className="mb-2">Đăng nhập</H1>
            <Body className="text-muted-foreground">
              Đăng nhập vào tài khoản GoRail của bạn
            </Body>
          </div>

          {/* Form */}
          <div className="px-6 py-8 bg-background">
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
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors duration-200"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>



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
