"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Đã xảy ra lỗi</h1>
        <p className="text-muted-foreground mb-6">Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại.</p>

        <div className="flex gap-3 justify-center">
          <button onClick={() => reset()} className="px-6 py-3 bg-primary text-white rounded-xl">
            Thử lại
          </button>
          <Link href="/" className="px-6 py-3 border border-border rounded-xl">Về trang chủ</Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left p-4 bg-muted rounded-lg text-sm">
            <summary className="font-medium cursor-pointer">Chi tiết lỗi</summary>
            <pre className="whitespace-pre-wrap mt-2 text-xs">{String(error.stack || error.message)}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
