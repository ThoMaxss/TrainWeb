"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
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
        <Body className="text-sm text-muted-foreground">
          Nếu đã xác minh thành công nhưng vẫn bị kẹt, hãy đăng nhập lại hoặc thử trình duyệt khác.
        </Body>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-3">
          <Mail className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <Body className="text-sm font-semibold">Email cần xác minh</Body>
            <Small className="text-muted-foreground">{email || "(không tìm thấy email)"}</Small>
          </div>
        </div>

        {info ? (
          <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
            <Small className="text-primary font-medium">{info}</Small>
          </div>
        ) : null}

        {error ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
            <Small className="text-destructive font-medium">{error}</Small>
          </div>
        ) : null}

        <div className="space-y-3">
          <Button className="w-full" onClick={handleResend} disabled={sending}>
            {sending ? "Đang gửi..." : "Gửi lại email xác minh"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleCheckVerified} disabled={checking}>
            {checking ? "Đang kiểm tra..." : "Tôi đã xác minh, kiểm tra lại"}
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Thời gian email đến có thể mất 1-2 phút.</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
