import React, { Suspense } from "react";
import LoginClient from "@/components/auth/LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <LoginClient />
    </Suspense>
  );
}
