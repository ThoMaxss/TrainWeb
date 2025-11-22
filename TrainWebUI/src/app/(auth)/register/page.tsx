'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { register as apiRegister } from '@/lib/api/auth';
import { UserRole, UserEntity, UserDto, RegisterRequest } from '@/types';
import { H1, Body, Small } from '@/components/ui/typography';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create registration request with correct payload structure
      const registerPayload: RegisterRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: UserRole.Passenger, // default role
      };
      
      // Call backend register API
      await apiRegister(registerPayload);
      
      setSuccess(true);
      
      // Auto-login after successful registration
      setTimeout(() => {
        const loggedIn: UserDto = {
          id: Date.now().toString(),
          name: registerPayload.name,
          email: registerPayload.email,
          role: registerPayload.role,
          createdAt: new Date().toISOString(),
        };
        login(loggedIn);
        router.push('/search'); // Redirect to search page for new users
      }, 1500);
      
    } catch (err) {
      console.error('Register error:', err);
      setError('Đăng ký thất bại. Email có thể đã được sử dụng.');
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
            <H1 className="mb-2">Đăng ký</H1>
            <Body className="text-muted-foreground">
              Tạo tài khoản TrainBooking mới
            </Body>
          </div>

          {/* Form */}
          <div className="px-6 py-8 bg-card">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <Small className="text-destructive">{error}</Small>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <Small className="text-emerald-600 dark:text-emerald-400">
                  Đăng ký thành công! Đang chuyển hướng...
                </Small>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="register-name" className="block text-sm font-semibold text-foreground">
                  Họ và tên
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <input
                    id="register-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="register-email" className="block text-sm font-semibold text-foreground">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <input
                    id="register-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@example.com"
                    className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="register-phone" className="block text-sm font-semibold text-foreground">
                  Số điện thoại
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Phone className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <input
                    id="register-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0901234567"
                    className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="register-password" className="block text-sm font-semibold text-foreground">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="register-confirm-password" className="block text-sm font-semibold text-foreground">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                    required
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? 'Đang đăng ký...' : success ? 'Đã đăng ký!' : 'Đăng ký'}
              </button>

              {/* Demo Accounts Info */}
              <div className="bg-accent/50 border border-accent rounded-xl p-4">
                <Small className="font-semibold text-accent-foreground mb-3 block">
                  💡 Hoặc dùng tài khoản demo:
                </Small>
                <div className="space-y-2 text-sm text-accent-foreground">
                  <div><strong>Admin:</strong> admin@demo.com</div>
                  <div><strong>Staff:</strong> staff@demo.com</div>
                  <div><strong>User:</strong> user@demo.com</div>
                  <Small className="text-muted-foreground mt-3 block">
                    Truy cập{' '}
                    <Link href="/login" className="underline font-semibold hover:text-primary transition-colors">
                      trang đăng nhập
                    </Link>
                    {' '}để thử!
                  </Small>
                </div>
              </div>

              {/* Link to Login */}
              <div className="text-center">
                <Body className="text-muted-foreground">
                  Đã có tài khoản? {' '}
                  <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                    Đăng nhập ngay
                  </Link>
                </Body>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
