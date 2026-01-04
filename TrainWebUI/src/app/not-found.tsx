import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Không tìm thấy trang</h1>
        <p className="text-muted-foreground mb-6">
          Trang bạn đang truy cập không tồn tại hoặc đã bị di chuyển. Hãy kiểm tra URL hoặc quay lại trang chủ.
        </p>

        <div className="flex justify-center gap-3">
          <Link href="/" className="px-6 py-3 bg-primary text-white rounded-xl">Về trang chủ</Link>
          <Link href="/search" className="px-6 py-3 border border-border rounded-xl">Tìm chuyến</Link>
        </div>
      </div>
    </div>
  );
}
