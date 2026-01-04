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
    <div className="min-h-screen bg-background">
      <Header />
      <UserGuard showFallback={true}>
        <main className="container mx-auto px-2 py-5">
          {children}
        </main>
      </UserGuard>
    </div>
  );
}
