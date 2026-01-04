"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import { H3, Body, Small } from "@/components/ui/typography";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSent(true);
    setLoading(false);
  };

  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle="Nhập email để nhận liên kết đặt lại mật khẩu."
      footer={
        <Body className="text-sm text-muted-foreground">
          Nhớ mật khẩu?{' '}
          <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            Đăng nhập ngay
          </Link>
        </Body>
      }
    >
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="forgot-email" className="block text-sm font-semibold text-foreground">
              Email của bạn
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className="w-full bg-background border border-input rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
                aria-required="true"
              />
            </div>
          </div>

          <Small className="text-muted-foreground block">
            Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến địa chỉ email này.
          </Small>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Gửi link khôi phục mật khẩu"
          >
            {loading ? "Đang gửi..." : "Gửi link khôi phục"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-success/10 dark:bg-success/20 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-success dark:text-success" aria-hidden="true" />
          </div>

          <div>
            <H3 className="mb-3">Email đã được gửi!</H3>
            <Body className="text-muted-foreground">
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến <strong className="text-foreground">{email}</strong>.
              Vui lòng kiểm tra hộp thư của bạn.
            </Body>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Quay lại đăng nhập
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}