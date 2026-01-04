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
        <Body className="text-sm text-gray-600">
          Nhớ mật khẩu?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors">
            Đăng nhập ngay
          </Link>
        </Body>
      }
    >
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email của bạn
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
                aria-required="true"
              />
            </div>
          </div>

          <Small className="text-gray-500 block text-center">
            Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến địa chỉ email này.
          </Small>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all duration-200"
            aria-label="Gửi link khôi phục mật khẩu"
          >
            {loading ? "Đang gửi..." : "Gửi link khôi phục"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-green-600" aria-hidden="true" />
          </div>

          <div>
            <H3 className="text-xl font-semibold text-gray-900 mb-2">Email đã được gửi!</H3>
            <Body className="text-gray-600">
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến <strong className="text-gray-900">{email}</strong>.
              Vui lòng kiểm tra hộp thư của bạn.
            </Body>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Quay lại đăng nhập
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}