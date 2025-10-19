'use client';

import { UserGuard } from '@/components/auth/RouteGuard';
import { Header } from '@/components/shared/Header';

// 🎨 Enhanced user layout with unified design system and security
export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserGuard showFallback={true}>
      <div className="min-h-screen bg-card" role="main" aria-label="User Area">
        <Header />
        <main className="container mx-auto px-2 py-5" role="main">
          {children}
        </main>
      </div>
    </UserGuard>
  );
}
