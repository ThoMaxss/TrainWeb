'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { login as apiLogin, register as apiRegister } from '@/lib/api/auth';
import { UserRole, UserEntity } from '@/types';
import { Mail, Lock, User, Phone, Eye, EyeOff, Check } from 'lucide-react';
import Link from 'next/link';
import { Display, Body, Small } from '@/components/ui/typography';

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

  const { login } = useAuth();
  const router = useRouter();

  // Form data cho cả login và register
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userDto;
      
      try {
        const userEntity = await apiLogin(loginData.email);
        userDto = { ...userEntity, role: userEntity.role as UserRole };
      } catch (apiError) {
        // Fallback demo accounts
        const demoUsers = {
          'admin@demo.com': {
            id: 'demo-admin-1',
            name: 'Admin Demo',
            email: 'admin@demo.com',
            phone: '0123456789',
            role: UserRole.ADMIN,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          'staff@demo.com': {
            id: 'demo-staff-1',
            name: 'Staff Demo',
            email: 'staff@demo.com',
            phone: '0123456790',
            role: UserRole.STAFF,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          'user@demo.com': {
            id: 'demo-user-1',
            name: 'User Demo',
            email: 'user@demo.com',
            phone: '0123456791',
            role: UserRole.PASSENGER,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
        
        userDto = demoUsers[loginData.email as keyof typeof demoUsers];
        if (!userDto) {
          throw new Error('Email không hợp lệ. Vui lòng sử dụng tài khoản demo.');
        }
      }

      login(userDto);
      
      // Redirect based on role
      switch (userDto.role) {
        case UserRole.ADMIN:
          router.push('/admin-dashboard');
          break;
        case UserRole.STAFF:
          router.push('/staff-dashboard');
          break;
        case UserRole.PASSENGER:
          router.push('/search');
          break;
        default:
          router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
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

    try {
      const newUser: UserEntity = {
        id: '',
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        role: UserRole.PASSENGER,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await apiRegister(newUser);
      setSuccess(true);
      
      setTimeout(() => {
        login({ ...newUser, id: Date.now().toString() });
        router.push('/search');
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
            <Display className="mb-2">Welcome to TrainBooking</Display>
            <Body className="text-muted-foreground">
              {activeTab === 'login' 
                ? 'Trải nghiệm đặt vé tàu dễ dàng.' 
                : 'Đăng ký TrainBooking để đặt vé tàu ngay hôm nay.'
              }
            </Body>
          </div>

          {/* Tab Switcher */}
          <div className="mx-6 my-6">
            <div className="bg-background rounded-xl p-1 flex gap-1 border border-border">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                Đăng ký
              </button>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mx-6 mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <Small className="text-destructive">{error}</Small>
            </div>
          )}

          {success && (
            <div className="mx-6 mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <Small className="text-emerald-600 dark:text-emerald-400">
                Đăng ký thành công! Đang chuyển hướng...
              </Small>
            </div>
          )}

          {/* Forms */}
          <div className="px-6 pb-8 bg-card">
            {activeTab === 'login' ? (
              // LOGIN FORM
              <form onSubmit={handleLogin} className="space-y-5">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Email hoặc số điện thoại
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john.doe@example.com"
                      className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
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
                        rememberMe 
                          ? 'bg-primary border-primary' 
                          : 'bg-background border-input'
                      }`}
                    >
                      {rememberMe && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                    <Small className="text-foreground">Ghi nhớ đăng nhập</Small>
                  </label>
                  <Link href="/forgot-password" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
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
              // REGISTER FORM
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Nhập email của bạn
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john.doe@example.com"
                      className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Nhập số điện thoại của bạn
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="0123456789"
                      className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Nhập lại mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
                        agreeTerms 
                          ? 'bg-primary border-primary' 
                          : 'bg-background border-input'
                      }`}
                    >
                      {agreeTerms && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                    <Small className="text-foreground">
                      Tôi đồng ý với{' '}
                      <span className="text-accent font-semibold">Điều khoản & Chính sách</span>
                    </Small>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <div 
                      onClick={() => setSubscribeNewsletter(!subscribeNewsletter)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        subscribeNewsletter 
                          ? 'bg-primary border-primary' 
                          : 'bg-background border-input'
                      }`}
                    >
                      {subscribeNewsletter && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                    <Small className="text-foreground">
                      Đăng ký nhận bản tin ưu đãi
                    </Small>
                  </label>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg mt-4"
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