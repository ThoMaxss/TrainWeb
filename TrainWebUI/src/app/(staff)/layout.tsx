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
      <div className="min-h-screen bg-background" role="main" aria-label="Staff Portal">
        <Header />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </StaffGuard>
  )
}
