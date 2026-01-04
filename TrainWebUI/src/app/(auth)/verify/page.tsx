"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/components/auth/AuthContext";
import { Body, Small } from "@/components/ui/typography";
import { AlertCircle, CheckCircle2, Clock, Mail } from "lucide-react";

export default function VerifyAccountPage() {
  const router = useRouter();
  const { user, refreshMe } = useAuth();

  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>("");

  const email = useMemo(() => user?.email ?? auth.currentUser?.email ?? "", [user?.email]);

  // Redirect if already verified
  useEffect(() => {
    if (user?.email_verified || user?.isEmailVerified) {
      router.replace("/search");
    }
  }, [router, user?.email_verified, user?.isEmailVerified]);

  useEffect(() => {
    // If not logged in, go to login
    const unsub = auth.onAuthStateChanged((fbUser) => {
      if (!fbUser) router.replace("/login");
    });
    return () => unsub();
  }, [router]);

  const handleResend = async () => {
    setError("");
    setInfo("");
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }
    try {
      setSending(true);
      await sendEmailVerification(auth.currentUser);
      setInfo("Email xác minh đã được gửi. Vui lòng kiểm tra hộp thư (và cả spam).");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gửi email xác minh thất bại.";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleCheckVerified = async () => {
    setError("");
    setInfo("");
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }
    try {
      setChecking(true);
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      await refreshMe();
      const refreshedUser = auth.currentUser;
      const verified = !!refreshedUser?.emailVerified;
      if (verified) {
        setInfo("Tài khoản đã được xác minh. Đang chuyển hướng...");
        router.push("/search");
      } else {
        setError("Chưa thấy xác minh. Vui lòng kiểm tra email và nhấn liên kết xác nhận.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không kiểm tra được trạng thái xác minh.";
      setError(msg);
    } finally {
      setChecking(false);
    }
  };

  return (
    <AuthLayout
      title="Xác minh tài khoản"
      subtitle="Kiểm tra email của bạn và xác nhận để tiếp tục sử dụng GoRail"
      footer={
        <Body className="text-sm text-gray-500">
          Nếu đã xác minh thành công nhưng vẫn bị kẹt, hãy đăng nhập lại hoặc thử trình duyệt khác.
        </Body>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <Body className="text-sm font-semibold text-gray-900">Email cần xác minh</Body>
            <Small className="text-gray-600">{email || "(không tìm thấy email)"}</Small>
          </div>
        </div>

        {info ? (
          <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
            <Small className="text-green-700 font-medium">{info}</Small>
          </div>
        ) : null}

        {error ? (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
            <Small className="text-red-700 font-medium">{error}</Small>
          </div>
        ) : null}

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={sending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {sending ? "Đang gửi..." : "Gửi lại email xác minh"}
          </button>
          
          <button
            type="button"
            onClick={handleCheckVerified}
            disabled={checking}
            className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {checking ? "Đang kiểm tra..." : "Tôi đã xác minh, kiểm tra lại"}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
            <Clock className="h-4 w-4" />
            <span>Thời gian email đến có thể mất 1-2 phút.</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
