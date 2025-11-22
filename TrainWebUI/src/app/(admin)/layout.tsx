'use client';

import { AdminGuard } from '@/components/auth/RouteGuard';
import { Header } from '@/components/shared/Header';
import { ToastProvider } from '@/components/ui/toast';

export default function AdminProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard showFallback={true}>
      <ToastProvider>
        <div className="min-h-screen bg-card">
          <Header />
          <main className="container mx-auto px-2 py-5">
            {children}
          </main>
        </div>
      </ToastProvider>
    </AdminGuard>
  )
}
