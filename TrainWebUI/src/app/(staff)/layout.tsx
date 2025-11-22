'use client';

import { StaffGuard } from '@/components/auth/RouteGuard';
import { Header } from '@/components/shared/Header';

export default function StaffProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StaffGuard showFallback={true}>
      <div className="min-h-screen bg-card" role="main" aria-label="Staff Portal">
        <Header />
        <main className="container mx-auto px-2 py-5">
          {children}
        </main>
      </div>
    </StaffGuard>
  )
}
