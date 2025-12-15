'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear only the current key
    localStorage.removeItem('gorail_user');
    
    console.log('✅ Logged out successfully');
    
    // Redirect to login after 1 second
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Đang đăng xuất...</h1>
        <p className="text-muted-foreground">Bạn sẽ được chuyển về trang đăng nhập</p>
      </div>
    </div>
  );
}
